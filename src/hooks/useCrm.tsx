import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import useFetcher from "@/lib/request";

export default function useCrm() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getNextCall = async () => {
    setLoading(true);

    const response = await fetcher.get<number>("crm/next-call");

    if (response && response > 0) {
      navigate(`/client/${response}`);

      toast.info("Ligação iniciada", {
        description: "Verifique o histórico de chamadas",
      });
    }

    if (Number(response) === -1) {
      toast.success("Parabéns!", {
        description: "Não há novas ligações",
      });
    }

    setLoading(false);
  };

  return {
    loading,
    getNextCall,
  };
}
