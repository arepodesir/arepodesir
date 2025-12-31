
export const WORKING_DIRECTORY = process.cwd();



export function defineService(closure: () => any) {
  return closure();
}

export type TemplateString = string
export function defineTemplate(closure: () => string[]): TemplateString {
  try {
    return closure().join("\n");
  } catch (error) {
    console.error(error);
    return "";
  }
}
