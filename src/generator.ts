/**
 * Generator functions for Swagger and TypeSpec
 */

import { spawn } from "child_process";
import { mkdir, writeFile, copyFile } from "fs/promises";
import { join, basename, resolve } from "path";

export interface GenerationResult {
  success: boolean;
  outputPath: string;
  error?: string;
}

/**
 * Generate TypeScript client from Swagger/OpenAPI using autorest
 */
export async function generateFromSwagger(
  swaggerPath: string,
  outputDir: string
): Promise<GenerationResult> {
  const swaggerOutputDir = join(outputDir, "swagger-generated");
  const absoluteSwaggerPath = resolve(swaggerPath);
  
  try {
    await mkdir(swaggerOutputDir, { recursive: true });

    // Create a minimal autorest README.md config (autorest requires this format)
    const configContent = `# AutoRest Configuration

\`\`\`yaml
input-file: ${absoluteSwaggerPath}
output-folder: .
typescript: true
package-name: generated-client
generate-metadata: false
v3: true
use-extension:
  "@autorest/typescript": "6.0.42"
\`\`\`
`;

    const configPath = join(swaggerOutputDir, "README.md");
    await writeFile(configPath, configContent);

    // Run autorest with the config file
    const result = await runCommand("npx", [
      "autorest",
      "README.md",
    ], swaggerOutputDir);

    return {
      success: result.code === 0,
      outputPath: swaggerOutputDir,
      error: result.code !== 0 ? result.stderr || result.stdout : undefined,
    };
  } catch (err) {
    return {
      success: false,
      outputPath: swaggerOutputDir,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Generate TypeScript client from TypeSpec using the TypeSpec compiler
 */
export async function generateFromTypeSpec(
  typespecPath: string,
  outputDir: string
): Promise<GenerationResult> {
  const tspOutputDir = join(outputDir, "typespec-generated");
  
  try {
    await mkdir(tspOutputDir, { recursive: true });

    // Copy the typespec file to output dir
    const tspFileName = basename(typespecPath);
    const tspCopyPath = join(tspOutputDir, tspFileName);
    await copyFile(typespecPath, tspCopyPath);

    // Create tspconfig.yaml for the TypeSpec compiler
    const tspConfig = `emit:
  - "@azure-tools/typespec-ts"
options:
  "@azure-tools/typespec-ts":
    emitter-output-dir: "{output-dir}/src"
    package-details:
      name: "generated-client"
    generate-metadata: false
    generate-test: false
    flavor: azure
`;

    await writeFile(join(tspOutputDir, "tspconfig.yaml"), tspConfig);

    // Create package.json for dependencies (matching emitter-package.json versions)
    const packageJson = {
      name: "typespec-temp",
      private: true,
      type: "module",
      dependencies: {
        "@azure-tools/typespec-ts": "0.48.1",
        "@azure-tools/typespec-azure-core": "0.64.0",
        "@azure-tools/typespec-client-generator-core": "0.64.1",
        "@typespec/compiler": "1.8.0",
        "@typespec/http": "1.8.0",
        "@typespec/rest": "0.78.0",
      },
    };

    await writeFile(
      join(tspOutputDir, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    // Install dependencies
    console.log("    Installing TypeSpec dependencies...");
    const installResult = await runCommand("npm", ["install"], tspOutputDir);
    if (installResult.code !== 0) {
      return {
        success: false,
        outputPath: tspOutputDir,
        error: `npm install failed: ${installResult.stderr || installResult.stdout}`,
      };
    }

    // Run TypeSpec compiler  
    console.log("    Compiling TypeSpec...");
    const result = await runCommand("npx", [
      "tsp",
      "compile",
      tspFileName,
    ], tspOutputDir);

    return {
      success: result.code === 0,
      outputPath: tspOutputDir,
      error: result.code !== 0 ? result.stderr || result.stdout : undefined,
    };
  } catch (err) {
    return {
      success: false,
      outputPath: tspOutputDir,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Run a command and capture output
 */
function runCommand(
  cmd: string,
  args: string[],
  cwd: string
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";

    const child = spawn(cmd, args, {
      cwd,
      stdio: "pipe",
      shell: true,
    });

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });

    child.on("error", (err) => {
      resolve({ code: 1, stdout, stderr: err.message });
    });
  });
}
