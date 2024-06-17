import { Card, CardContent, CardHeader } from "@/components/ui/card";

import InvoiceForm from "@/features/invoice/forms/invoice";

export default function InvoiceDetail() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center">
              Cadastro de boleto
            </h1>
          </CardHeader>
          <CardContent>
            <InvoiceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
