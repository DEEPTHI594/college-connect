import { getAuthSession } from "@/lib/auth";    
import { SubthreadValidator } from "@/lib/validators/subthread";
import {db} from '@/lib/db'
import { z } from "zod";

export async function POST(req: Request) {
  try{
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json()
    const {name} = SubthreadValidator.parse(body)
    const  subthreadExists = await db.subthread.findFirst({
      where: {
        name,
      },
    })
    if (subthreadExists) {
      return new Response("Subthread already exists", { status: 409 });
    }
    const subthread = await db.subthread.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })  
    await db.subscription.create({
      data:{
      userId: session.user.id,
      subthreadId: subthread.id, 
},
})
return new Response(subthread.name)
  }
catch(error){
  if(error instanceof z.ZodError){
    return new Response(error.message, { status: 422 });
  }

  return new Response("Could not create subthread", { status: 500 });
}
}