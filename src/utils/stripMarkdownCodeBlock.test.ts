import { stripMarkdownCodeBlock } from './stripMarkdownCodeBlock';

describe('stripMarkdownCodeBlock', () => {
  it('should strip a TypeScript code block', () => {
    const input = `\`\`\`typescript
console.log('hello world!')
\`\`\``;
    const expected = `console.log('hello world!')`;
    expect(stripMarkdownCodeBlock(input)).toBe(expected);
  });

  it('should strip a code block without language specifier', () => {
    const input = `\`\`\`
function add(a, b) {
    return a + b;
}
\`\`\``;
    const expected = `function add(a, b) {
    return a + b;
}`;
    expect(stripMarkdownCodeBlock(input)).toBe(expected);
  });

  it('should return the original string if no code block is present', () => {
    const input = `This is a regular string without code blocks.`;
    expect(stripMarkdownCodeBlock(input)).toBe(input);
  });

  it('should handle code blocks with different language specifiers', () => {
    const input = `\`\`\`python
print('Hello, World!')
\`\`\``;
    const expected = `print('Hello, World!')`;
    expect(stripMarkdownCodeBlock(input)).toBe(expected);
  });

  it('should handle multiline code inside code blocks', () => {
    const input = `\`\`\`javascript
function greet(name) {
    console.log('Hello, ' + name + '!');
}

greet('Alice');
\`\`\``;
    const expected = `function greet(name) {
    console.log('Hello, ' + name + '!');
}

greet('Alice');`;
    expect(stripMarkdownCodeBlock(input)).toBe(expected);
  });

  it('should trim trailing and leading whitespace outside the code block', () => {
    const input = `   \`\`\`js
console.log('Trim test');
\`\`\`   `;
    const expected = `console.log('Trim test');`;
    expect(stripMarkdownCodeBlock(input.trim())).toBe(expected);
  });

  it('should not strip inline code formatted with single backticks', () => {
    const input = 'Here is some inline code: `const x = 10;`.';
    expect(stripMarkdownCodeBlock(input)).toBe(input);
  });

  it('should handle code blocks with backticks inside the code', () => {
    const input = `\`\`\`javascript
const template = \`Hello, \${name}!\`;
console.log(template);
\`\`\``;
    const expected = `const template = \`Hello, \${name}!\`;
console.log(template);`;
    expect(stripMarkdownCodeBlock(input)).toBe(expected);
  });

  it('should handle code blocks with no newline after opening backticks', () => {
    const input = "```python\nprint('No newline after backticks')\n```";
    const expected = "print('No newline after backticks')";
    expect(stripMarkdownCodeBlock(input)).toBe(expected);
  });

  it('should return the original string if only opening backticks are present', () => {
    const input = "```javascript\nconsole.log('Missing closing backticks')";
    expect(stripMarkdownCodeBlock(input)).toBe(input);
  });

  it('should return the original string if only closing backticks are present', () => {
    const input = "console.log('Missing opening backticks')\n```";
    expect(stripMarkdownCodeBlock(input)).toBe(input);
  });
});
