import { Loader2, PhoneCall, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCrm from "@/hooks/useCrm";

export default function ActiveCollection() {
  const { loading, getNextCall } = useCrm();

  const handlerSubmit = async () => {
    await getNextCall();
  };

  return (
    <Card className="w-[380px]">
      <CardContent className="grid gap-4 mt-7">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <PhoneCall />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Ligações de cobrança
            </p>
            <p className="text-sm text-muted-foreground">
              Ao clicar no botão uma chamada será associada ao seu usuário!
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlerSubmit} className="w-full">
          <span className="sr-only md:not-sr-only">Iniciar chamada</span>
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
