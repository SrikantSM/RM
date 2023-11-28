package com.sap.c4p.rm.skill.precompilation;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

import com.sap.c4p.rm.skill.config.LoggingMarker;

class MessageKeyPrecompiler {

  private static final Logger LOGGER = LoggerFactory.getLogger(MessageKeyPrecompiler.class);
  private static final Marker MARKER = LoggingMarker.PRECOMPILER.getMarker();

  static final String I18N_FILENAME = "src/main/resources/i18n/i18n.properties";
  static final String GEN_FOLDER = "src/gen/java/com/sap/c4p/rm/skill/gen/";
  static final String MSGKEYS_NAMES_FILENAME = "MessageKeys.java";

  public static void main(String[] args) throws PrecompilationException, URISyntaxException {
    MessageKeyPrecompiler.LOGGER.info(MARKER, "Generating message keys ...");

    final String projectPath = new File(
        MessageKeyPrecompiler.class.getProtectionDomain().getCodeSource().getLocation().toURI()).getParentFile()
            .getParent();

    final Path sourcePath = Paths.get(projectPath, MessageKeyPrecompiler.I18N_FILENAME);
    final Path targetPath = Paths.get(projectPath, MessageKeyPrecompiler.GEN_FOLDER,
        MessageKeyPrecompiler.MSGKEYS_NAMES_FILENAME);
    final Path targetParentPath = targetPath.getParent();

    MessageKeyPrecompiler.checkI18NFileExistence(sourcePath);

    MessageKeyPrecompiler.ensureTargetPathExists(targetPath, targetParentPath);

    final String sourceCode = MessageKeyPrecompiler.generateMessageKeysClass(sourcePath);

    try {
      Files.write(targetPath, sourceCode.getBytes(StandardCharsets.UTF_8));
      MessageKeyPrecompiler.LOGGER.info(MARKER, "Message keys were generated successfully!");
    } catch (final IOException e) {
      throw new PrecompilationException("Couldn't write message keys to " + targetPath.toAbsolutePath(), e);
    }
  }

  /**
   * make sure target path exists and is usable
   *
   * @param targetPath       {@link Path} to target directory
   * @param targetParentPath {@link Path} to parent of target directory
   * @throws PrecompilationException target directory not usable
   */
  static void ensureTargetPathExists(Path targetPath, Path targetParentPath) throws PrecompilationException {
    if (targetParentPath == null) {
      throw new PrecompilationException(
          "The parent directory of " + targetPath.toAbsolutePath() + " could not be accessed", null);
    }

    if (!targetParentPath.toFile().exists()) {
      final boolean success = targetParentPath.toFile().mkdirs();
      if (!success) {
        throw new PrecompilationException(targetParentPath.toAbsolutePath() + " could not be created", null);
      }
    }
  }

  /**
   * check existence of I18N file and throw {@link PrecompilationException} in
   * case it does not exist
   *
   * @param sourcePath {@link Path} to I18N file
   * @throws PrecompilationException I18N file does not exist
   */
  static void checkI18NFileExistence(final Path sourcePath) throws PrecompilationException {
    if (!sourcePath.toFile().exists()) {
      throw new PrecompilationException(sourcePath.toAbsolutePath() + " does not exist", null);
    }
  }

  /**
   * Returns a {@link List} of i18n keys contained in a provided file
   *
   * @param i18nPath path of file containing i18n properties
   * @return list of i18n key contained in provided file
   * @throws PrecompilationException
   */
  static List<String> readI18nKeys(final Path i18nPath) throws PrecompilationException {
    try (InputStream inStream = Files.newInputStream(i18nPath)) {
      final Properties props = new Properties();

      props.load(inStream);

      final List<String> result = new ArrayList<>();
      props.keySet().forEach(key -> result.add((String) key));

      Collections.sort(result);
      return result;
    } catch (final IOException e) {
      throw new PrecompilationException("Failed to process properties in " + i18nPath.toAbsolutePath(), e);
    }
  }

  /**
   * Gets an UNDERSCORE_CASE representation of provided CamelCase {@link String}
   *
   * The result is a valid Java identifier
   *
   * @param input String in camel case notation
   * @return valid Java identifier in underscore case notation
   */
  static String camelCaseToUnderscoreCaseIdentifier(final String input) {
    final StringBuilder result = new StringBuilder();

    if (!input.isEmpty() && !Character.isJavaIdentifierStart(input.charAt(0))) {
      result.append('_');
    }

    for (int i = 0; i < input.length(); i++) {
      final char thisChar = Character.isJavaIdentifierPart(input.charAt(i)) ? input.charAt(i) : '_';

      result.append(Character.toUpperCase(thisChar));

      if (i < input.length() - 1) {
        final char nextChar = input.charAt(i + 1);
        if (Character.isLowerCase(thisChar) && Character.isUpperCase(nextChar)) {
          result.append('_');
        }

      }
    }
    return result.toString();
  }

  /**
   * Generates the source code of the Java class {@code MessageKeys} containing
   * constants for all keys of i18n texts contained in the provided
   * {@code sourcePath}
   *
   * @param sourcePath path of properties file containing i18n texts
   * @return {@link String}
   * @throws PrecompilationException
   *
   */
  static String generateMessageKeysClass(final Path sourcePath) throws PrecompilationException {
    final StringBuilder builder = new StringBuilder();

    builder.append("package com.sap.c4p.rm.skill.gen;\n");
    builder.append("// THIS CLASS IS CREATED AUTOMATICALLY DURING THE BUILD AND MUST NOT BE EDITED MANUALLY\n");
    builder.append("public class MessageKeys {\n");

    for (final String messageKey : MessageKeyPrecompiler.readI18nKeys(sourcePath)) {
      builder.append("    public static final String ")
          .append(MessageKeyPrecompiler.camelCaseToUnderscoreCaseIdentifier(messageKey)).append(" = \"")
          .append(messageKey).append("\";\n");
    }

    builder.append("}\n");

    return builder.toString();
  }
}
