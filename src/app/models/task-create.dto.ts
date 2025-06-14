import { TaskPriority } from './task.model';

// data transfer object
export interface TaskCreateDto {
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline: string; // ISO-datum
}
