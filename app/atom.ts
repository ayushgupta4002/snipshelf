import exp from "constants";
import { atom } from "recoil";

export interface userAtom {
  id: number;
  email: string;
  name: string | null;
  apiKey: string;
  githubToken: string | null;
}

export interface snippetAtom {
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



export const userAtom = atom<userAtom>({
  key: "userAtom",
  default: {
    id: 0,
    email: "",
    name: null,
    apiKey: "",
    githubToken: null,
  },
});

export const snippetAtom = atom<snippetAtom[]>({
  key: "snippetAtom",
  default: [],
})
