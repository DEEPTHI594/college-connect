'use client'

import { ChevronLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { buttonVariants } from './ui/Button'

const ToFeedButton = () => {
  const pathname = usePathname()

 

  const subthreadPath = getsubthreadPath(pathname)

  return (
    <a href={subthreadPath} className={buttonVariants({ variant: 'ghost' })}>
      <ChevronLeft className='h-4 w-4 mr-1' />
      {subthreadPath === '/' ? 'Back home' : 'Back to community'}
    </a>
  )
}

const getsubthreadPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
 
  else return '/'
}

export default ToFeedButton