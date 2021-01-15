import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCheckMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const [{ data, fetching }] = useCheckMeQuery();
    const router = useRouter();
    useEffect(() => {
        if (!fetching && !data?.checkMe) {
            router.replace('/login?next=' + router.pathname)
        }
    }, [fetching, data, router]);
};