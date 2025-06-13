/** Ger typkontroll för att kunna använda till tasks -- 
 * _id: string;                  // MongoDB-ID
  title: string;                // titel på uppgiften
  description?: string;         // valfri beskrivning på uppgiften
  done: boolean;                // true om uppgiften är klar
  createdAt?: Date;             // valfritt - datum när posten skapades
 * 
 * https://www.typescriptlang.org/docs/handbook/2/objects.html
 */

// prettier-ignore

export interface Task {         // kontrakt för en uppgifts-post,
  id: string; 
  projectId: string;                 // ID,
  title: string;                // titel på uppgiften,
  description?: string;         // valfri beskrivning på uppgiften,
  done: boolean;    
  priority: string;            // true om uppgiften är klar,
  deadline: string;
  createdAt?: Date;             // valfritt - datum när posten skapades
}
