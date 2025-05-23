"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { CreateSubthreadPayload } from "@/lib/validators/subthread";
import { toast } from "@/components/ui/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { FC } from "react";

const Page: FC = () => {
    const router = useRouter()
    const[input, setInput] = useState<string>('')
    const {loginToast} = useCustomToasts()
    
    const {mutate: createcommunity, isLoading} = useMutation({
        mutationFn: async () => {
            const payLoad: CreateSubthreadPayload ={
                name: input,
            }
            const{data} = await axios.post('/api/subthread',payLoad )
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 409){
                    return toast({
                        title: 'Community already exists',
                        description: 'Please choose another name',
                        variant: 'destructive',
                    })

            }
            if(err.response?.status === 422){
                return toast({
                    title: 'Invalid subthread name',
                    description: 'Please choose a name between 3 and 21 characters', 
                    variant: 'destructive',
                })

        }
        if(err.response?.status === 401){
            return loginToast()
            }
    }
    toast ({
        title:'There was an error',
        description: 'CPuld not create subthread',
        variant: 'destructive',
    })
     },
     onSuccess: (data) => {
        router.push(`/r/${data}`)
     },
})

    return <div className='container mx-auto flex flex-col items-center justify-center h-screen'>
        <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
            <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Create a Community</h1>

        </div>
        <hr className="bg-zinc-500 h-px" />
        <div>
            <p className='text-lg font-medium'>Name</p>
            <p className="text-xs pb-s">
                Community names including capitalization cannot be changed. 
            </p>
            <div className="realtive">
               <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400"> 

                </p>
                <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6" />
            </div>
        </div>
        <div className="flex justify-end gap-4">
            <Button variant='subtle' onClick={()=>router.back()}>
                Cancel
            </Button>
            <Button isLoading={isLoading}
             disabled={input.length === 0} 
             onClick={() => createcommunity()}>Create Community</Button>
            </div>

        </div>
    </div>
}

export default Page


// function useMutation(arg0: {}) {
//     throw new Error("Function not implemented.");
// }

