import { FC } from 'react'
import { Button } from '@/components/ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubthreadSubscriptionPayload } from '@/lib/validators/subthread'
import axios from 'axios'


interface SubscribeLeaveToggleProps {
  subthreadId: string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subthreadId,
}) => {
    const isSubscribed = false 
    
    const{} = useMutation({
        mutationFn: async  () => { 
          const payLoad : SubthreadSubscriptionPayload = {
            subthreadId,
          }  
         const {data} = await axios.post('/api/subthread/subscribe', payLoad) 
         return data as string
        },
       
    })
  return isSubscribed ?( 
  <Button className='w-full mt-1 mb-4'>Leave Community</Button>
 ):( 
 <Button className='w-full mt-1 mb-4'>Join to post </Button>
  )
}

export default SubscribeLeaveToggle