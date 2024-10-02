export const SERVER_ERROR_MESSAGE = "Erro interno ao acessar o recurso";

export enum ErrorMessage {
  required = "Campo obrigatório",
  equals = "Escolha o valor correto",
  min = "Digite um valor maior",
  max = "Digite um valor menor",
  notEquals = "Senhas não conferem",
  invalidRG = "RG inválido",
  invalidCPF = "CPF inválido",
  invalidDate = "Data inválida",
  invalidMinDate = "Digite uma data posterior",
  invalidEmail = "Email inválido",
  invalidPassword = "Senhas inválida",
  invalidLength = "Digite ao menos 7 digitos",
  invalidContact = "Digite um contato válido",
  invalidFile = "Arquivo inválido",
  invalidFileLength = "Tamanho do arquivo não permitido",
  invalidFileFormat = "Formato do arquivo não permitido",
  invalidQuery = "Query inválida",
}
