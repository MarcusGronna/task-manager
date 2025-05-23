/** Håller variabler som skiljer mellan dev/prod.
 * Byter ut vid build.
 * Denna -> environment.ts
 *
 * https://angular.dev/tools/cli/environments
 */

export const environment = {
  production: false,
  apiUrl: '*',
};
