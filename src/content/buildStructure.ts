import {
  ColorToken,
  DimensionToken,
  Token,
  TokenGroup,
  TokenType,
  TypographyToken,
} from "@supernovaio/sdk-exporters";
import { colorTokenToCSS } from "./colorTokens";
import { buildDimensionToken } from "./dimensions";
import { buildTypographyToken } from "./typographyTokens";

export function findRootGroupsForTokenTypes(
  tokenGroups: TokenGroup[],
  tokenType: TokenType
) {
  if (tokenType === TokenType.dimension) {
    const staticRootGroups = [
      "border",
      "radius",
      "padding",
      "radius",
      "gap",
      "window",
    ];
    const rootTokenGroups = tokenGroups.filter((group) =>
      staticRootGroups.includes(group.name)
    );
    return rootTokenGroups;
  } else if (tokenType === TokenType.typography) {
    const typographyGroupId = tokenGroups.find((group) => group.name === "export")?.id;
    return tokenGroups.filter((group) => group.parentGroupId === typographyGroupId);
  }
  else {
    const colorGroupId = tokenGroups.find((group) => group.name === "Color")
      ?.id;
    return tokenGroups.filter((group) => group.parentGroupId === colorGroupId);
  }
}

export function findTokenById(tokenId: string, tokens: Token[]) {
  return tokens.find((token) => token.id === tokenId);
}

export function buildGroupStructure(
  group: TokenGroup,
  allGroups: TokenGroup[],
  allTokens: Token[]
): Object | null {
  if (!group || !allGroups || !allTokens || group.childrenIds.length === 0 || group.name.includes("[]")) {
    return null;
  }
  if (group.tokenIds.length === 0 && group.childrenIds.length === 0) {
    return null;
  }
  const tokenGroupsNamesToOmit = ["brandAlias", "systemRamps", "system", "systemTypography", "figma-inline-links", "systemHeight[FigmaOnly]", "_deprecatedInverse"];
  if (tokenGroupsNamesToOmit.includes(group.name.toLowerCase())) {
    return null;
  }
  const mappedTokens = new Map(allTokens.map((token) => [token.id, token]));
  const structure: Object = {};

  group.tokenIds.forEach((tokenId) => {
    const token = findTokenById(tokenId, allTokens);
    if (token && token.tokenType === TokenType.color && /^[a-zA-Z]*$/.test(token.name)) {
      structure[token.name] = colorTokenToCSS(
        token as ColorToken,
        mappedTokens,
        allGroups
      );
    }
    if (token && token.tokenType === TokenType.dimension && !token.name.includes("sys")) {
      structure[token.name] = buildDimensionToken(token as DimensionToken);
    }
  });

  group.childrenIds.forEach((childGroupId) => {
    const tokenGroupsNamesToOmit = ["brandalias", "systemramps", "system", "systemtypography", "figma-inline-links", "systemHeight[FigmaOnly]"];
    const childGroup = allGroups.find((g) => g.id === childGroupId);
    if (childGroup && childGroup.childrenIds.length > 0 && !tokenGroupsNamesToOmit.includes(childGroup.name.toLowerCase())) {
      structure[childGroup.name] = buildGroupStructure(
        childGroup,
        allGroups,
        allTokens
      );
    }
  });

  return structure;
}

export function buildRootGroupStructures(
  allGroups: TokenGroup[],
  allTokens: Token[],
  tokenType: TokenType,
): Object | null {
  // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  const rootGroups = findRootGroupsForTokenTypes(allGroups, tokenType);
  const rootGroupStructures: Object = {};
  const tokenGroupsNamesToOmit = ["brandalias", "systemramps", "system", "systemtypography", "figma-inline-links", "systemHeight[FigmaOnly]"];
  const allTokensFiltered = allTokens.filter((token) => token.tokenType === tokenType);
  const allGroupsFiltered = allGroups.filter((group) => group.tokenType === tokenType);

  rootGroups.forEach((rootGroup) => {
    if (tokenGroupsNamesToOmit.includes(rootGroup.name)) {
      return;
    }
    rootGroupStructures[rootGroup.name] = buildGroupStructure(
      rootGroup,
      allGroupsFiltered,
      allTokensFiltered
    );
  });

  return rootGroupStructures;
}
