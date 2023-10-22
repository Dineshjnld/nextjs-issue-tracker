'use client';
import { useRouter } from 'next/navigation';
import { Button, Callout, TextField } from '@radix-ui/themes';
import Link from 'next/link';
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/validationSchema';
import { z } from 'zod';
import { useState } from 'react';

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  });
  const [error, setError] = useState('');

  // Submit handler
  const onSubmit = async (data: { title: any; description: any; }) => {
    try {
      await axios.post('/api/issues', data);

      // Redirect to the issues page with query parameters
      router.push(`/issues?title=${data.title}&description=${data.description}`);
    } catch (error) {
      console.log(error);
      setError('An error occurred while submitting the issue.');
    }
  };

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className='mb-5'>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className='max-w-xl space-y-3' onSubmit={handleSubmit(onSubmit)}>
        <TextField.Root>
          <TextField.Input placeholder='Title' {...register('title')} />
        </TextField.Root>

        <Controller
          name="description"
          control={control}
          render={(field) => <SimpleMDE placeholder='Description' />}
        />

        <Button type="submit">Submit New Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
