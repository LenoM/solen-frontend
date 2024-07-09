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

    const response = await fetcher.get("crm/next-call");

    if (response) {
      navigate(`/client/${response}`);
    }

    if (response === undefined) {
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
