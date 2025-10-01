export interface Course {
  id: string;
  name: string;
  code: string;
}

export interface Section {
  id: string;
  courseId: string;
  professor: string;
  schedule: string;
  campus: string;
  rating: 'positive' | 'neutral' | 'negative' | null;
  nrc: string;
  modalidad: string;
}

export interface SearchResult {
  courses: Course[];
  sections: Section[];
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  username: string;
  isAdmin: boolean;
}