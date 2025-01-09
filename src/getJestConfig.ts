import { Config } from '@jest/types';
import { readConfig } from 'jest-config';

export async function getJestConfig(
  projectRoot: string
): Promise<Config.ProjectConfig> {
  const { projectConfig } = await readConfig({ $0: '', _: [] }, projectRoot);
  return projectConfig;
}
