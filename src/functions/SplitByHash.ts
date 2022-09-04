export const splitByHash: (input: string) => string[] | null = (input) => {
  if (input.match(/\S/g) === null) {
    return null;
  }
  const words: string[] = input.split("#");
  const result: string[] = words.map((word: string) => {
    return word.trim();
  });
  return result;
};
