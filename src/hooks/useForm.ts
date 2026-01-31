import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Example form schema
export const exampleFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export type ExampleFormData = z.infer<typeof exampleFormSchema>;

// Hook for using the form
export function useExampleForm() {
  return useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });
}
