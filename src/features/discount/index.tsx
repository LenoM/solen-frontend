import { object, number, InferType, string } from "yup";

const discountTypeSchema = object({
  id: number().nullable(),
  description: string().nullable(),
});

export type DiscountDataType = InferType<typeof discountTypeSchema>;
