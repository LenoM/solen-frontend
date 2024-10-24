export type CustomInputType = {
  name: string;
  label: string;
  type: string;
  mask: string;
};

export const getQueryParam = (query: string | undefined) => {
  const regex = new RegExp("@@param([^)]*)[)]", "g");
  return [...new Set(query?.match(regex))]
}
