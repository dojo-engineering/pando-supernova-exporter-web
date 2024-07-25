import { DimensionToken, } from "@supernovaio/sdk-exporters";
import { tokenVariableName } from "./colorTokens";

export function buildDimensionToken(token: DimensionToken): {} {
    const dimensionToken: Object = {};
    const dimensionTokenValue = `${token.value.measure}px`;
    return dimensionToken[tokenVariableName(token)] = dimensionTokenValue;
}