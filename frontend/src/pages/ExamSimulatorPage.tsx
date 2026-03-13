import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { type ExamDefinition, type ExamKey, examCatalog } from '../data/exams';
import './ExamSimulatorPage.css';

interface ExamSimulatorPageProps {
  examKey: ExamKey;
}

interface RawChoice {
  id?: string | number;
  text?: string;
  isCorrect?: boolean;
}

interface RawQuestion {
  question?: string;
  rationale?: string;
  choices?: RawChoice[];
  correctAnswers?: RawChoice[];
}

interface RawExamDataset {
  questions?: RawQuestion[];
}

interface NormalizedChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface NormalizedQuestion {
  id: string;
  question: string;
  rationale: string;
  multiple: boolean;
  choices: NormalizedChoice[];
  correctKeys: Set<string>;
  topic: string;
}

interface CheckedResponse {
  checked: boolean;
  selectedKeys: string[];
  isCorrect: boolean;
  topic: string;
}

type SimulatorPhase = 'idle' | 'loading' | 'quiz' | 'results';

function ExamSimulatorPage({ examKey }: ExamSimulatorPageProps) {
  const exam = examCatalog[examKey];
  const simulatorRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<SimulatorPhase>('idle');
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, CheckedResponse>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);

  useEffect(() => {
    setPhase('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedKeys([]);
    setResponses({});
    setLoadError(null);
    setInteractionError(null);
  }, [examKey]);

  const currentQuestion = questions[currentIndex] ?? null;
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : null;
  const topicResults = buildTopicResults(questions, responses);
  const correctCount = Object.values(responses).filter((item) => item.isCorrect).length;
  const overallScore = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 1000) / 10;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: exam.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const startAssessment = async () => {
    try {
      setPhase('loading');
      setLoadError(null);
      setInteractionError(null);

      const response = await fetch(exam.dataUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Unable to load question set (${response.status})`);
      }

      const raw = (await response.json()) as RawExamDataset;
      const normalizedQuestions = (raw.questions ?? [])
        .map((item, index) => normalizeQuestion(item, index, exam))
        .filter((item): item is NormalizedQuestion => Boolean(item));

      if (normalizedQuestions.length === 0) {
        throw new Error('No usable questions were found for this exam.');
      }

      shuffleInPlace(normalizedQuestions);
      setQuestions(normalizedQuestions);
      setCurrentIndex(0);
      setSelectedKeys([]);
      setResponses({});
      setPhase('quiz');

      window.requestAnimationFrame(() => {
        simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load the simulator.';
      setLoadError(message);
      setPhase('idle');
    }
  };

  const handleSelectionChange = (choiceValue: string) => {
    if (!currentQuestion || currentResponse?.checked) {
      return;
    }

    setInteractionError(null);
    setSelectedKeys((currentSelections) => {
      if (currentQuestion.multiple) {
        return currentSelections.includes(choiceValue)
          ? currentSelections.filter((item) => item !== choiceValue)
          : [...currentSelections, choiceValue];
      }

      return [choiceValue];
    });
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) {
      return;
    }

    if (selectedKeys.length === 0) {
      setInteractionError('Select at least one option before checking your answer.');
      return;
    }

    const selectedSet = new Set(selectedKeys);
    const isCorrect = areSetsEqual(selectedSet, currentQuestion.correctKeys);

    setResponses((currentResponses) => ({
      ...currentResponses,
      [currentQuestion.id]: {
        checked: true,
        selectedKeys,
        isCorrect,
        topic: currentQuestion.topic,
      },
    }));

    setInteractionError(null);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentIndex >= questions.length - 1;
    if (isLastQuestion) {
      setPhase('results');
      window.requestAnimationFrame(() => {
        simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedKeys([]);
    setInteractionError(null);
  };

  const resetToOverview = () => {
    setPhase('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedKeys([]);
    setResponses({});
    setLoadError(null);
    setInteractionError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`exam-page exam-page--${exam.key}`}>
      <Seo
        title={exam.seoTitle}
        description={exam.seoDescription}
        path={exam.route}
        keywords={exam.seoKeywords}
        structuredData={structuredData}
      />

      <section className="exam-page__hero">
        <div className="exam-page__hero-copy">
          <div className="exam-page__eyebrow">{exam.eyebrow}</div>
          <h1>{exam.headline}</h1>
          <p>{exam.subtitle}</p>
          <div className="exam-page__badges">
            <span>{exam.questionCount}</span>
            {exam.highlightPills.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
          <div className="exam-page__hero-actions">
            <button type="button" className="exam-page__primary-btn" onClick={startAssessment} disabled={phase === 'loading'}>
              {phase === 'loading' ? `Loading ${exam.label} questions...` : `Start ${exam.label} Practice`}
            </button>
            <Link to="/practice-simulators" className="exam-page__secondary-btn">
              Browse all practice routes
            </Link>
          </div>
        </div>
      </section>

      <section className="exam-page__overview">
        <article className="exam-page__overview-card">
          <h2>Exam focus</h2>
          <p>{exam.simulatorIntro}</p>
          <ul>
            {exam.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </article>

        <article className="exam-page__overview-card">
          <h2>Coverage areas</h2>
          <div className="exam-page__topics">
            {exam.focusAreas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="exam-page__faq">
        {exam.faq.map((item) => (
          <article key={item.question} className="exam-page__faq-card">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="exam-page__simulator" id="simulator" ref={simulatorRef}>
        <div className="exam-page__simulator-header">
          <div>
            <div className="exam-page__eyebrow">Inline Simulator</div>
            <h2>{exam.headline}</h2>
          </div>
          <p>Run a check-answer-next loop without leaving the page.</p>
        </div>

        {phase === 'idle' && (
          <div className="exam-page__empty-state">
            <h3>Ready for a focused practice session?</h3>
            <p>Start the simulator when you want shuffled questions, instant answer checking, and topic-based results.</p>
            <button type="button" className="exam-page__primary-btn" onClick={startAssessment}>
              Launch {exam.label}
            </button>
          </div>
        )}

        {loadError && (
          <div className="exam-page__error">
            <strong>Load error:</strong> {loadError}
          </div>
        )}

        {phase === 'quiz' && currentQuestion && (
          <div className="exam-page__quiz">
            <div className="exam-page__status">
              <span>{exam.label} Practice Simulator</span>
              <span>Question {currentIndex + 1} / {questions.length}</span>
            </div>

            <div className="exam-page__question">
              <h3>{currentQuestion.question}</h3>
              <div className="exam-page__choices">
                {currentQuestion.choices.map((choice) => {
                  const key = choiceKey(choice);
                  const isSelected = (currentResponse?.selectedKeys ?? selectedKeys).includes(key);
                  const isCorrect = currentQuestion.correctKeys.has(key);
                  const isChecked = Boolean(currentResponse?.checked);
                  const toneClass = isChecked
                    ? isCorrect
                      ? 'exam-page__choice--correct'
                      : isSelected
                        ? 'exam-page__choice--incorrect'
                        : ''
                    : '';

                  return (
                    <label key={key} className={`exam-page__choice ${toneClass}`}>
                      <input
                        type={currentQuestion.multiple ? 'checkbox' : 'radio'}
                        name={currentQuestion.id}
                        checked={isSelected}
                        disabled={isChecked}
                        onChange={() => handleSelectionChange(key)}
                      />
                      <span>{choice.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {interactionError && <div className="exam-page__error">{interactionError}</div>}

            {currentResponse?.checked && (
              <div className="exam-page__feedback">
                <div className={`exam-page__feedback-status ${currentResponse.isCorrect ? 'is-correct' : 'is-wrong'}`}>
                  {currentResponse.isCorrect ? 'This answer is correct.' : 'This answer is incorrect.'}
                </div>
                <p>{currentQuestion.rationale || 'No rationale provided in the source data.'}</p>
                <div>
                  <h4>Correct answer(s)</h4>
                  <ul>
                    {currentQuestion.choices
                      .filter((choice) => currentQuestion.correctKeys.has(choiceKey(choice)))
                      .map((choice) => (
                        <li key={choice.id}>{choice.text}</li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="exam-page__simulator-actions">
              <button type="button" className="exam-page__primary-btn" onClick={handleCheckAnswer} disabled={Boolean(currentResponse?.checked)}>
                Check Your Answer
              </button>
              <button type="button" className="exam-page__secondary-btn" onClick={handleNextQuestion} disabled={!currentResponse?.checked}>
                {currentIndex >= questions.length - 1 ? 'See Results' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {phase === 'results' && (
          <div className="exam-page__results">
            <div className="exam-page__results-summary">
              <h3>{exam.label} Results</h3>
              <p>Score: {correctCount} / {questions.length} ({overallScore}%)</p>
            </div>

            <div className="exam-page__results-table-wrap">
              <table className="exam-page__results-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Correct</th>
                    <th>Total</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topicResults.map((item) => (
                    <tr key={item.topic}>
                      <td>{item.topic}</td>
                      <td>{item.correct}</td>
                      <td>{item.total}</td>
                      <td>{item.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="exam-page__simulator-actions">
              <button type="button" className="exam-page__primary-btn" onClick={startAssessment}>
                Restart {exam.label}
              </button>
              <button type="button" className="exam-page__secondary-btn" onClick={resetToOverview}>
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function normalizeQuestion(item: RawQuestion, index: number, exam: ExamDefinition): NormalizedQuestion | null {
  const questionText = normalizeTextPreserveLines(item.question);
  const choices = dedupeByText(
    (item.choices ?? []).map((choice, choiceIndex) => ({
      id: choice.id ? String(choice.id) : `q${index + 1}-c${choiceIndex + 1}`,
      text: normalizeText(choice.text),
      isCorrect: Boolean(choice.isCorrect),
    })),
  ).filter((choice) => choice.text);

  const correctKeys = new Set<string>();
  const correctCandidates = (item.correctAnswers ?? []).map((choice) => ({
    id: choice.id ? String(choice.id) : '',
    text: normalizeText(choice.text),
  }));

  for (const choice of choices) {
    if (choice.isCorrect) {
      correctKeys.add(choiceKey(choice));
    }
  }

  for (const candidate of correctCandidates) {
    if (!candidate.id && !candidate.text) {
      continue;
    }
    correctKeys.add(candidate.id ? `id:${candidate.id}` : `text:${candidate.text.toLowerCase()}`);
  }

  if (!questionText || choices.length < 2 || correctKeys.size === 0) {
    return null;
  }

  const rationaleText = normalizeTextPreserveLines(item.rationale);
  const topic = detectTopic(exam, `${questionText} ${normalizeText(rationaleText)}`);

  return {
    id: `question-${index + 1}`,
    question: questionText,
    rationale: rationaleText,
    multiple: correctKeys.size > 1,
    choices,
    correctKeys,
    topic,
  };
}

function buildTopicResults(questions: NormalizedQuestion[], responses: Record<string, CheckedResponse>) {
  const byTopic = new Map<string, { correct: number; total: number }>();

  for (const question of questions) {
    const stats = byTopic.get(question.topic) ?? { correct: 0, total: 0 };
    stats.total += 1;
    if (responses[question.id]?.isCorrect) {
      stats.correct += 1;
    }
    byTopic.set(question.topic, stats);
  }

  return Array.from(byTopic.entries())
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      score: stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 1000) / 10,
    }));
}

function detectTopic(exam: ExamDefinition, text: string) {
  const lowered = normalizeText(text).toLowerCase();
  for (const topic of exam.topicRules) {
    if (topic.keywords.some((keyword) => lowered.includes(keyword))) {
      return topic.name;
    }
  }
  return 'General';
}

function normalizeText(value: string | number | undefined) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeTextPreserveLines(value: string | undefined) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();
}

function choiceKey(choice: { id: string; text: string }) {
  return choice.id ? `id:${choice.id}` : `text:${normalizeText(choice.text).toLowerCase()}`;
}

function areSetsEqual(left: Set<string>, right: Set<string>) {
  if (left.size !== right.size) {
    return false;
  }

  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }

  return true;
}

function dedupeByText<T extends { text: string }>(choices: T[]) {
  const seen = new Set<string>();
  const output: T[] = [];

  for (const choice of choices) {
    const key = normalizeText(choice.text).toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(choice);
  }

  return output;
}

function shuffleInPlace<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

export default ExamSimulatorPage;
