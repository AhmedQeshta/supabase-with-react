import Form from '@/components/Form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Tasks from '@/components/Tasks';

import { FormSchema } from '@/lib/schemas';
import Auth from '@/components/Auth';
import useFetchTasks from '@/Hooks/Tasks/useFetchTasks';
import useSessions from '@/Hooks/useSessions';
import useChannel from '@/Hooks/useChannel';
import useDeleteTask from '@/Hooks/Tasks/useDeleteTask';
import useEditTask from '@/Hooks/Tasks/useEditTask';

function App() {
  const [taskId, setTaskId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { tasks, setTasks } = useFetchTasks();
  const { session, setSession } = useSessions();
  const { deleteTask } = useDeleteTask();
  const { handleEdit } = useEditTask(setTaskId, form);
  useChannel(setTasks);

  return (
    <div>
      <Header session={session} setSession={setSession} />

      {session ? (
        <>
          <Form
            session={session}
            form={form}
            taskId={taskId}
            setTaskId={setTaskId}
          />

          <Tasks tasks={tasks} deleteTask={deleteTask} handleEdit={handleEdit} />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
