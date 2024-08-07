import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReportForm from "@/features/custom-report/form";

export default function ReportDetail() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center">Relatório</h1>
          </CardHeader>
          <CardContent>
            <ReportForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
