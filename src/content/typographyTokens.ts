import { TypographyToken } from "@supernovaio/sdk-exporters";
import { CSSHelper, ColorFormat } from "@supernovaio/export-helpers";
import { REFERENCABLE_TOKEN_TYPES } from "@supernovaio/sdk-exporters/build/sdk-typescript/src/model/enums/SDKTokenType";

export function buildTypographyToken(token: TypographyToken, mappedTokens): {} | null {
    const fontFamily = token.value.fontFamily.text;
    const fontWeight = token.value.fontWeight.text;
    const fontSize = `${token.value.fontSize.measure}rem`;
    const lineHeight = `${token.value.lineHeight?.measure}%`;
    const textTransform = token.value.textCase.value.toLowerCase();
    const textDecoration = token.value.textDecoration.value.toLowerCase();
    const letterSpacing = `${token.value.letterSpacing.measure}%`;
    const paragraphSpacing = `${token.value.paragraphSpacing.measure}px`;

    const remToPx = (rem: number) => rem * 16;
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
