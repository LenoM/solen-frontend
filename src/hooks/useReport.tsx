import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";

import type { ReportType } from "@/features/custom-report/form";
import { loadReportData } from "@/features/custom-report/form";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useReport() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState<ReportType>();

  const createReport = async (data: ReportType) => {
    setLoading(true);

    const { description, query } = data;

    const body: BodyInit = JSON.stringify({
      description,
      query,
    });

    const response = await fetcher.post<ReportType>("report", body);

    if (response) {
      setLoading(false);

      queryClient.setQueryData(["getReports"], (prev: ReportType[]) => {
        if (prev) {
          return [...prev, response];
        }
      });

      toast.success("Relatório adicionado", {
        description: "O relatório foi adicionado com sucesso",
      });

      return response;
    }

    setLoading(false);
  };

  const deleteReport = async (reportId: number) => {
    setLoading(true);

    const url = `report/${reportId}`;

    const response = await fetcher.del<ReportType>(url);

    if (response) {
      queryClient.setQueryData(["getReports"], (prev: ReportType[]) => {
        return prev?.filter((d) => d.id !== response.id);
      });

      toast.success("Relatório deletado", {
        description: `O relatório #${reportId} foi removido com sucesso!`,
      });
    }
    setLoading(false);
  };

  const updateReport = async (reportId: string, data: ReportType) => {
    setLoading(true);

    const { description, query } = data;

    const body: BodyInit = JSON.stringify({
      description,
      query,
    });

    const url = `report/${reportId}`;
    const response = await fetcher.put<ReportType>(url, body);

    if (response) {
      toast.success("Relatório salvo", {
        description: "O relatório foi salvo com sucesso",
      });

      queryClient.setQueryData(["getReports"], (prev: ReportType[]) => {
        if (prev) {
          const repIndex = prev.findIndex(
            (rep) => Number(rep.id) === Number(reportId)
          );

          const reports = [
            ...prev.slice(0, repIndex),
            response,
            ...prev.slice(repIndex + 1),
          ];

          setLoading(false);

          return reports;
        }
      });
    }

    setLoading(false);
  };

  const printReport = async (id: number, queryParam: FieldValues = {}) => {
    setLoading(true);

    const url = `report/print/${id}`
    const body: BodyInit = JSON.stringify({ ...queryParam });
    const response = await fetcher.post<{ url: string }>(url, body);

    if (response && response.url) {
      toast.success("Impressão de relatório", {
        description: `O relatório já está disponível`,
        action: {
          label: "Baixar",
          onClick: () => window.open(response.url),
        },
      });
    }

    setLoading(false);
  };

  const exportReport = async (id: number, queryParam: FieldValues = {}) => {
    setLoading(true);

    const url = `report/export/${id}`
    const body: BodyInit = JSON.stringify({ ...queryParam });
    const response = await fetcher.post<{ url: string }>(url, body);

    if (response && response.url) {
      toast.success("Exportação de relatório", {
        description: `O relatório já está disponível`,
        action: {
          label: "Baixar",
          onClick: () => window.open(response.url),
        },
      });
    }

    setLoading(false);
  };

  const getReportList = () => {
    return useQuery<ReportType[] | undefined>({
      queryKey: ["getReports"],
      queryFn: () => getReports(),
      refetchOnMount: false,
    });
  };

  const getReports = async (): Promise<ReportType[] | undefined> => {
    setLoading(true);

    const response = await fetcher.get<ReportType[]>("report");

    if (response) {
      queryClient.setQueryData(["getReports"], response);
      setLoading(false);
      return response;
    }
    setLoading(false);
  };

  const getReport = async (reportId: string | undefined) => {
    setLoading(true);

    if (reportId) {
      const response = await fetcher.get<ReportType>(`report/${reportId}`);

      if (response) {
        setCurrentData(response);
      }
    } else {
      setCurrentData(loadReportData());
    }

    setLoading(false);
  };

  return {
    loading,
    currentData,
    printReport,
    exportReport,
    getReports,
    getReport,
    getReportList,
    createReport,
    deleteReport,
    updateReport,
  };
}
