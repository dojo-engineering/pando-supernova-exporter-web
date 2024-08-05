import {
    TokenGroup,
    TokenType,
    TypographyToken,
} from "@supernovaio/sdk-exporters";
import { buildTypographyToken } from "./typographyTokens";

export function buildFullTypographyStructure(
    allGroups: TokenGroup[],
    tokens: TypographyToken[],
    dense: boolean,
) {
    const exportTokenGroup = findRootTypographyGroup(allGroups);
    if (!exportTokenGroup) {
        return null;
    }
    const compactTokens = tokens.filter((token) => token.name.includes("compact"));
    const mediumTokens = tokens.filter((token) => token.name.includes("medium"));
    const expandedTokens = tokens.filter((token) => token.name.includes("expanded"));
    const largeTokens = tokens.filter((token) => token.name.includes("large"));

    const compact = buildTypographyGroupStructure(exportTokenGroup, allGroups, compactTokens, "compact", dense);
    const medium = buildTypographyGroupStructure(exportTokenGroup, allGroups, mediumTokens, "medium", dense);
    const expanded = buildTypographyGroupStructure(exportTokenGroup, allGroups, expandedTokens, "expanded", dense);
    const large = buildTypographyGroupStructure(exportTokenGroup, allGroups, largeTokens, "large", dense);

    return {
        compact,
        medium,
        expanded,
        large,
    };
}

export function findRootTypographyGroup(
    tokenGroups: TokenGroup[],
) {
    const exportTokenGroup = tokenGroups.find((group) => group.name === "export" && group.tokenType === TokenType.typography);
    return exportTokenGroup;
}

export function findTokenById(tokenId: string, tokens: TypographyToken[]) {
    return tokens.find((token) => token.id === tokenId);
}

export function buildTypographyGroupStructure(
    group: TokenGroup,
    allGroups: TokenGroup[],
    tokens: TypographyToken[],
    name: string,
    dense: boolean,
): Object | null {

    const mappedTokens = new Map(tokens.map((token) => [token.id, token]));
    const structure: Object = {};

    group.childrenIds.forEach((childGroupId) => {
        const childGroup = allGroups.find((g) => g.id === childGroupId);
        //check if the childgroup has at least one id of the tokens in tokens parameter, if not, skip
        if (childGroup && childGroup.tokenIds.length > 0) {
            const hasToken = childGroup.tokenIds.some((tokenId) => {
                const token = findTokenById(tokenId, tokens);
                return token && token.name === name;
            });
            if (!hasToken) {
                return null;
            }
        }
        if (childGroup && childGroup.childrenIds.length > 0) {
            structure[childGroup.name] = buildTypographyGroupStructure(
                childGroup,
                allGroups,
                tokens,
                name,
                dense,
            );
            if (childGroup.tokenIds.length > 0) {
                childGroup.tokenIds.map((tokenId) => {
                    const token = findTokenById(tokenId, tokens);
                    if (token && token.value && token.name === name) {
                        structure[childGroup.name] = buildTypographyToken(token, mappedTokens, dense);
                    }
                }
                );
            }
        }

        return structure;
    });
    // remove any empty groups or tokens e.g. {} or variations
    if (Object.keys(structure).length === 0) {
        //remove from structure
        return null;
    }
    // remove all null values from structure
    Object.keys(structure).forEach((key) => {
        if (structure[key] === null) {
            delete structure[key];
        }
    });
    return structure;
}
