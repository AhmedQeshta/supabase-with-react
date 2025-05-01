import { z } from 'zod';

export const FormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 10 characters.',
    })
    .max(50, {
      message: 'Title must not be longer than 30 characters.',
    }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.',
    })
    .max(200, {
      message: 'Description must not be longer than 200 characters.',
    }),
  // add more fields here
  image: z.string().optional(),
  // .refine((file) => file.size <= 2 * 1024 * 1024, {
  //   message: 'File size must be less than 2MB',
  // })
  // .refine((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
  //   message: 'File type must be JPEG, PNG, or GIF',
  // }),
});

export const FormSchemaAuth = z
  .object({
    email: z
      .string()
      .min(2, {
        message: 'Email must be at least 2 characters.',
      })
      .max(50, {
        message: 'Email must not be longer than 50 characters.',
      }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .max(50, {
        message: 'Password must not be longer than 50 characters.',
      }),
    // add more fields here
  })
  .refine((data) => data.password.length >= 8, {
    message: 'Password must be at least 8 characters long',
  })
  .refine((data) => data.password.length <= 50, {
    message: 'Password must not be longer than 50 characters',
  });
