import {getAuthSession} from "@/lib/auth"
import {db} from "@/lib/db"
import {notFound} from "next/navigation"
import {format} from "date-fns"
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle" 
import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"

const Layout = async ( {
    children,
    params: { slug },
}:{
    children: React.ReactNode
params :{slug:string}
}) =>{
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
                },
            },
        },
    })

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
     where: {
        subthread: {
            name: slug,
        },
        user:{
            id: session.user.id,
        },
     }, 
    })

    const isSubscribed = !!subscription
    if(!subthread) return notFound()

    const memberCount = await db.subscription.count({ 
        where: {
            subthread: {
                name: slug,
            },
        },
      })


    return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
    <div>
        {/* TODO : Button to take us back*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className='flex flex-col col-span-2 space-y-6'>{children}</div>
            {/* info sidebar */}
            <div className='hidden md:block overflow-hidden rounded-lg h-fit border border-gray-200 order-first md:order-last'>
                <div className="px-6 py-4">
                    <p className="font-semibold py-3">About r/</p> 
                    </div>
                    <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-gray-500">created</dt>
                            <dd className="text-gray-700">
                                <time dateTime={subthread.createdAt.toDateString()}>
                                  {format(subthread.createdAt, "MMMM d, yyyy")}  
                                </time>
                            </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-gray-500"> Members</dt>
                            <dd className="text-gray-700">
                                <div className= "text-gray-900">{memberCount}</div>
                            </dd>
                        </div>
                        {subthread.creatorId === session?.user.id ? (
                            <div className="flex justify-between gap-x-4 py-3">
                                <p className="text-gray-500"> You created this community</p>
                            </div>
                        ):null}
                        {subthread.creatorId !== session?.user.id ? (
                            <SubscribeLeaveToggle 
                            isSubscribed={isSubscribed}
                            subthreadId={subthread.id} 
                            subthreadName={subthread.name}/>
                            ) : null}

                            <Link className={buttonVariants({
                                variant:'outline',
                                className: 'w-full mb-6',
                            })}
                            href={`r/${slug}/submit`}>
                                Create Post</Link>
                         </dl>
                        </div>
                    </div>
                </div>
                </div> 
    )
}

export default Layout