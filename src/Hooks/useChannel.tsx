/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskInterface } from '@/lib/types';
import { supabase } from '@/supabase-client';
import { SetStateAction, useEffect } from 'react';

const useChannel = (setTasks: {
  (value: SetStateAction<TaskInterface[]>): void;
  (arg0: { (prevTasks: any): any[]; (prevTasks: any): any; (prevTasks: any): any }): void;
}) => {
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
  }, [setTasks]);

  return {};
};

export default useChannel;
