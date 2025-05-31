import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'
import { sendPostNotificationEmails } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, content, subthreadId } = PostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // verify user is subscribed to passed subthread id
    const subscription = await db.subscription.findFirst({
      where: {
        subthreadId,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return new Response('Subscribe to post', { status: 403 })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subthreadId,
      },
    })

    // Fetch other subscribed users (excluding the poster)
    const subscribers = await db.subscription.findMany({
      where: {
        subthreadId,
      },
      include: {
        user: true,
        subthread: true,
      },
    })

    const emails = subscribers
      .map((s) => s.user.email)
      .filter((email): email is string => typeof email === 'string');
    const subthreadName = subscribers[0]?.subthread?.name ?? 'a community'

    if (emails.length > 0) {
      await sendPostNotificationEmails({
        to: emails,
        title,
        author: session.user.name || 'A user',
        subthreadName,
      })
    }
    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to subthread at this time. Please try later',
      { status: 500 }
    )
  }
}
