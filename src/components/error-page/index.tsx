import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ErrorPage() {
  return (
    <section>
        
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <p className="text-9xl">😬</p>
        <p className="text-9xl">OOPS!</p>
        <p className="text-4xl">Ocorreu uma falha no sistema...</p>

        <Button
          onClick={() => window.location.reload()}
          className="mt-6 bg-green-700 hover:bg-green-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Recarregar...
        </Button>
      </div>
    </section>
  );
}
