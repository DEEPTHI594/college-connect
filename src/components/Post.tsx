import { formatTimeToNow } from '@/lib/utils'
import type { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  subthreadName: string
  currentVote?: PartialVote
  commentAmt: number
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subthreadName,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  const hasBlocks = (content: any): content is { blocks: any[] } =>
    typeof content === 'object' && content !== null && Array.isArray(content.blocks)

  const normalBlocks = hasBlocks(post.content)
    ? post.content.blocks.filter((block: any) => block.type !== 'attaches')
    : []

  const attachments = hasBlocks(post.content)
    ? post.content.blocks.filter((block: any) => block.type === 'attaches')
    : []

  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {subthreadName ? (
              <>
                <a
                  className='underline text-zinc-900 text-sm underline-offset-2'
                  href={`/r/${subthreadName}`}>
                  r/{subthreadName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subthreadName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            <EditorOutput content={{ blocks: normalBlocks }} />
            {pRef.current?.clientHeight === 160 ? (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </div>

          {/* ✅ Attachments rendered separately */}
          {attachments?.length > 0 && (
            <div className='mt-4 space-y-2'>
              {attachments.map((block: any, i: number) => {
                const file = block.data.file
                return (
                  <div
                    key={i}
                    className='p-3 rounded border bg-gray-50 text-sm'>
                    <a
                      href={file.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline break-all'>
                      📎 {block.data.title || file.name}
                    </a>
                    <p className='text-xs text-gray-500'>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className='bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6'>
        <Link
          href={`/r/${subthreadName}/post/${post.id}`}
          className='w-fit flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
export default Post