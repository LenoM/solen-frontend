import * as yup from "yup";

export const invoiceBaseSchema = {
  id: yup.number().nullable(),
  invoiceNumber: yup.string(),
  isAgreement: yup.boolean(),
  clientId: yup.number(),
  barCode: yup.string(),
  originalDueDate: yup.date(),
  referenceDate: yup.date(),
  creationDate: yup.date(),
  paymentDate: yup.date(),
  cancelDate: yup.date(),
  deleteDate: yup.date(),
  dueDate: yup.date(),
  price: yup.number().default(0),
};

const invoiceSchema = yup.object().shape({
  ...invoiceBaseSchema,
});

export type InvoiceType = yup.InferType<typeof invoiceSchema>;

export default function Invoice() {
  return <p>Lista de boletos</p>;
}
