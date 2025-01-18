import OpenAI from 'openai';
import type { FunctionSignature } from './getTypeScriptFunctionsForFilePath.js';
import { isDebugMode } from './utils/env.js';
import { getRelativePathForImport } from './utils/getRelativePathForImport.js';

const apiKey = process.env.OPENAI_API_KEY || '';

export async function generateTestCodeForTypeScriptFunctions({
  testPath,
  modulePath,
  signatures,
}: {
  testPath: string;
  modulePath: string;
  signatures: FunctionSignature[];
}): Promise<string> {
  // Basic guard
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY. Provide it via env or config.');
  }

  const openai = new OpenAI({ apiKey });

  // Build a single prompt to generate test code for all discovered functions.
  // For large codebases, you might chunk this up, but for an MVP, let's keep it simple.
  const moduleRelativePath = getRelativePathForImport(testPath, modulePath);
  const prompt = `Generate only the TypeScript Jest test code for the following functions from the module at \`${moduleRelativePath}\`. \
Include relevant comments within the source code to explain each test case.

${signatures
  .map(
    (sig, idx) =>
      `Function #${idx + 1}: Name="${sig.functionName}" isAsync=${
        sig.isAsync
      }, Parameters=[${sig.parameters
        .map((p) => `${p.name}:${p.type}`)
        .join(', ')}], ReturnType=${sig.returnType}\n`
  )
  .join('\n')}
Requirements:
${[
  `Output must be a single valid TypeScript test file.`,
  `Utilize \`describe\` and \`it\` blocks for structuring tests.`,
  // `Embed comments within the source code to explain the purpose of each test case.`,
  `Cover typical scenarios and relevant edge cases.`,
  `Ensure the test code is concise yet illustrative of best practices.`,
  `Do not include any additional text or explanations outside of the source code.`,
]
  .map((s) => `- ${s}`)
  .join('\n')}
`;

  if (isDebugMode()) {
    console.log('Prompt to LLM:', prompt);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant for generating TypeScript test code.',
      },
      { role: 'user', content: prompt },
    ],
    max_completion_tokens: 600,
    temperature: 0.3,
  });

  const testCode = completion.choices[0]?.message?.content?.trim() || '';
  return testCode;
}
