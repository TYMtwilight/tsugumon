export const splitBySpace: (input: string) => string[] = (input) => {
  if (typeof input === "string") {
    const words: string[] = input.split(/\s+/);
    console.log(words);
    const result: string[] = words.map((word: string) => {
      return word.trim();
    });
    if (result.length > 1) {
      result.shift();
    }
    return result;
  } else {
    return [""];
  }
};
