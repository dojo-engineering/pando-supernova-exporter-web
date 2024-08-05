import { TypographyToken } from "@supernovaio/sdk-exporters";

export function buildTypographyToken(token: TypographyToken, mappedTokens, dense: boolean): {} | null {
    let fontSize: string = "";
    let textTransform: string = "";
    const fontFamily = token.value.fontFamily.text;
    const fontWeight = token.value.fontWeight.text;
    if (dense) {
        fontSize = `${token.value.fontSize.measure * 12}px`;
    }
    else {
        fontSize = `${token.value.fontSize.measure * 16}px`;
    }
    if (token.value.textCase.value.includes("pper")) {
        textTransform = "uppercase";
    }
    else if (token.value.textCase.value.includes("ower")) {
        textTransform = "lowercase";
    }
    else {
        textTransform = "none";
    }
    const lineHeight = `${token.value.lineHeight?.measure}%`;
    const textDecoration = token.value.textDecoration.value.toLowerCase();
    const letterSpacing = `${token.value.letterSpacing.measure}%`;

    return {
        fontFamily,
        fontWeight,
        fontSize,
        lineHeight,
        textTransform,
        textDecoration,
        letterSpacing,
    }
}
