  export interface Snippet {
    id: number;
    title: string;
    content: string;
    userId: number;
    description: string | null;
    gistId: string | null;
    gistUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }