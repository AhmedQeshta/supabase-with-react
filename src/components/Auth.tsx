import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

import { FormSchemaAuth } from '@/lib/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { supabase } from '@/supabase-client';

const Auth = () => {
  const [formType, setFormType] = useState<'login' | 'register'>('login');

  const formAuth = useForm<z.infer<typeof FormSchemaAuth>>({
    resolver: zodResolver(FormSchemaAuth),
  });

  const toggleFormType = () => {
    setFormType((prev: string) => (prev === 'login' ? 'register' : 'login'));
  };


  const handleAuthSubmit = async (data: z.infer<typeof FormSchemaAuth>) => {
    if (formType === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        console.error('Error signing in:', error.message);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        console.error('Error signing up:', error.message);
        return;
      }
    }
    formAuth.reset();
  };

  return (
    <div className="grid w-full px-10 ">
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>{formType === 'login' ? 'Sing In' : ' Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...formAuth}>
            <form
              onSubmit={formAuth.handleSubmit(handleAuthSubmit)}
              className="flex my-5 w-full items-center justify-center flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={formAuth.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          id="email"
                          placeholder="example@example.example"
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
                  control={formAuth.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          id="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Button size="default" className="text-sm bg-gray-600" type="submit">
                  Sign In
                </Button>
              </div>
            </form>
          </Form>

          {formType === 'login' ? (
            <p className="text-sm text-gray-500">
              Don't have an account?
              <Button
                variant="link"
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={toggleFormType}>
                Sign Up
              </Button>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Already have an account?
              <Button
                variant="link"
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={toggleFormType}>
                Sign In
              </Button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
