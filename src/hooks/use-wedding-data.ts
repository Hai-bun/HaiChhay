import { useQuery } from "@tanstack/react-query";
import { getWeddingData, getGuestById } from "@/lib/weddingStore";

// Shared cache keys so the invite envelope (/invite/:guestId) and the full
// invitation (/wedding/:guestId) reuse the same fetched data instead of each
// triggering its own loading screen.
const FIVE_MINUTES = 5 * 60 * 1000;

export const useWeddingData = () =>
  useQuery({
    queryKey: ["weddingData"],
    queryFn: getWeddingData,
    staleTime: FIVE_MINUTES,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useGuest = (guestId?: string) =>
  useQuery({
    queryKey: ["guest", guestId],
    queryFn: () => getGuestById(guestId as string),
    enabled: Boolean(guestId),
    retry: 1,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });
