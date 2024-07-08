import { ColorToken, Token, TokenGroup, TokenType } from "@supernovaio/sdk-exporters";
import { colorTokenToCSS } from "./colorToken";

export function findRootGroupsForTokenTypes(
  tokenGroups: TokenGroup[],
) {
  const rootTokenGroups: TokenGroup[] = [];
  const rootTokenGroup = findRootTokenGroup(tokenGroups);
  if (rootTokenGroup) {
    rootTokenGroups.push(rootTokenGroup);
  }
  return rootTokenGroups;
}

export function findRootTokenGroup(tokenGroups: TokenGroup[]) {
  if (!tokenGroups) {
    return null;
  }
  const rootTokenGroup = tokenGroups.find(
    (tokenGroup) => tokenGroup.parentGroupId === null || tokenGroup.isRoot
  ) as TokenGroup;
  return rootTokenGroup;
}

export function findTokenById(tokenId: string, tokens: Token[]) {
    return tokens.find((token) => token.id === tokenId);
    }

export function buildGroupStructure(group: TokenGroup, allGroups: TokenGroup[], allTokens: Token[]): Object | null{
    if (!group || !allGroups || !allTokens) {
        return null;
    }
    const mappedTokens = new Map(allTokens.map(token => [token.id, token]));
    const structure: Object = {};

    group.tokenIds.forEach(tokenId => {
        const token = findTokenById(tokenId, allTokens);
        if (token && token.tokenType === TokenType.color) {
            structure[token.name] = colorTokenToCSS(token as ColorToken, mappedTokens, allGroups)
        }
    });

    group.childrenIds.forEach(childGroupId => {
        const childGroup = allGroups.find(g => g.id === childGroupId);
        if (childGroup) {
            structure[childGroup.name] = buildGroupStructure(childGroup, allGroups, allTokens);
        }
    });

    return structure;
}

export function buildRootGroupStructures(rootGroups: TokenGroup[], allGroups: TokenGroup[], allTokens: Token[]): Object | null { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
    if (!rootGroups) {
        return null;
    }
    const rootGroupStructures: Object = {};

    rootGroups.forEach(rootGroup => {
        rootGroupStructures[rootGroup.name] = buildGroupStructure(rootGroup, allGroups, allTokens);
    });
    
    return rootGroupStructures;
}