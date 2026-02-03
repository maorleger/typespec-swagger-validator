#!/usr/bin/env node
/**
 * Simple CLI to generate JS client libraries from Swagger and TypeSpec
 * for comparison purposes.
 * 
 * Usage:
 *   npx tsx src/cli.ts generate --swagger ./spec.json --typespec ./spec.tsp --output ./output
 */

import { program } from "commander";
import { generateFromSwagger, generateFromTypeSpec } from "./generator.js";
import { resolve } from "path";
import chalk from "chalk";

program
  .name("tsv")
  .description("Generate JS client libraries from Swagger and TypeSpec for comparison")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate client libraries from both Swagger and TypeSpec")
  .requiredOption("--swagger <path>", "Path to Swagger/OpenAPI JSON file")
  .requiredOption("--typespec <path>", "Path to TypeSpec file")
  .option("--output <path>", "Output directory", "./output")
  .action(async (options) => {
    const swaggerPath = resolve(options.swagger);
    const typespecPath = resolve(options.typespec);
    const outputDir = resolve(options.output);

    console.log(chalk.blue("Generating client libraries...\n"));

    console.log(chalk.yellow("Swagger input:"), swaggerPath);
    console.log(chalk.yellow("TypeSpec input:"), typespecPath);
    console.log(chalk.yellow("Output directory:"), outputDir);
    console.log();

    try {
      // Generate from Swagger
      console.log(chalk.cyan("→ Generating from Swagger..."));
      const swaggerResult = await generateFromSwagger(swaggerPath, outputDir);
      if (swaggerResult.success) {
        console.log(chalk.green("  ✓ Swagger generation complete:"), swaggerResult.outputPath);
      } else {
        console.log(chalk.red("  ✗ Swagger generation failed:"), swaggerResult.error);
      }

      // Generate from TypeSpec
      console.log(chalk.cyan("→ Generating from TypeSpec..."));
      const typespecResult = await generateFromTypeSpec(typespecPath, outputDir);
      if (typespecResult.success) {
        console.log(chalk.green("  ✓ TypeSpec generation complete:"), typespecResult.outputPath);
      } else {
        console.log(chalk.red("  ✗ TypeSpec generation failed:"), typespecResult.error);
      }

      console.log();
      if (swaggerResult.success && typespecResult.success) {
        console.log(chalk.green("✓ Both generations complete!"));
        console.log(chalk.blue("\nCompare the outputs:"));
        console.log(`  Swagger: ${swaggerResult.outputPath}`);
        console.log(`  TypeSpec: ${typespecResult.outputPath}`);
      }
    } catch (err) {
      console.error(chalk.red("Error:"), err);
      process.exit(1);
    }
  });

program
  .command("swagger")
  .description("Generate client library from Swagger only")
  .requiredOption("--input <path>", "Path to Swagger/OpenAPI JSON file")
  .option("--output <path>", "Output directory", "./output")
  .action(async (options) => {
    const inputPath = resolve(options.input);
    const outputDir = resolve(options.output);

    console.log(chalk.cyan("→ Generating from Swagger..."));
    const result = await generateFromSwagger(inputPath, outputDir);
    if (result.success) {
      console.log(chalk.green("✓ Complete:"), result.outputPath);
    } else {
      console.log(chalk.red("✗ Failed:"), result.error);
      process.exit(1);
    }
  });

program
  .command("typespec")
  .description("Generate client library from TypeSpec only")
  .requiredOption("--input <path>", "Path to TypeSpec file")
  .option("--output <path>", "Output directory", "./output")
  .action(async (options) => {
    const inputPath = resolve(options.input);
    const outputDir = resolve(options.output);

    console.log(chalk.cyan("→ Generating from TypeSpec..."));
    const result = await generateFromTypeSpec(inputPath, outputDir);
    if (result.success) {
      console.log(chalk.green("✓ Complete:"), result.outputPath);
    } else {
      console.log(chalk.red("✗ Failed:"), result.error);
      process.exit(1);
    }
  });

program.parse();
