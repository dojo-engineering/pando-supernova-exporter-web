
export function modifyThemeContent(input: string): string {
let modifiedString = input.endsWith(";") 
    ? input.slice(0, -1) 
    : input;

return modifiedString += " satisfies typeof lightThemeTokens"
};
