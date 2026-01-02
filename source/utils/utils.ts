
export const WORKING_DIRECTORY = process.cwd();



export function defineService(closure: () => any) {
  return closure();
}

export function defineTemplate<T extends unknown[]>(
  closure: (...args: T) => string[]
): T extends [] ? string : (...args: T) => string {
  if (closure.length === 0) {
    // No arguments expected - execute immediately
    try {
      return (closure as () => string[])().join("\n") as any;
    } catch (error) {
      console.error(error);
      return "" as any;
    }
  }
  // Arguments expected - return a factory function
  return ((...args: T) => {
    try {
      return closure(...args).join("\n");
    } catch (error) {
      console.error(error);
      return "";
    }
  }) as any;
}
