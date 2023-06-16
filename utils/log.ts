export const log = (category: string, ...args: unknown[]) => {
  console.log(`[${category}]`, ...args);
};
