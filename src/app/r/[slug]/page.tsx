import { getAuthSession } from '@/lib/auth'
import {notFound} from 'next/navigation'
import {db} from '@/lib/db'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import MiniCreatePost from '@/components/ui/MiniCreatePost'
import PostFeed from '@/components/PostFeed'

interface PageProps {
    params: {
        slug: string
    }
}

const page = async ({params}: PageProps) => {
    const { slug } = params

    const session = await getAuthSession()
    const subthread = await db.subthread.findFirst({
        where: {
            name: slug,
        },
        include:{
            posts:{
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subthread : true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take:INFINITE_SCROLLING_PAGINATION_RESULTS ,

            }
        },
    })

    if(!subthread) return notFound()
        return (
        <>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
                r/{subthread.name}
            </h1>
    <MiniCreatePost session={session} />
    <PostFeed initialPosts={subthread.posts} subthreadName={subthread.name}/>
    </>
    )
}

export default page
