import { buttonVariants } from "@/components/ui/Button";
import {toast } from "@/components/ui/use-toast";
import Link from "next/link";

export const loginToast = () => {
    const { dismiss } = toast({
        title: 'Login required',
        description: 'You need to be logged in to perform this action',
        variant: 'destructive',
        action: (
            <Link
                href='/sign-in'
                onClick={() => dismiss()}
                className={buttonVariants({ variant: 'outline' })}>
                Login
            </Link>
        )
    });
};

export const useCustomToasts = () => {
    return { loginToast };
};