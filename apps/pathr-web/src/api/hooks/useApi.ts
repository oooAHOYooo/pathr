import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiListTrips, apiCreateTrip, apiStats, type ApiTrip } from "../client";
import { useAuth } from "../../auth/AuthProvider";

export function useTrips() {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ["trips", auth?.token],
    queryFn: () => apiListTrips(auth!.token),
    enabled: !!auth?.token
  });
}

export function useStats() {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ["stats", auth?.token],
    queryFn: () => apiStats(auth!.token),
    enabled: !!auth?.token
  });
}

export function useCreateTrip() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trip: Omit<ApiTrip, "id" | "userId">) => apiCreateTrip(auth!.token, trip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    }
  });
}
