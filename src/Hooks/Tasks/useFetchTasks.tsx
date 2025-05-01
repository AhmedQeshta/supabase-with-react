import { TaskInterface } from '@/lib/types';
import { supabase } from '@/supabase-client';
import { useEffect, useState } from 'react';

const useFetchTasks = () => {
  const [tasks, setTasks] = useState<TaskInterface[]>([]);

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

  return { tasks, setTasks };
};

export default useFetchTasks;
