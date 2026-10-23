import { useEffect, useRef } from "react";

export const useInfiniteScroll = (
  onLoadMore: () => void,
  { enabled = true, isLoading = false, rootMargin = "200px" } = {}
) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !enabled || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callbackRef.current();
      },
      { rootMargin }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, isLoading, rootMargin]);

  return sentinelRef;
};