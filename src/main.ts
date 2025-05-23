/**
 * https://angular.dev/guide/components
 * https://angular.dev/api/platform-browser/bootstrapApplication
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
