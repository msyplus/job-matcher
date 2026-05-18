export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  city TEXT,
  jobStatus TEXT DEFAULT 'active',
  preferences TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS educations (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  school TEXT NOT NULL,
  major TEXT NOT NULL,
  degree TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_experiences (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  workExperienceId TEXT NOT NULL REFERENCES work_experiences(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  techStack TEXT,
  achievements TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  proficiency INTEGER NOT NULL,
  years INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_descriptions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  rawText TEXT NOT NULL,
  parsedResult TEXT,
  sourceUrl TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generated_resumes (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  jdId TEXT REFERENCES job_descriptions(id),
  template TEXT DEFAULT 'classic',
  content TEXT NOT NULL DEFAULT '{"sections":[]}',
  pdfPath TEXT,
  status TEXT DEFAULT 'draft',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  resumeId TEXT REFERENCES generated_resumes(id),
  platform TEXT NOT NULL,
  jobTitle TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT DEFAULT 'applied',
  appliedAt DATETIME NOT NULL,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id),
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  contact TEXT,
  status TEXT DEFAULT 'pending',
  adminNote TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommended_jobs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary TEXT,
  description TEXT,
  sourceUrl TEXT,
  sourcePlatform TEXT DEFAULT 'boss',
  matchScore INTEGER DEFAULT 0,
  matchDetails TEXT,
  status TEXT DEFAULT 'new',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
