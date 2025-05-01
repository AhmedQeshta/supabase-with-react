import { FormSchema } from '@/lib/schemas';
import { supabase } from '@/supabase-client';
import { Session } from '@supabase/supabase-js';
import { ChangeEvent, useState } from 'react';
import { z } from 'zod';

const useCreateTask = (
  session: Session | null,
  taskId: number | null,
  form: { setValue: (arg0: string, arg1: string) => void },
  setTaskId: { (id: number | null): void; (arg0: null): void },
) => {
  const [taskImage, setTaskImage] = useState<File | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;
    // Upload the image to Supabase storage
    const { error } = await supabase.storage.from('tasks-images').upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }
    // Get the public URL of the uploaded image
    const {
      data: { publicUrl },
    } = await supabase.storage.from('tasks-images').getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    let imageUrl: string | null = null;

    // Handle file upload if an image is provided
    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
    }

    if (taskId) {
      // Update logic here
      const { error } = await supabase
        .from('tasks')
        .update({
          title: data.title,
          description: data.description,
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating data:', error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: data.title,
          description: data.description,
          email: session?.user?.email,
          image_url: imageUrl,
        })
        .single();

      if (error) {
        console.error('Error inserting data:', error.message);
        return;
      }
    }

    // Reset the form after submission
    form.setValue('title', '');
    form.setValue('description', '');
    form.setValue('image', '');
    setTaskImage(null);
    setTaskId(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  return { handleSubmit, handleFileChange };
};

export default useCreateTask;
