import { Token, TokenGroup } from "@supernovaio/sdk-exporters";
import { findTokenById } from "./buildStructure";

export function modifyColorContent(input: string): string {
    let modifiedString = input.endsWith(";")
        ? input.slice(0, -1)
        : input;

    return modifiedString += " satisfies typeof colors"
};

export function modifyDensityContent(input: string): string {
    let modifiedString = input.endsWith(";")
        ? input.slice(0, -1)
        : input;

    return modifiedString += " satisfies typeof density"
};

export function processThemeName(themeName: string): string {
    return themeName.replace(/[^a-zA-Z]/g, "");
}

export function filterOutUnecessaryGroups(tokenGroups: TokenGroup[]) {
    const tokenGroupsNamesToOmit = ["brandalias", "systemramps", "system", "systemtypography", "figma-inline-links"];
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