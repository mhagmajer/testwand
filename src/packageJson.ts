import { createRequire } from 'module';

export const packageJson: {
  readonly name: string;
  readonly description: string;
  readonly version: string;
} = createRequire(import.meta.url)('../package.json');
