/** Ger typkontroll för att kunna använda till tasks --
 *
 *
 * https://www.typescriptlang.org/docs/handbook/2/objects.html
 */

export type TaskPriority = 'low' | 'medium' | 'high';
// prettier-ignore

export interface Task {         // kontrakt för en uppgifts-post,
  id: string; 
  projectId: string;             // ID,
  title: string;                // titel på uppgiften,
  description?: string;         // valfri beskrivning på uppgiften,
  done: boolean;                // true om uppgiften är klar,
  priority: TaskPriority;            
  deadline: string;
  createdAt?: Date;             // valfritt - datum när posten skapades
}
