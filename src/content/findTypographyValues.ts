import {
    FontFamilyToken,
    FontSizeToken,
    FontWeightToken,
    LetterSpacingToken,
    LineHeightToken,
    TextCaseToken,
    TextDecorationToken,
    Token,
    TokenGroup,
    TokenType,
} from "@supernovaio/sdk-exporters";

export function findTypographyValues(
    allTokens: Token[],
    allGroups: TokenGroup[]
) {
    const systemFontWeightGrp = allGroups.find(
        (group) => group.tokenType === TokenType.fontWeight
    );
    const systemFontWeightTokens = systemFontWeightGrp?.childrenIds.map(
        (id) => allTokens.find((token) => token.id === id) as FontWeightToken
    );
    const systemFontSizesGrp = allGroups.find(
        (group) => group.tokenType === TokenType.fontSize
    );
    const systemFontSizesTokens = systemFontSizesGrp?.childrenIds.map(
        (id) => allTokens.find((token) => token.id === id) as FontSizeToken
    );
    const lineHeightTokens = allTokens.filter(
        (token) => token.tokenType === TokenType.lineHeight
    ) as LineHeightToken[];
    const fontFamilyTokens = allTokens.filter(
        (token) => token.tokenType === TokenType.fontFamily
    ) as FontFamilyToken[];
    const textCaseTokens = allTokens.filter(
        (token) => token.tokenType === TokenType.textCase
    ) as TextCaseToken[];
    const letterSpacingTokens = allTokens.filter(
        (token) => token.tokenType === TokenType.letterSpacing
    ) as LetterSpacingToken[];
    const textDecorationTokens = allTokens.filter(
        (token) => token.tokenType === TokenType.textDecoration
    ) as TextDecorationToken[];

    // convert fontWeight to an object with the key as the token name and the value as the token value
    const fontWeight = systemFontWeightTokens?.reduce(
        (acc, token) => {
            acc[token.name] = token.value.text;
            return acc;
        },
        {} as { [key: string]: string }
    );

    const fontSize = systemFontSizesTokens?.reduce(
        (acc, token) => {
            acc[`sys${token.name}`] = { default: `${token.value.measure * 16}px`, dense: `${token.value.measure * 12}px` };
            return acc;
        },
        {} as { [key: string]: Object }
    );

    const lineHeight = lineHeightTokens?.reduce(
        (acc, token) => {
            acc[token.name] = `${token.value.measure}%`;
            return acc;
        },
        {} as { [key: string]: string }
    );

    const fontFamily = fontFamilyTokens.reduce(
        (acc, token) => {
            acc[token.name] = token.value.text;
            return acc;
        },
        {} as { [key: string]: string }
    );

    const textTransform = textCaseTokens.reduce(
        (acc, token) => {
            acc[token.name] = getTextCase(token.value.value);
            return acc;
        },
        {} as { [key: string]: string }
    );
    const letterSpacing = letterSpacingTokens.reduce(
        (acc, token) => {
            acc[token.name] = `${token.value.measure}%`;
            return acc;
        },
        {} as { [key: string]: string }
    );

    const textDecoration = textDecorationTokens.reduce(
        (acc, token) => {
            acc[token.name] = token.value.value.toLowerCase();
            return acc;
        },
        {} as { [key: string]: string }
    );

    return {
        fontWeight,
        fontSize,
        lineHeight,
        fontFamily,
        textTransform,
        letterSpacing,
        textDecoration,
    };
}

function getTextCase(textCase: string) {
    if (textCase.includes("pper")) {
        return "uppercase";
    } else if (textCase.includes("ower")) {
        return "lowercase";
    } else {
        return "none";
    }
}
