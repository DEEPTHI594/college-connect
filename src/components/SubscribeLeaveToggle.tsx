'use client'
import { Button } from '@/components/ui/Button'
import { SubscribeToSubthreadPayload } from '@/lib/validators/subthread'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { useToast } from '../hooks/use-toasts'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useState } from 'react'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  subthreadId: string
  subthreadName: string
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subthreadId,
  subthreadName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast()
  const { loginToast } = useCustomToasts()
  const router = useRouter()
  const [isSubLoading, setIsSubLoading] = useState<boolean>(false)
  const [isUnsubLoading, setIsUnsubLoading] = useState<boolean>(false)
  const { mutate: subscribe} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubthreadPayload = {
        subthreadId,
      }

      const { data } = await axios.post('/api/subthread/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      setIsSubLoading(false);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsSubLoading(false);
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Subscribed!',
        description: `You are now subscribed to r/${subthreadName}`,
      })
    },
  })

  const { mutate: unsubscribe } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubthreadPayload = {
        subthreadId,
      }

      const { data } = await axios.post('/api/subthread/unsubscribe', payload)
      return data as string
    },
    onError: (err: AxiosError) => {
      setIsUnsubLoading(false);
      toast({
        title: 'Error',
        description: err.response?.data as string,
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsUnsubLoading(false);
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Unsubscribed!',
        description: `You are now unsubscribed from/${subthreadName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isUnsubLoading}
      onClick={() => {setIsUnsubLoading(true);unsubscribe()}}>
      Leave community
    </Button>
  ) : (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isSubLoading}
      onClick={() =>{setIsSubLoading(true); subscribe()}}>
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle

