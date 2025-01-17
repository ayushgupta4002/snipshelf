  export interface Snippet {
    id: number;
    title: string;
    content: string;
    userId: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }