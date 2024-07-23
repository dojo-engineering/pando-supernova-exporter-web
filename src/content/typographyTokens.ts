import { TypographyToken } from "@supernovaio/sdk-exporters";

export function buildTypographyToken(token: TypographyToken, mappedTokens): {} | null {
    const fontFamily = token.value.fontFamily.text;
    const fontWeight = token.value.fontWeight.text;
    const fontSize = `${token.value.fontSize.referencedTokenId}`;
    const lineHeight = `${token.value.lineHeight?.measure}%`;
    const textTransform = token.value.textCase.value.toLowerCase();
    const textDecoration = token.value.textDecoration.value.toLowerCase();
    const letterSpacing = `${token.value.letterSpacing.measure}%`;
    const paragraphSpacing = `${token.value.paragraphSpacing.measure}px`;

    return {
        fontFamily,
        fontWeight,
        fontSize,
        lineHeight,
        textTransform,
        textDecoration,
        letterSpacing,
        paragraphSpacing,
    }
}
