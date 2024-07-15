import {DimensionToken,} from "@supernovaio/sdk-exporters";
import { tokenVariableName } from "./colorTokens";

export function buildDimensionToken(token: DimensionToken): {} {
    const borderToken: Object ={};
    const borderTokenValue = `${token.value.measure}px`;
    return borderToken[tokenVariableName(token)] = borderTokenValue;
}
