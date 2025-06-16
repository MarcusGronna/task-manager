import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

export const commonTestImports = [
  NoopAnimationsModule, // <-- NgModule
];

export const commonTestProviders = [
  provideHttpClientTesting(), // <-- anropas
  provideRouter([]), // <-- anropas
];
