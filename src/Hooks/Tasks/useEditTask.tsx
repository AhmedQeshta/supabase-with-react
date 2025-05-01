/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/supabase-client';

const useEditTask = (setTaskId: (id: number) => void, form: any) => {
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

  return { handleEdit };
};

export default useEditTask;
