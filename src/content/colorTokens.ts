import { NamingHelper, CSSHelper, ColorFormat, StringCase } from "@supernovaio/export-helpers"
import { ColorToken, Token, TokenGroup } from "@supernovaio/sdk-exporters"

export function colorTokenToCSS(token: ColorToken, mappedTokens: Map<string, Token>, tokenGroups: Array<TokenGroup>): string | null {
  const value = CSSHelper.colorTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.smartHashHex,
    tokenToVariableRef: (t) => {
      return `{tokenVariableName(t, tokenGroups)}`
    },
  })
  if (value === null) {
    return null
  }
  return `${value}`
}

function tokenVariableName(token: Token, tokenGroups: Array<TokenGroup>): string {
  const parent = tokenGroups.find((group) => group.id === token.parentGroupId)!
  return NamingHelper.codeSafeVariableNameForToken(token, StringCase.camelCase, parent, null)
}
