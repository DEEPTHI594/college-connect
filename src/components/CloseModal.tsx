"use client"
import { FC } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'


const CloseModal = ( ) => {
    const router = useRouter()
  return(
    <Button variant='subtle' className='h-6 w- p-0 rounded-md' aria-label='close modal'>
        <X className='h-4 w-4' />
    </Button>
  ) 
}

export default CloseModal