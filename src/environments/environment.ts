/** Håller variabler som skiljer mellan dev/prod.
 * Byter ut vid build.
 * Denna vid prod.
 *
 * https://angular.dev/tools/cli/environments
 * https://github.com/expressjs/cors#readme
 */

export const environment = {
  production: true,
  // apiUrl: 'https://trainingdataapi.onrender.com',
  apiUrl: '/api',
};
