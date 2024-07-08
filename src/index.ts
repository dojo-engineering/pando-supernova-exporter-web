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
import { modifyThemeContent } from "./content/utils";

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

    const colorTokenGroupStructureAsString = JSON.stringify(tokenGroupStructure);
    const colorFileContent = `export const lightThemeTokens = ${colorTokenGroupStructureAsString}`
    const baseThemeFile = FileHelper.createTextFile({
      relativePath: "./light/",
      fileName: "lightTheme.ts",
      content: colorFileContent,
    });

    const outputFiles: AnyOutputFile[] = [];
    outputFiles.push(baseThemeFile);

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
      const themeColorTokenGroupStructureAsString = JSON.stringify(themeGroupStructure);
      const themeColorFileContent = `import { lightThemeTokens } from "../light/lightTheme"; export const ${theme.name}ThemeTokens = ${themeColorTokenGroupStructureAsString}`
      const themeFile = FileHelper.createTextFile({
        relativePath: `./${theme.name}/`,
        fileName: `${theme.name}Theme.ts`,
        content: modifyThemeContent(themeColorFileContent),
      });
      outputFiles.push(themeFile);
    }
    
    themes.forEach((theme) => generateThemedColorFiles(theme));

    return outputFiles;
  }
);

/** Exporter configuration. Adheres to the `ExporterConfiguration` interface and its content comes from the resolved default configuration + user overrides of various configuration keys */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>();
