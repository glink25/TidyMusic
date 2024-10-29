import createLoadings from "@/ui/loading";

const { LoadingRoot, useLoading } = createLoadings();

export const { controller: loadings } = useLoading(true);

export { LoadingRoot, useLoading };
