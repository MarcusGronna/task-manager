/**
 * https://angular.dev/guide/components
 * https://angular.dev/api/platform-browser/bootstrapApplication
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    // befintligt HttpClient-stöd
    provideHttpClient(withInterceptorsFromDi()),

    // In-memory-API:t som interceptar alla /api-anrop
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(
        InMemoryDataService,
        { delay: 300 } // simulera 300 ms nätverkslatens
      )
    ),

    // provideInMemoryWebApi(InMemoryDataService, { delay: 300 }), // 300 ms nätverkslatens
  ],
}).catch((err) => console.error(err));
