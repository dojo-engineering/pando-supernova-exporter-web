import { ColorToken, ShadowToken, ShadowTokenValue, Token, TokenGroup, TokenTheme, TokenType } from "@supernovaio/sdk-exporters";
import { rgbToHex } from "./utils";

//TODO does not handle blur or themes on shadow, currently these are all the same.

export function buildElevationTokens(allTokens: Token[], allTokenGroups: TokenGroup[], allThemes: TokenTheme[]): Object {
    const elevationTokens: Object = {};
    const shadowElevationTokens = allTokens.filter((token) => token.tokenType === TokenType.shadow && token.name.includes("elevation")) as ShadowToken[];
    shadowElevationTokens.forEach((token) => {
        const elevationToken = buildElevationTokenLayers(token, allTokens);
        elevationTokens[token.name] = elevationToken;
    });
    return elevationTokens;
}
export function buildElevationTokenLayers(token: ShadowToken, tokens: Token[]): Object {
    const elevationTokenLayers: Object = {};
    token.value.forEach((tokenValue, index) => {
        const elevationTokenLayer = buildElevationTokenLayer(tokenValue, index);
        elevationTokenLayers[index] = elevationTokenLayer;
    });
    return elevationTokenLayers;
}

export function buildElevationTokenLayer(tokenValue: ShadowTokenValue, index: number): Object {
    const elevationTokenLayer: Object = {};
    const shadowToken = `shadowColors.shadow${(tokenValue.opacity.measure * 100).toFixed(0)}Percent`;
    //build an object of values for each shadow Token
    const layer = {
        color: shadowToken,
        x: `${tokenValue.x}px`,
        y: `${tokenValue.y}px`,
        spread: `${tokenValue.spread}px`,
        opacity: `${(tokenValue.opacity.measure * 100).toFixed(0)}%`,
    };
    return elevationTokenLayer[index + 1] = layer
}

export function buildShadowColorValues(themesOverriddenTokens: Token[]): string {
    const elevationColors = themesOverriddenTokens.filter((token) => token.tokenType === TokenType.color && token.name.includes("shadow") && token.name.includes("Percent")) as ColorToken[];
    const shadowColors: Object = {};
    elevationColors.forEach((token) => {
        shadowColors[token.name] = rgbToHex(token.value.color.r, token.value.color.g, token.value.color.b);
    }
    );
    return JSON.stringify(shadowColors);
}