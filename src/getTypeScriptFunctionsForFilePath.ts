import { Project, ScriptTarget } from 'ts-morph';

export interface FunctionSignature {
  functionName: string;
  parameters: Array<{ name: string; type: string }>;
  isAsync: boolean;
  returnType: string;
}

export function getTypeScriptFunctionsForFilePath(
  filePath: string
): FunctionSignature[] {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2020,
    },
  });

  // Add the file to the project
  project.addSourceFileAtPath(filePath);
  const sourceFile = project.getSourceFileOrThrow(filePath);

  const signatures: FunctionSignature[] = [];

  // For simplicity, collect top-level function declarations and exported functions
  const functions = sourceFile.getFunctions();
  functions.forEach((fn) => {
    const name = fn.getName() || 'anonymous';
    const isAsync = fn.isAsync();
    const params = fn.getParameters().map((p) => ({
      name: p.getName(),
      type: p.getType().getText(),
    }));
    const returnType = fn.getReturnType().getText();

    signatures.push({
      functionName: name,
      parameters: params,
      isAsync,
      returnType,
    });
  });

  // Additionally, find methods in exported classes if needed.
  // (Skipping in the minimal MVP, but you could add that logic here.)

  return signatures;
}
