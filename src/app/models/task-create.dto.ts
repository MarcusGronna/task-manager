// data transfer object

export interface TaskCreateDto {
  title: string;
  description?: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
}
