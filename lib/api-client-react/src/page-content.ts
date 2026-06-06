import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { customFetch, type ErrorType, type BodyType } from "./custom-fetch";
import type {
  PageContentResponse,
  UpdatePageContentBody,
  UpdatePageContentResponse,
} from "@workspace/api-zod";

export const PAGE_CONTENT_KEY = ["page-content"] as const;

export const getPageContentUrl = () => `/api/page-content`;

export const getPageContent = async (options?: RequestInit): Promise<PageContentResponse> => {
  return customFetch<PageContentResponse>(getPageContentUrl(), options);
};

export const getPageContentQueryOptions = <
  TData = Awaited<ReturnType<typeof getPageContent>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getPageContent>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return {
    queryKey: [...PAGE_CONTENT_KEY],
    queryFn: () => getPageContent(requestOptions),
    ...queryOptions,
  } as UseQueryOptions<Awaited<ReturnType<typeof getPageContent>>, TError, TData>;
};

export type GetPageContentQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPageContent>>
>;

export const useGetPageContent = <
  TData = GetPageContentQueryResult,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getPageContent>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: readonly unknown[] } => {
  const query = useQuery(getPageContentQueryOptions(options));
  return { ...query, queryKey: [...PAGE_CONTENT_KEY] };
};

export const getUpdatePageContentUrl = () => `/api/admin/page-content`;

export const updatePageContent = async (
  updatePageContentBody: BodyType<UpdatePageContentBody>,
  options?: RequestInit,
): Promise<UpdatePageContentResponse> => {
  return customFetch<UpdatePageContentResponse>(getUpdatePageContentUrl(), {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    body: JSON.stringify(updatePageContentBody),
  });
};

export const getUpdatePageContentMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updatePageContent>>,
    TError,
    { data: BodyType<UpdatePageContentBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updatePageContent>>,
  TError,
  { data: BodyType<UpdatePageContentBody> },
  TContext
> => {
  const mutationKey = ["updatePageContent"];
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};
  return {
    mutationKey,
    mutationFn: ({ data }: { data: BodyType<UpdatePageContentBody> }) =>
      updatePageContent(data, requestOptions),
    ...mutationOptions,
  };
};

export type UpdatePageContentMutationResult = NonNullable<
  Awaited<ReturnType<typeof updatePageContent>>
>;

export const useUpdatePageContent = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updatePageContent>>,
    TError,
    { data: BodyType<UpdatePageContentBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof updatePageContent>>,
  TError,
  { data: BodyType<UpdatePageContentBody> },
  TContext
> => {
  return useMutation(getUpdatePageContentMutationOptions(options));
};

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export function useInvalidatePageContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [...PAGE_CONTENT_KEY] });
}
