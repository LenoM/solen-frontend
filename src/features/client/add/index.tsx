import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Personal, { loadClientData } from "@/features/client/forms/personal";

export default function ClientAdd() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
              <h1 className="text-3xl font-bold text-center">
                Cadastro de cliente
              </h1>
          </CardHeader>
          <CardContent>
            <Personal {...loadClientData()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
