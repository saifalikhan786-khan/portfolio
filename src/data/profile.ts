export interface Experience {
  title: string
  company: string
  companyUrl?: string
  employmentType: string
  location: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  duration: string
  description: string
  responsibilities: string[]
}

export interface Education {
  degree: string
  fieldOfStudy?: string
  institution: string
  location?: string
  startYear: number
  endYear: number
  durationYears: number
}

export interface Certification {
  name: string
  issuer?: string
  issuedDate?: string
  expiryDate?: string
  credentialUrl?: string
  category: string
  notes?: string
}

export interface Project {
  title: string
  type: string
  description: string
  technologies: string[]
}

export interface Activity {
  type: string
  topic: string
  summary: string
  hashtags?: string[]
}

export const profile = {
  personal: {
    fullName: 'Saif Ali Khan',
    headline:
      'Platform Product Support Engineer II @ Dynatrace | Dynatrace 10x Certified / AI Enthusiast',
    title: 'Platform Product Support Engineer | Observability & APM Expert',
    tagline:
      'Dynatrace 10x Certified | AI Enthusiast | Building smarter observability solutions',
    avatar: 'image_user.png',
    location: 'Bengaluru, Karnataka, India',
    email: 'saifallikhan560@gmail.com',
    phone: '+91 8660924001',
    linkedin: 'https://www.linkedin.com/in/saif-ali-khan-913168173',
    totalExperience: '4+ years',
    connections: 500,
    followers: 920,
  },
  about: {
    summary:
      'Detail-oriented technical product specialist skilled in Dynatrace implementations and collaborative problem-solving. Experience includes providing technical guidance across diverse platforms, enhancing application performance monitoring, and delivering actionable insights to drive customer success. Software engineer specializing in APM and observability. Passionate about platform product management, AI, and technology.',
  },
  experience: [
    {
      title: 'Platform Product Support Engineer II',
      company: 'Dynatrace',
      companyUrl: 'https://www.linkedin.com/company/dynatrace',
      employmentType: 'Full-time',
      location: 'Bengaluru, Karnataka, India · On-site',
      startDate: '2026-06',
      endDate: null,
      isCurrent: true,
      duration: 'Current',
      description:
        'Working on AI-powered observability platform solutions including infrastructure observability, application observability, digital experience, log analytics, application security, threat observability, software delivery, and business analytics.',
      responsibilities: [],
    },
    {
      title: 'Platform Product Specialist II',
      company: 'Dynatrace',
      companyUrl: 'https://www.linkedin.com/company/dynatrace',
      employmentType: 'Full-time',
      location: 'Bengaluru, Karnataka, India · On-site',
      startDate: '2026-02',
      endDate: '2026-06',
      isCurrent: false,
      duration: '5 mos',
      description:
        'Platform Product Specialist role focused on Dynatrace observability platform support, customer enablement, and product expertise across infrastructure and application monitoring.',
      responsibilities: [],
    },
    {
      title: 'Technical Product Specialist (Level 2)',
      company: 'IonIdea',
      companyUrl: 'https://www.linkedin.com/company/ionidea',
      employmentType: 'Full-time',
      location: 'Bangalore, Karnataka, India',
      startDate: '2024-05',
      endDate: '2026-02',
      isCurrent: false,
      duration: '1 yr 9 mos',
      description:
        'Technical Product Specialist role supporting Dynatrace customers via IonIdea.',
      responsibilities: [
        'Utilized Zendesk expertise to deliver customer value on Dynatrace product topics including Kubernetes, AWS, Cloud, OneAgent, ActiveGate, DEM, SaaS gen3, and Managed.',
        'Collaborated with cross-functional teams to enhance customer support.',
        'Recommended installation of OneAgent, ActiveGate, and DEM with configuration changes across platforms.',
        'Provided proactive support to customers regarding upcoming outages and failures.',
      ],
    },
    {
      title: 'Software Engineer - APM (Dynatrace ACE Consultant)',
      company: 'IonIdea',
      companyUrl: 'https://www.linkedin.com/company/ionidea',
      employmentType: 'Full-time',
      location: 'Bangalore, Karnataka, India',
      startDate: '2022-05',
      endDate: '2024-05',
      isCurrent: false,
      duration: '2 yrs',
      description:
        'Software Engineer focused on Application Performance Monitoring using Dynatrace as an ACE Consultant.',
      responsibilities: [
        'Delivered technical guidance to customers for installation, operation, and maintenance processes.',
        'Collaborated with engineers and cross-functional teams for comprehensive application monitoring.',
        'Conducted monitoring analysis and participated in major incident calls with stakeholders.',
        'Generated monthly reports on problem trends and DDU consumption.',
        'Authored installation documentation for OneAgent across various operating systems.',
        'Managed critical customer calls during outages, providing actionable best practices.',
      ],
    },
    {
      title: 'Intern',
      company: 'IonIdea',
      companyUrl: 'https://www.linkedin.com/company/ionidea',
      employmentType: 'Internship',
      location: 'Bangalore, Karnataka, India',
      startDate: '2022-02',
      endDate: '2022-04',
      isCurrent: false,
      duration: '2 mos',
      description:
        'Internship role at IonIdea, beginning career in Dynatrace and observability.',
      responsibilities: [
        'Implemented the Dynatrace solution to enhance monitoring of application performance and user experience.',
        'Assisted the team in developing project plans and timelines for client initiatives.',
        'Conducted research to support strategic decision-making and project proposals.',
        'Collaborated with cross-functional teams to gather requirements and implement solutions.',
      ],
    },
  ] satisfies Experience[],
  education: [
    {
      degree: 'Bachelor of Engineering (BE)',
      fieldOfStudy: 'Electronics and Communication Engineering',
      institution: 'Ghousia College of Engineering',
      location: 'Ramanagaram, Karnataka, India',
      startYear: 2015,
      endYear: 2019,
      durationYears: 4,
    },
    {
      degree: 'Science PUC (PCMB)',
      fieldOfStudy: 'Physics, Chemistry, Mathematics, Biology',
      institution: 'Bharathi Composite PU College',
      startYear: 2013,
      endYear: 2015,
      durationYears: 2,
    },
    {
      degree: 'SSLC (High School)',
      institution: 'Vijaya Vidya Samasthe',
      startYear: 2012,
      endYear: 2013,
      durationYears: 1,
    },
  ] satisfies Education[],
  certifications: [
    {
      name: 'Dynatrace 10x Certified',
      category: 'Dynatrace',
      notes: 'Implementation Professional, Associate, Essentials, Sales & Sales Specialist',
    },
    {
      name: 'Dynatrace Implementation Professional',
      issuer: 'Dynatrace',
      category: 'Dynatrace',
    },
    {
      name: 'Dynatrace Associate',
      issuer: 'Dynatrace',
      issuedDate: '2022-06',
      category: 'Dynatrace',
      credentialUrl: 'https://credly.com/badges/a9e31348-4e81-4019-8ebb-561798a5961e',
    },
    {
      name: 'Anthropic Claude Certified Architect – Foundations (CCA-F)',
      issuer: 'Anthropic',
      category: 'AI',
      notes: 'Among first professionals to achieve this certification',
    },
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      category: 'Cloud',
    },
    {
      name: 'Oracle Cloud, Database, AI Professional',
      issuer: 'Oracle',
      category: 'Cloud',
    },
    {
      name: 'Astronomer Certification for Apache Airflow DAG Authoring',
      issuer: 'Astronomer',
      category: 'Data',
    },
    {
      name: 'Nutanix Hybrid Cloud Fundamentals',
      issuer: 'Nutanix',
      category: 'Cloud',
    },
    {
      name: 'Fortinet Cybersecurity Certified Associate',
      issuer: 'Fortinet',
      category: 'Security',
    },
    {
      name: 'Databricks Fundamentals',
      issuer: 'Databricks',
      category: 'Data',
    },
  ] satisfies Certification[],
  skills: {
    technical: [
      'Dynatrace Observability',
      'Application Performance Monitoring',
      'Kubernetes',
      'AWS',
      'Python',
      'Java',
      'OneAgent & ActiveGate',
      'DEM Monitoring',
      'Apache Airflow',
      'Oracle Database',
      'Data Engineering',
      'IoT',
      'Zendesk',
    ],
    professional: [
      'Platform Product Management',
      'Observability',
      'AI / Generative AI',
      'Agentic AI',
      'Problem Analysis',
      'Customer Success',
      'Incident Management',
      'Technical Support',
    ],
  },
  skillLevels: [
    { skill: 'Dynatrace / APM', level: 95 },
    { skill: 'Kubernetes & Cloud', level: 85 },
    { skill: 'Python & Java', level: 78 },
    { skill: 'AI & Agentic Systems', level: 82 },
    { skill: 'Customer Success', level: 90 },
    { skill: 'Incident Management', level: 88 },
  ],
  languages: [
    { language: 'English', proficiency: 'Professional' },
    { language: 'Kannada', proficiency: 'Native' },
    { language: 'Hindi', proficiency: 'Native' },
    { language: 'Urdu', proficiency: 'Native' },
  ],
  projects: [
    {
      title: 'IoT Based Intelligent Vehicle Accident Prevention',
      type: 'Final Year Project',
      description:
        'Intelligent vehicle accident prevention system using eye blink sensor for driver fatigue detection.',
      technologies: ['IoT', 'Eye Blink Sensor', 'Embedded Systems'],
    },
    {
      title: 'Automatic Water Distribution System',
      type: 'Internship Project',
      description:
        'Industrial automation project using PLC & SCADA for automatic water distribution.',
      technologies: ['PLC', 'SCADA', 'Industrial Automation'],
    },
  ] satisfies Project[],
  careerHighlights: [
    'Grew from intern to Platform Product Support Engineer II over 4+ years in the Dynatrace ecosystem',
    'Dynatrace 10x Certified professional with Implementation Professional credential',
    'Transitioned from IonIdea to direct Dynatrace employment',
    'Active in observability, platform product, generative AI, and agentic AI domains',
    'Experienced in major incident management and customer-facing technical support',
  ],
  recentActivity: [
    {
      type: 'post',
      topic: 'Career Journey',
      summary:
        'Reflected on 4-year journey in observability at Dynatrace, from intern to deeper platform expertise.',
      hashtags: ['Dynatrace', 'Observability', 'CareerJourney', 'AgenticAI'],
    },
    {
      type: 'post',
      topic: 'Dynatrace Implementation Professional',
      summary:
        'Successfully cleared Dynatrace Implementation Professional Certification as a Product Specialist.',
    },
    {
      type: 'post',
      topic: 'Claude Certified Architect – Foundations',
      summary:
        'Achieved CCA-F certification from Anthropic; deep dive into architecting with advanced AI systems.',
    },
    {
      type: 'post',
      topic: 'Apache Airflow Certification',
      summary:
        'Cleared Astronomer Certification for Apache Airflow DAG Authoring for scalable data pipelines.',
    },
  ] satisfies Activity[],
  themes: [
    'Application Performance Monitoring',
    'Platform Observability',
    'Dynatrace Ecosystem',
    'AI & Agentic AI',
    'Cloud & Kubernetes',
    'Customer Success',
  ],
  metrics: {
    experienceYears: 4,
    certifications: 10,
    companies: 2,
    skills: 21,
    projects: 2,
  },
}

export type SectionId =
  | 'overview'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'education'
  | 'projects'
  | 'contact'

export const navItems: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'experience', label: 'Experience', icon: 'briefcase' },
  { id: 'skills', label: 'Skills', icon: 'cpu' },
  { id: 'certifications', label: 'Certifications', icon: 'award' },
  { id: 'education', label: 'Education', icon: 'graduation-cap' },
  { id: 'projects', label: 'Projects', icon: 'folder-kanban' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
]
