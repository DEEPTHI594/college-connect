"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { CreateSubthreadPayload } from "@/lib/validators/subthread";
import { toast } from "@/components/ui/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { FC } from "react";

const Page: FC = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginToast } = useCustomToasts();

  const { mutate: createCommunity } = useMutation({
    mutationFn: async () => {
      const payLoad: CreateSubthreadPayload = { name: input };
      const { data } = await axios.post('/api/subthread', payLoad);
      return data as string;
    },
    onError: (err) => {
      setIsLoading(false);
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Community already exists',
            description: 'Please choose another name',
            variant: 'destructive',
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid subthread name',
            description: 'Please choose a name between 3 and 21 characters',
            variant: 'destructive',
          });
        }
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: 'There was an error',
        description: 'Could not create subthread',
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      setIsLoading(false);
      router.push(`/r/${data}`);
    },
  });

  const handleCreate = () => {
    if (input.includes(' ')) {
      return toast({
        title: 'Invalid name',
        description: 'Community names cannot contain spaces.',
        variant: 'destructive',
      });
    }

    setIsLoading(true);
    createCommunity();
  };

  return (
    <div className='container mx-auto flex flex-col items-center justify-center h-screen'>
      <div className="relative bg-white w-full h-fit p-6 rounded-lg space-y-6 shadow">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Create a Community</h1>
        </div>
        <hr className="bg-zinc-500 h-px mb-4" />

        <div>
          <p className='text-lg font-semibold mb-1'>Name</p>
          <p className="text-sm text-zinc-500 mb-3">
            Community names, including capitalization, cannot be changed.
          </p>
          <div className="relative mb-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-2 w-full"
              placeholder="community-name"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant='subtle' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={handleCreate}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;