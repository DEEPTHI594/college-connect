
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/Icons";
import { buttonVariants } from "./ui/Button";
import UserAccountNav from "@/components/UserAccountNav"; 
import { getAuthSession } from "@/lib/auth";
import SearchBar from "@/components/SearchBar"; 

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href='/' className="flex gap-2 items-center">
          <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">CollegeConnect</p>
        </Link>

        {/* Search bar & account nav only if logged in */}
        {session?.user ? (
          <>
            <SearchBar />
            <UserAccountNav user={session.user} />
          </>
        ) : (<></>)}
      </div>
    </div>
  );
};

export default Navbar;
