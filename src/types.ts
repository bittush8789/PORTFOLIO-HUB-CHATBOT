export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  series?: string;
  seriesPart?: number;
  tags: string[];
  image: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Profile {
  name: string;
  bio: string;
  skills: string[];
  image: string;
  socials: {
    linkedin?: string;
    github?: string;
    blog?: string;
    twitter?: string;
  };
}
