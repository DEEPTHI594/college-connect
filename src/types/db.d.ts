import type { Post, Subthread, User, Vote, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  subthread: Subthread
  votes: Vote[]
  author: User
  comments: Comment[]
}