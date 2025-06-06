import { ca } from "date-fns/locale"
import { getAuthSession } from "@/lib/auth"
import { SubthreadSubscriptionValidator } from "@/lib/validators/subthread"
import {db} from "@/lib/db"
import {z} from "zod"

export async function POST(req: Request) {
    try{
        const session = await getAuthSession()
        if(!session?.user) {
            return new Response("Unauthorized", {status: 401})
        }
        const body = await req.json()

        const{ subthreadId } = SubthreadSubscriptionValidator.parse(body)
        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subthreadId,
                userId: session.user.id,
                },
        })
        if(!subscriptionExists) {
            return new Response("You are not subscribed to this subthread", {status: 400})
        }
        const subthread = await db.subthread.findFirst({
            where: {
                id: subthreadId,
                creatorId: session.user.id,
            },
        })
        if(subthread) {
            return new Response("You cannot unsubscribe from your own subthread", {status: 400})
        }   
        await db.subscription.delete({
            where: {
                userId_subthreadId: {
                    subthreadId,
                    userId: session.user.id,
                },
            },
        })
        return new Response(subthreadId)

    }catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid request data passed', { status: 422 });
          }
        
          return new Response("Could not unsubscribe,please try again later ", { status: 500 });
    }
}