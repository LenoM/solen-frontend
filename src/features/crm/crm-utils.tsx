export const CLOSE_STATUS = 3;

export enum CrmType {
  Collect = "Cobranca",
  Service = "Atendimento",
}

export const crmCollectStatus = [
  { id: 1, name: "Não atendeu" },
  { id: 2, name: "Deixei recado" },
  { id: 3, name: "Já pagou" },
  { id: 4, name: "Vai pagar" },
];

export const crmStatus = [
  { id: 1, name: "Em andamento" },
  { id: 2, name: "Aguardando retorno" },
  { id: 3, name: "Resolvido" },
];

export const crmOrigin = [
  { id: 1, name: "Presencial" },
  { id: 2, name: "Telefone" },
  { id: 3, name: "Email" },
  { id: 4, name: "Site" },
  { id: 5, name: "Chat" },
  { id: 6, name: "Webplan" },
];

export const crmMotive = [
  { id: 1, name: "Solicitação" },
  { id: 2, name: "Cadastro" },
  { id: 3, name: "Informacão" },
];

export const crmSubMotive = [
  { motive: 1, id: 1, name: "Boleto" },
  { motive: 1, id: 2, name: "Carteira" },
  { motive: 2, id: 3, name: "Inclusão / Exclusão" },
  { motive: 2, id: 4, name: "Troca de plano" },
  { motive: 3, id: 5, name: "Erro no boleto" },
];
