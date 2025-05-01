import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomFormProps } from '@/lib/types';
import { ChangeEvent, useState } from 'react';

const CustomForm = ({
  form,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FormSchema,
  taskId,
  setTaskId,
  session,
}: CustomFormProps) => {
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
    form.reset();
    setTaskId(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  return (
    <div className="grid w-full px-10 ">
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Create New task</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex my-5 w-full items-center justify-center flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" id="title" placeholder="Write a text..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your description here."
                          id="description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          id="image"
                          placeholder="Your Image"
                          {...field}
                          onChange={(e) => handleFileChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Button size="default" className="text-sm bg-gray-600" type="submit">
                  {taskId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomForm;
