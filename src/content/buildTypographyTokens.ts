import { Token, TokenGroup, TokenType, TypographyToken } from "@supernovaio/sdk-exporters";
import { buildGroupStructure, buildRootGroupStructures } from "./buildStructure";

export function buildTypographyTokenStructure(tokens: TypographyToken[], tokenGroups: TokenGroup[]): {} | null {
    const exportTokenGroup = tokenGroups.find((group) => group.name === "export" && group.tokenType === TokenType.typography);
    if (!exportTokenGroup) {
        return null;
    }
    const compactTokens = tokens.filter((token) => token.name.includes("compact"));
    const mediumTokens = tokens.filter((token) => token.name.includes("medium"));
    const expandedTokens = tokens.filter((token) => token.name.includes("expanded"));
    const largeTokens = tokens.filter((token) => token.name.includes("large"));

    const compactTokenSructure = buildRootGroupStructures(tokenGroups, compactTokens, TokenType.typography);
    const mediumTokenSructure = buildGroupStructure(exportTokenGroup, tokenGroups, mediumTokens);
    const expandedTokenSructure = buildGroupStructure(exportTokenGroup, tokenGroups, expandedTokens);
    const largeTokenSructure = buildGroupStructure(exportTokenGroup, tokenGroups, largeTokens);
    const typographyTokenStructure = {
        compactTokenSructure,
        mediumTokenSructure,
        expandedTokenSructure,
        largeTokenSructure,
    }
    return typographyTokenStructure;
}