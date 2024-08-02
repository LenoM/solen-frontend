import { number, string } from "yup";

export type Entity = {
  id: number;
  name?: string;
  description?: string;
};

export const entityBaseSchema = {
  id: number().nullable(),
  name: string().nullable(),
  description: string().nullable(),
};

export const kinshipArray = [
  { id: "Conjuge", name: "Cônjuge" },
  { id: "Enteado", name: "Enteado" },
  { id: "Filho", name: "Filho" },
  { id: "Mae", name: "Mãe" },
  { id: "Pai", name: "Pai" },
];
