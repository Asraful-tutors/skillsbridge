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
    queryKey: ["userPaths", user],
    // @ts-ignore
    queryFn: () => getUserSelectedPaths(user?.id),
    enabled: !!user,
  });

  return {
    userPaths,
    userPathsLoading,
    userPathsError,
  };
};

export default useUserPaths;
