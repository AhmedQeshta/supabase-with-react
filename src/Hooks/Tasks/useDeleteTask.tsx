import { supabase } from '@/supabase-client';

const useDeleteTasks = () => {
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

  return { deleteTask };
};

export default useDeleteTasks;
