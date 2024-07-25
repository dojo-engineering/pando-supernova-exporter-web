import { FileHelper } from "@supernovaio/export-helpers";
import {
  Supernova,
  PulsarContext,
  RemoteVersionIdentifier,
  AnyOutputFile,
  TokenGroup,
  Token,
  TokenType,
  TokenTheme,
} from "@supernovaio/sdk-exporters";
import { ExporterConfiguration } from "../config";
import { buildRootGroupStructures } from "./content/buildStructure";
import {
  processThemeName,
} from "./content/utils";
import { buildElevationTokens, buildShadowColorValues } from "./content/buildElevationTokens";

/**
 * Export entrypoint.
 * When running `export` through extensions or pipelines, this function will be called.
 * Context contains information about the design system and version that is currently being exported.
 */
Pulsar.export(
  async (
    sdk: Supernova,
    context: PulsarContext
  ): Promise<Array<AnyOutputFile>> => {
    const remoteVersionIdentifier: RemoteVersionIdentifier = {
      designSystemId: context.dsId,
      versionId: context.versionId,
    };
    //setup, get tokens, groups, themes
    const allTokens: Token[] = await sdk.tokens.getTokens(
      remoteVersionIdentifier
    );

    const inputTokenGroups: TokenGroup[] = await sdk.tokens.getTokenGroups(
      remoteVersionIdentifier
    );

    const allThemes = await sdk.tokens.getTokenThemes(remoteVersionIdentifier);

    const allTokenGroups = inputTokenGroups.filter(
      (group) =>
        group.tokenIds.length > 0 ||
        (group.childrenIds.length > 0 && /^[a-zA-Z]*$/.test(group.name))
    );
    const tokenGroupIdsToOmit = allTokenGroups
      .filter(
        (group) =>
          group.name.toLowerCase() === "brandalias" ||
          group.name.toLowerCase() === "systemramps" ||
          group.name.toLowerCase() === "system" ||
          group.name.toLowerCase() === "systemtypography" ||
          group.name.toLowerCase() === "figma-inline-links" ||
          group.name.toLowerCase() === "systemHeight[FigmaOnly]"
      )
      .map((group) => group.id);

    const tokens = allTokens.filter((token) => /^[a-zA-Z]*$/.test(token.name));
    const tokenGroups = allTokenGroups.filter(
      (group) => !tokenGroupIdsToOmit.includes(group.id)
    );

    //build theme variations of tokens
    const colorThemes = allThemes.filter(
      (theme) =>
        theme.overriddenTokens.filter(
          (token) => token.tokenType === TokenType.color
        ).length > 0
    );
    const densityTypographyThemes = allThemes.filter((theme) =>
      processThemeName(theme.name).includes("dense")
    );

    //initialise outputFiles
    const outputFiles: AnyOutputFile[] = [];

    //build color
    const colorGroupStructure = buildRootGroupStructures(
      tokenGroups,
      tokens,
      TokenType.color
    );
    const colorGroupStructureAsString = JSON.stringify(colorGroupStructure);
    let colorString = `export const light = ${colorGroupStructureAsString}`;
    colorThemes.forEach(
      (theme) =>
      (colorString = colorString.concat(
        `\n${generateThemedString(theme, "palette", TokenType.color)} satisfies typeof light`
      ))
    );
    outputFiles.push(buildOutputFile("palette", colorString));

    // build density
    const densityGroupStructure = buildRootGroupStructures(
      allTokenGroups,
      allTokens,
      TokenType.dimension
    );
    const densityGroupStructureAsString = JSON.stringify(densityGroupStructure);
    let densityString = `export const density = ${densityGroupStructureAsString}`;
    densityTypographyThemes.forEach(
      (theme) =>
      (densityString = densityString.concat(
        `\n${generateThemedString(theme, "density", TokenType.dimension)} satisfies typeof density`
      ))
    );
    outputFiles.push(buildOutputFile("density", densityString));

    //build typography
    const typographyGroupStructure = buildRootGroupStructures(
      tokenGroups,
      tokens,
      TokenType.typography
    );
    const typographyGroupStructureAsString = JSON.stringify(
      typographyGroupStructure
    );
    let typographyString = `export const typography = ${typographyGroupStructureAsString}`;
    // densityTypographyThemes.forEach(
    //   (theme) =>
    //   (typographyString = typographyString.concat(
    //     `\n${generateThemedString(theme, "Typography", TokenType.typography)} satisfies typeof typography`
    //   ))
    // );

    const elevationTokens = buildElevationTokens(allTokens, allTokenGroups, allThemes);
    const elevationTokensAsString = JSON.stringify(elevationTokens);
    let elevationString = `export const elevation = ${elevationTokensAsString}`;
    const shadowColorAsString = buildShadowColorValues(allTokens);
    elevationString = elevationString.concat(`\nexport const shadowColors = ${shadowColorAsString}`);
    outputFiles.push(buildOutputFile("elevation", elevationString));


    outputFiles.push(buildOutputFile("typography", typographyString));
    //make output files from my strings
    function buildOutputFile(name: string, content: string) {
      return FileHelper.createTextFile({
        relativePath: "./",
        fileName: `${name}.ts`,
        content: content,
      });
    }

    //function to build theme variations of tokens
    function generateThemedString(
      theme: TokenTheme,
      name: string,
      tokenType: TokenType
    ) {
      const themesOverriddenTokens = theme.overriddenTokens;
      const themeGroupStructure = buildRootGroupStructures(
        tokenGroups,
        themesOverriddenTokens,
        tokenType
      );
      const themeColorTokenGroupStructureAsString =
        JSON.stringify(themeGroupStructure);
      const themeColorFileContent = `export const ${processThemeName(
        theme.name
      )} = ${themeColorTokenGroupStructureAsString}`;
      return themeColorFileContent;
    }
    return outputFiles;
  }
);

/** Exporter configuration. Adheres to the `ExporterConfiguration` interface and its content comes from the resolved default configuration + user overrides of various configuration keys */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>();
