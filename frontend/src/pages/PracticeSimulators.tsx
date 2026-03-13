import { Link } from 'react-router-dom';
import AdSense from '../components/AdSense';
import Seo from '../components/Seo';
import { examList } from '../data/exams';
import './PracticeSimulators.css';

function PracticeSimulators() {
  return (
    <div className="practice-hub-page">
      <Seo
        title="Azure Practice Simulators | AZ-305 and AZ-700 Mock Assessments"
        description="Browse dedicated AZ-305 and AZ-700 practice simulator pages with instant feedback, topic summaries, and role-based Azure exam prep."
        path="/practice-simulators"
        keywords="Azure practice simulators, AZ-305 practice test, AZ-700 practice test, Azure exam prep"
      />

      <section className="practice-hub-hero">
        <div className="practice-hub-hero__content">
          <div className="practice-hub-hero__badge">Role-Based Practice</div>
          <h1>Azure Practice Simulators</h1>
          <p>
            Choose a dedicated route for the exam you are studying and run a focused practice flow with instant answer
            checking, rationale review, and topic-based score summaries.
          </p>
          <div className="practice-hub-hero__actions">
            <Link to="/az-305-practice-simulator" className="practice-hub-btn practice-hub-btn--primary">
              Start AZ-305
            </Link>
            <Link to="/az-700-practice-simulator" className="practice-hub-btn practice-hub-btn--secondary">
              Start AZ-700
            </Link>
          </div>
        </div>
      </section>

      <section className="practice-hub-directory">
        <div className="practice-hub-heading">
          <h2>Dedicated exam routes</h2>
          <p>Each simulator page has its own positioning, exam focus, and study path inside the app.</p>
        </div>

        <div className="practice-hub-grid">
          {examList.map((exam) => (
            <article key={exam.key} className={`practice-card practice-card--${exam.key}`}>
              <div className="practice-card__topline">
                <span className="practice-card__icon">{exam.icon}</span>
                <span className="practice-card__eyebrow">{exam.eyebrow}</span>
              </div>
              <h3>{exam.headline}</h3>
              <p>{exam.cardDescription}</p>
              <div className="practice-card__chips">
                <span>{exam.questionCount}</span>
                {exam.highlightPills.map((pill) => (
                  <span key={pill}>{pill}</span>
                ))}
              </div>
              <ul className="practice-card__topics">
                {exam.focusAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
              <Link to={exam.route} className="practice-card__cta">
                Open {exam.label} Simulator
              </Link>
            </article>
          ))}
        </div>
      </section>

      <AdSense format="horizontal" className="practice-hub-ad" />

      <section className="practice-hub-method">
        <div className="practice-hub-heading">
          <h2>How the flow works</h2>
        </div>
        <div className="practice-hub-method__grid">
          <article>
            <h3>Choose your track</h3>
            <p>Pick the architecture or networking route that matches the exam objective you are studying.</p>
          </article>
          <article>
            <h3>Check before next</h3>
            <p>Every question stays on screen until you validate your answer and review the explanation.</p>
          </article>
          <article>
            <h3>Review weak domains</h3>
            <p>Results are grouped by detected topic so you can aim the next study session more precisely.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default PracticeSimulators;
