// types/global.d.ts

declare global {
  type PageProps = {
    params: Record<string, string | string[]>;
    searchParams?: Record<string, string | string[] | undefined>;
  };
}

export {};