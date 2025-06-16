# 🗂️ Task Manager – Angular 17 + Signals

En komplett **Task Manager-app** som demonstrerar modern Angular-utveckling helt utan autentisering.  
Alla data lagras lokalt via en **Local-Storage-interceptor**, så ingen extern back-end krävs.

---

![Översikt av appen](docs/TaskManager.png)

# installera beroenden

npm install

# starta dev-server ⇒ http://localhost:4200

npm start # alias: ng serve -o

| Område                | Detaljer                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Projekthantering**  | Lista / skapa / redigera / ta bort • Sök & statusfilter                                                          |
| **Uppgiftshantering** | Lista / skapa / redigera / ta bort • Markera ✔️ klar / 🕓 pågår • Prioritet & deadline • Drag-and-drop-sortering |
| **Dashboard**         | Översikt av antal projekt, uppgifter & % klara                                                                   |
| **Delade byggstenar** | `ShiftDateButtonsComponent`, `OverdueDirective`, `TaskFilterPipe`                                                |
| **Signals**           | `ProjectService` & `TaskService` använder **WritableSignal**; komponenter konsumerar via `toObservable()`        |

| Paket                        | Syfte                        |
| ---------------------------- | ---------------------------- |
| **Angular 17** (stand-alone) | SPA-ramverket                |
| **Angular Material 17**      | UI-komponenter               |
| **RxJS 7 + Signals**         | Dataflöden & reaktivt state  |
| **Angular CDK**              | Drag-and-drop-funktionalitet |
| **Karma / Jasmine**          | Enhetstester                 |

src/
├─ app/
│ ├─ features/
│ │ ├─ dashboard/
│ │ ├─ projects/
│ │ └─ tasks/
│ ├─ shared/
│ │ ├─ components/ ShiftDateButtonsComponent
│ │ ├─ directives/ OverdueDirective
│ │ └─ pipes/ TaskFilterPipe
│ ├─ models/ Project & Task-interfaces
│ └─ app.routes.ts Routingdefinition
├─ services/ ProjectService • TaskService • LS-interceptor
└─ environments/ apiUrl = '/api'

Local-Storage-interceptor
Fångar alla HttpClient-anrop mot /projects & /tasks.

Läser/uppdaterar nyckeln localStorage['tm-db'].

Vill du byta till en riktig back-end? – ta bara bort interceptorn.

Reflektion & designval
Signals > RxJS – enklare state, memoiserade selectors.

Local-Storage-back-end – offline-stöd + snabb Netlify-deploy.

Stand-alone-komponenter – minimal boilerplate, explicita imports:.

Strict-typed Reactive Forms – TypeScript garanterar fältens typer.

Custom pipe + direktiv + generisk komponent uppfyller kursens avancerade krav.
