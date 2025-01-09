/**
 * Determines if the application is running in debug mode.
 *
 * Debug mode is typically enabled when NODE_ENV is set to 'development'.
 * This function returns true if NODE_ENV is 'development', and false otherwise.
 *
 * @returns {boolean} - True if in debug mode, false otherwise.
 */
export const isDebugMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Determines if the application is running in production mode.
 *
 * @returns {boolean} - True if in production mode, false otherwise.
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Determines if the application is running in test mode.
 *
 * @returns {boolean} - True if in test mode, false otherwise.
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};
