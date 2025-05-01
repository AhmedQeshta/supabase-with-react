import { Session } from '@supabase/supabase-js';

export interface TaskInterface {
  id: number | string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}

export interface TasksProps {
  tasks: TaskInterface[];
  deleteTask: (id: number) => void;
  handleEdit: (id: number) => void;
}

export interface HeaderProps {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export interface CustomFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  taskId: number | null;
  setTaskId: (id: number | null) => void;
  session: Session | null;
}
