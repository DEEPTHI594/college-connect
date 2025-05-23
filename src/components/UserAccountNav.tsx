"use client"
import Link from 'next/link'
import { FC } from 'react'
import { User } from 'next-auth'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu'
import {UserAvatar} from './UserAvatar'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { signOut } from 'next-auth/react'

interface UserAccountNavProps {
  user: Pick<User , 'name' | 'image' | 'email' >
}

const UserAccountNav: FC<UserAccountNavProps> = ({user}) => {
    
  return (
  <DropdownMenu>
    <DropdownMenuTrigger>
        <UserAvatar
          className='h-8 w-8'
          user={
            {
                name: user.name || null,
                image: user.image || null
            }
        } />
    </DropdownMenuTrigger>
    <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center gap-2 p-2'>
            <div className='flex flex-col leading-none'>
{user.name && <p className='font-medium'>{user.name}</p>}
{user.email && <p className='text-sm text-muted-foreground'>{user.email}</p>}
</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <Link href='/'>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href='/r/create'>Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
        className='cursor-pointer'
        onSelect={(event)=>{
            event.preventDefault()
            signOut({
                callbackUrl: `${window.location.origin}/sign-in`,

            })
        }} >
            Sign Out
        </DropdownMenuItem>
           
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default UserAccountNav