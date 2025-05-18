import {z} from 'zod';

export const SubthreadValidator = z.object({
    name: z.string().min(3).max(21),
    })

export const SubthreadSubscriptionValidator = z.object({
    subthreadId: z.string()
})


export type CreateSubthreadPayload = z.infer<typeof SubthreadValidator>;
export type SubscribeToSubthreadPayload  = z.infer<typeof SubthreadSubscriptionValidator>;