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
import {
  buildRootGroupStructures,
  findRootGroupsForTokenTypes,
} from "./content/buildStructure";

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

    let allTokens: Token[] = await sdk.tokens.getTokens(
      remoteVersionIdentifier
    );
    let allTokenGroups: TokenGroup[] = await sdk.tokens.getTokenGroups(
      remoteVersionIdentifier
    );

    allTokenGroups = allTokenGroups.filter(
      (group) =>
        group.name !== "brandAlias" && group.name !== "systemRamps"
    );
    allTokenGroups = allTokenGroups.filter((group) => group.tokenIds.length > 0 || group.childrenIds.length > 0);
    allTokenGroups = allTokenGroups.filter((group) => /^[a-zA-Z0-9]*$/.test(group.name));

    allTokens = allTokens.filter((token) => /^[a-zA-Z0-9]*$/.test(token.name));

    const rootTokenGroups = findRootGroupsForTokenTypes(allTokenGroups);

    const tokenGroupStructure = buildRootGroupStructures(
      rootTokenGroups,
      allTokenGroups,
      allTokens
    );

    const tokenGroupStructureAsString = JSON.stringify(tokenGroupStructure);
    const colorFileContent = `export const lightColors = ${tokenGroupStructureAsString}`
    const colorFile = FileHelper.createTextFile({
      relativePath: "./light/",
      fileName: "lightColors.ts",
      content: colorFileContent,
    });

    const outputFiles: AnyOutputFile[] = [];
    outputFiles.push(colorFile);

    const allThemes = await sdk.tokens.getTokenThemes(remoteVersionIdentifier);
    const themes = allThemes.filter((theme) => theme.overriddenTokens.filter((token) => token.tokenType === TokenType.color).length > 0);
    function generateThemedColorFiles(
      theme: TokenTheme,
    ) {
      const themesOverriddenTokens = theme.overriddenTokens;
      const themeGroupStructure = buildRootGroupStructures(
        rootTokenGroups,
        allTokenGroups,
        themesOverriddenTokens
      );
      const themeGroupStructureAsString = JSON.stringify(themeGroupStructure);
      const themeColorFileContent = `export const ${theme.name}Colors = ${themeGroupStructureAsString}`
      const themeColorFile = FileHelper.createTextFile({
        relativePath: `./${theme.name}/`,
        fileName: `${theme.name}Colors.ts`,
        content: themeColorFileContent,
      });
      outputFiles.push(themeColorFile);
    }
    
    themes.forEach((theme) => generateThemedColorFiles(theme));

    return outputFiles;
  }
);

/** Exporter configuration. Adheres to the `ExporterConfiguration` interface and its content comes from the resolved default configuration + user overrides of various configuration keys */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>();
