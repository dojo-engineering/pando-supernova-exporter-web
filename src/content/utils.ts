import { Token, TokenGroup } from "@supernovaio/sdk-exporters";
import { findTokenById } from "./buildStructure";

export function processThemeName(themeName: string): string {
    return themeName.replace(/[^a-zA-Z]/g, "");
}

export function filterOutUnecessaryGroups(tokenGroups: TokenGroup[]) {
    const tokenGroupsNamesToOmit = ["brandalias", "systemramps", "system", "systemtypography", "figma-inline-links", "systemHeight[FigmaOnly]"];
    const filteredTokenGroups = tokenGroups.filter((tokenGroup) => !tokenGroupsNamesToOmit.includes(tokenGroup.name.toLowerCase()));
    return filteredTokenGroups;
}

export function removeDeprecatedTokens(tokenIds: string[], tokens: Token[]): string[] {
    return tokenIds.filter((tokenId) => {
        const token = findTokenById(tokenId, tokens);
        return token && !token.name.includes("_")
    }
    )
}

export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number): string => {
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
