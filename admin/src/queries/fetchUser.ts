import { useQuery } from "@tanstack/vue-query";
import { getErrorResponseOrThrow, post, refreshTokens } from "../utils/auth";
import type { UserResponse } from "../types/requests";

export const fetchUser = () => {
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await post<UserResponse, null>("/auth", null, {
          accessToken: true,
        });
      } catch (err) {
        const res = getErrorResponseOrThrow(err);
        if (res.statusCode !== 401) throw err;
        await refreshTokens();
      }
    },
    retry: 1,
  });
};
