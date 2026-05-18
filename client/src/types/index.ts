export interface Education {
  id: string;
  userId: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workExperienceId: string;
  name: string;
  role: string;
  description: string;
  techStack: string[];
  achievements: string;
  createdAt: string;
}

export interface WorkExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  projects: Project[];
  createdAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  proficiency: number;
  years: number;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  name: string;
  issuer: string;
  date: string;
  createdAt: string;
}

export interface JobDescription {
  id: string;
  userId: string;
  rawText: string;
  parsedResult: {
    position?: string;
    company?: string;
    location?: string;
    salaryRange?: string;
    requiredSkills?: string[];
    preferredSkills?: string[];
    education?: string;
    yearsRequired?: string;
    keywords?: string[];
  } | null;
  sourceUrl: string;
  createdAt: string;
}

export interface GeneratedResume {
  id: string;
  userId: string;
  jdId: string;
  template: string;
  content: {
    sections?: Array<{
      type: string;
      title: string;
      locked: boolean;
      body: string;
    }>;
    matchScore?: number;
    jdKeywords?: string[];
  };
  pdfPath: string;
  status: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  resumeId: string;
  platform: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
  notes: string;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  viewed: number;
  screening: number;
  interview: number;
  offer: number;
  rejected: number;
  interviewRate: string;
}
