import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { db } from "@/lib/db";

export default async function Home() {
  const session = await getAuthSession();

  let showCustomFeed = false;

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
    });

    showCustomFeed = followedCommunities.length > 0;
  }

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl'>Welcome to CollegeConnect</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/* Feed Area */}
        <div className='md:col-span-2'>
          {session ? (
            showCustomFeed ? (
              // @ts-expect-error server component
              <CustomFeed />
            ) : (
              // @ts-expect-error server component
              <GeneralFeed />
            )
          ) : (
            <div className='p-6 border rounded-lg bg-white shadow-sm'>
              <h2 className='text-xl font-semibold mb-2'>Discover, Connect, Engage</h2>
              <p className='text-sm text-zinc-600'>
                CollegeConnect helps students engage in communities, share ideas, and collaborate on campus topics. Sign up to get started!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
          <div className='bg-emerald-100 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div>
          <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                Your personal CollegeConnect frontpage. Sign in to explore your favorite communities.
              </p>
            </div>
            {!session && (
              <Link
                className={buttonVariants({
                  className: 'w-full mt-4 mb-6',
                })}
                href={`/sign-up`}
              >
                Sign Up
              </Link>
            )}
            {session && (
              <Link
                className={buttonVariants({
                  className: 'w-full mt-4 mb-6',
                })}
                href={`/r/create`}
              >
                Create Community
              </Link>
            )}
          </dl>
        </div>
      </div>
    </>
  );
}
