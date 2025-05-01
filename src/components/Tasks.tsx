import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';
import { TasksProps } from '@/lib/types';

const Tasks: FC<TasksProps> = ({ tasks, deleteTask, handleEdit }) => {
  return (
    <>
      <div className="grid w-full px-10 ">
        <p className="mb-3 text-2xl font-bold text-gray-600">All Tasks</p>
        {tasks &&
          tasks?.map(({ id, image_url, title, description, created_at }) => (
            <Card key={id} className="mb-4 relative">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{description}</p>
                {image_url && (
                  <img
                    src={image_url}
                    alt="Task Image"
                    className="w-full h-48 object-cover rounded-lg mt-2"
                  />
                )}
                <small>Created at: {new Date(created_at).toLocaleString()}</small>
                <Button
                  onClick={() => deleteTask(+id)}
                  className="absolute top-3.5 right-3.5 bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
                <Button
                  onClick={() => handleEdit(+id)}
                  className="absolute top-3.5 right-25.5 bg-blue-600 hover:bg-blue-700">
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}

        {tasks?.length === 0 && (
          <p className="text-gray-500">No tasks available. Please create a new task.</p>
        )}
      </div>
    </>
  );
};

export default Tasks;
