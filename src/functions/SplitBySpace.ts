export const splitBySpace: (input: string) => string[] = (input) => {
  const words: string[] = input.split(/\s+/);
  console.log(words);
  return words;
};
