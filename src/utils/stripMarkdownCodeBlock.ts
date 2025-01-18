/**
 * Strips Markdown code block wrappers from a given string if present.
 *
 * @param input - The input string potentially containing a Markdown code block.
 * @returns The unwrapped source code if a code block was present; otherwise, the original string.
 */
export function stripMarkdownCodeBlock(input: string): string {
  // Regular expression to match Markdown code blocks with optional language specifier
  const codeBlockRegex = /^```(\w+)?\n([\s\S]*?)\n```$/;

  const match = input.match(codeBlockRegex);
  if (match) {
    // match[2] contains the code inside the code block
    return match[2];
  }

  // If no code block is detected, return the original input
  return input;
}
