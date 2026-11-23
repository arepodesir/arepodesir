
export function defineTemplate<T extends unknown[]>(
  closure: (...args: T) => string[]
): T extends [] ? string : (...args: T) => string {

 const NEW_LINE_ESCAPE = "\n" as const  

  if (closure.length === 0) {
    try {
      return (closure as () => string[])().join(NEW_LINE_ESCAPE) as any;
    } catch (error) {
      console.error(error);
      return "" as any;
    }
  }
  
  return ((...args: T) => {
    try {
      return closure(...args).join(NEW_LINE_ESCAPE);
    } catch (error) {
      console.error(error);
      return "";
    }
  }) as any;
}
