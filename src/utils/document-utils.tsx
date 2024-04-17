
export const normalizeCepNumber = (value: String | undefined) => {
  if (!value) return ''
  return value.replace(/\D/g, "")
  .replace(/^(\d{2})(\d{3})(\d{3})+?$/, "$1.$2-$3")
  .replace(/(-\d{3})(\d+?)/, '$1')
}