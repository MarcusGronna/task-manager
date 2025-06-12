/** Håller variabler som skiljer mellan dev/prod.
 * Byter ut vid build.
 * Denna -> environment.ts
 *
 * https://angular.dev/tools/cli/environments
 * https://github.com/expressjs/cors#readme
 */

export const environment = {
  production: false,
  // apiUrl: 'https://trainingdataapi.onrender.com',
  apiUrl: '/api',
};
