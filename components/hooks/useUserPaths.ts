import { getUserSelectedPaths } from "@/actions/getLearningPaths";
import { useQuery } from "@tanstack/react-query";

interface UserType {
  id: number;
}

const useUserPaths = (user: UserType | null) => {
  const {
    data: userPaths,
    isLoading: userPathsLoading,
    isError: userPathsError,
  } = useQuery({
    queryKey: ["userPaths", user?.id],
    queryFn: () =>
      user ? getUserSelectedPaths(user.id) : Promise.resolve(null),
    enabled: !!user,
  });

  return {
    userPaths,
    userPathsLoading,
    userPathsError,
  };
};

export default useUserPaths;
