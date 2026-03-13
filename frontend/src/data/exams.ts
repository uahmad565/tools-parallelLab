export type ExamKey = 'az-305' | 'az-700';

export interface TopicRule {
  name: string;
  keywords: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ExamDefinition {
  key: ExamKey;
  label: string;
  route: string;
  dataUrl: string;
  icon: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  cardDescription: string;
  questionCount: string;
  highlightPills: string[];
  focusAreas: string[];
  simulatorIntro: string;
  benefits: string[];
  faq: FaqItem[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  topicRules: TopicRule[];
}

export const examCatalog: Record<ExamKey, ExamDefinition> = {
  'az-305': {
    key: 'az-305',
    label: 'AZ-305',
    route: '/az-305-practice-simulator',
    dataUrl: '/exams/az-305.json',
    icon: '🏗️',
    eyebrow: 'Azure Solutions Architect Expert',
    headline: 'AZ-305 Practice Simulator',
    subtitle:
      'Rehearse architecture decisions across compute, storage, identity, networking, governance, and business continuity with instant answer review.',
    cardDescription:
      'Use a dedicated landing page and simulator for architecture-heavy Azure practice sessions built around explanation-first review.',
    questionCount: '111 unique questions',
    highlightPills: ['Scenario-heavy practice', 'Topic scorecards', 'Instant rationale review'],
    focusAreas: [
      'Compute design',
      'Storage and data',
      'Identity and access',
      'Networking',
      'Business continuity',
      'Governance',
    ],
    simulatorIntro:
      'This route is built as an exam-specific practice page: you get crawlable context up front, then a full in-app simulator once you start.',
    benefits: [
      'Review one question at a time before moving forward.',
      'See rationale text as soon as you check your answer.',
      'Finish with topic-level scoring so weak domains are obvious.',
    ],
    faq: [
      {
        question: 'What does this AZ-305 simulator cover?',
        answer:
          'It focuses on Azure architecture decisions across compute, data, identity, networking, governance, and resiliency.',
      },
      {
        question: 'How does the practice flow work?',
        answer:
          'You choose an answer, check it, review the rationale and correct option list, then continue to the next question.',
      },
      {
        question: 'Is it useful for weak-area review?',
        answer:
          'Yes. The results table groups performance by topic so you can see which architecture domains need another pass.',
      },
    ],
    seoTitle: 'AZ-305 Practice Simulator | Azure Solutions Architect Mock Assessment',
    seoDescription:
      'Practice AZ-305 with an Azure Solutions Architect simulator covering compute, storage, identity, networking, governance, and business continuity.',
    seoKeywords:
      'AZ-305 practice simulator, Azure Solutions Architect practice test, AZ-305 mock assessment, AZ-305 exam questions',
    topicRules: [
      { name: 'Compute Design', keywords: ['app service', 'virtual machine', 'aks', 'function'] },
      { name: 'Data Storage', keywords: ['storage', 'blob', 'sql', 'cosmos', 'data lake'] },
      { name: 'Identity and Access', keywords: ['entra', 'identity', 'rbac', 'key vault', 'managed identity'] },
      { name: 'Networking', keywords: ['vnet', 'gateway', 'firewall', 'private endpoint', 'dns'] },
      { name: 'Business Continuity', keywords: ['backup', 'disaster', 'availability', 'replication'] },
      { name: 'Governance', keywords: ['policy', 'cost', 'monitor', 'compliance'] },
    ],
  },
  'az-700': {
    key: 'az-700',
    label: 'AZ-700',
    route: '/az-700-practice-simulator',
    dataUrl: '/exams/az-700.json',
    icon: '🌐',
    eyebrow: 'Azure Network Engineer Associate',
    headline: 'AZ-700 Practice Simulator',
    subtitle:
      'Practice Azure networking questions covering virtual networks, connectivity, security, load balancing, DNS, and monitoring with feedback after every answer.',
    cardDescription:
      'Launch a networking-focused practice flow with topic summaries, exam-specific positioning, and a direct route into the simulator.',
    questionCount: '180 unique questions',
    highlightPills: ['Connectivity depth', 'Networking focus', 'Question-by-question feedback'],
    focusAreas: [
      'Virtual networks',
      'Hybrid connectivity',
      'Security controls',
      'Load balancing',
      'DNS',
      'Monitoring and ops',
    ],
    simulatorIntro:
      'This page is designed as a dedicated AZ-700 landing route with an embedded simulator, so the exam content and the tool stay in one place.',
    benefits: [
      'Work through networking questions in a fixed check-answer-next loop.',
      'Inspect rationale text before you continue.',
      'Use the topic summary to pinpoint weak networking domains quickly.',
    ],
    faq: [
      {
        question: 'What does this AZ-700 simulator focus on?',
        answer:
          'It focuses on Azure networking domains such as virtual networks, hybrid connectivity, security, load balancing, DNS, and monitoring.',
      },
      {
        question: 'Do you get feedback after each question?',
        answer:
          'Yes. Every question is checked in place, with rationale and correct answers shown before you move to the next one.',
      },
      {
        question: 'Can you use it for short review sessions?',
        answer:
          'Yes. The simulator is optimized for quick networking practice loops and repeat attempts.',
      },
    ],
    seoTitle: 'AZ-700 Practice Simulator | Azure Networking Mock Assessment',
    seoDescription:
      'Practice AZ-700 with a dedicated Azure networking simulator covering virtual networks, connectivity, security, load balancing, DNS, and operations.',
    seoKeywords:
      'AZ-700 practice simulator, Azure networking practice test, AZ-700 mock assessment, Azure network engineer questions',
    topicRules: [
      { name: 'Virtual Networks', keywords: ['vnet', 'subnet', 'ip address'] },
      { name: 'Connectivity', keywords: ['vpn', 'expressroute', 'gateway', 'peering'] },
      { name: 'Security', keywords: ['nsg', 'firewall', 'waf', 'key vault'] },
      { name: 'Load Balancing', keywords: ['load balancer', 'application gateway', 'front door'] },
      { name: 'DNS and Name Resolution', keywords: ['dns', 'private dns'] },
      { name: 'Monitoring and Ops', keywords: ['monitor', 'log analytics', 'diagnostic'] },
    ],
  },
};

export const examList = Object.values(examCatalog);
