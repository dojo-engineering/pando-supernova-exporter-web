export function appendToDensityFile(inputString: string) {
    const outputString = inputString.concat(`\n\n  export const padding = {
  default: density.padding,
  dense: dense.padding,
}

export const border = {
  default: density.border,
  dense: dense.border,
}

export const gap = {
  default: density.gap,
  dense: dense.gap,
}

export const radius = {
  default: density.radius,
  dense: dense.radius,
}

export const window = {
  default: density.window,
  dense: dense.window,
}`);
    return outputString;
}

export function appendToPaletteFile(inputString: string) {
    const outputString = inputString.concat(`\n\n  export const palette = {
    light,
    dark,
    lightInverse,
    darkInverse,
}`);
    return outputString;
}

//TODO this should be dynamic to themes and generated files.
export function generateTokensFile() {
    const tokensFileText = "import { border, gap, padding, radius, window } from './density.js' \nimport { palette } from './palette.js' \nimport { typography } from './typography.js' \nexport const tokens = { palette, padding, border, gap, radius, window, typography}";
    return tokensFileText
}
