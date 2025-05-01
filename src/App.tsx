import Form from '@/components/Form';
import { supabase } from '@/supabase-client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Tasks from '@/components/Tasks';
import { TaskInterface } from '@/lib/types';
import { FormSchema } from '@/lib/schemas';
import Auth from '@/components/Auth';
import { Session } from '@supabase/supabase-js';

function App() {
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching tasks:', error.message);
      return;
    }

    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const deleteTask = async (id: number) => {
    // delete the image from storage
    // const { data: taskData, error: taskError } = await supabase
    //   .from('tasks')
    //   .select('image_url')
    //   .eq('id', id)
    //   .single();

    // if (taskError) {
    //   console.error('Error fetching task data:', taskError.message);
    //   return;
    // }

    // if (taskData.image_url) {
    //   const { error: storageError } = await supabase.storage
    //     .from('tasks-images')
    //     .remove([taskData.image_url.split('/').pop() as string]);
    //   if (storageError) {
    //     console.error('Error deleting image from storage:', storageError.message);
    //     return;
    //   }
    // }
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting data:', error.message);
      return;
    }

    console.log(id);
  };

  const handleEdit = async (id: number) => {
    const { data, error } = await supabase.from('tasks').select('*').eq('id', id);

    if (error) {
      console.error('Error get data:', error.message);
      return;
    }

    form.setValue('title', data[0].title);
    form.setValue('description', data[0].description);

    setTaskId(id);
  };

  useEffect(() => {
    const channel = supabase.channel('tasks-channel');
    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
        const newTask = payload.new as TaskInterface;
        setTasks((prevTasks) => [...prevTasks, newTask]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, (payload) => {
        const deletedTaskId = payload.old.id;
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
        const updatedTask = payload.new as TaskInterface;
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        );
      })
      .subscribe((status) => {
        console.log('Channel status:', status);
      });
  }, []);

  return (
    <div>
      <Header session={session} setSession={setSession} />

      {session ? (
        <>
          <Form
            session={session}
            form={form}
            FormSchema={FormSchema}
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
