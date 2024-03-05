import { getUserSelectedPathSkills } from "@/actions/getLearningPaths";
import { useQuery } from "@tanstack/react-query";

interface UserType {
  id: number;
}

const useUserPathSkills = (
  user: UserType | null,
  formattedPathName: string
) => {
  const {
    data: userSkills,
    isLoading: userSkillsLoading,
    isError: userSkillsError,
  } = useQuery({
    queryKey: ["userPathSkills", user?.id, formattedPathName],
    queryFn: () =>
      user
        ? getUserSelectedPathSkills(user.id, formattedPathName)
        : Promise.resolve(null),
    enabled: !!user,
  });

  return {
    userSkills,
    userSkillsLoading,
    userSkillsError,
  };
};

export default useUserPathSkills;
