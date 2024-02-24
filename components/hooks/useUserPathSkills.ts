import { getUserSelectedPathSkills } from "@/actions/getLearningPaths";
import { useQuery } from "@tanstack/react-query";

interface UserType {
  id: number;
}

const useUserPathSkills = (user: UserType | null) => {
  const {
    data: userSkills,
    isLoading: userSkillsLoading,
    isError: userSkillsError,
  } = useQuery({
    queryKey: ["userPathSkills", user?.id],
    queryFn: () =>
      user ? getUserSelectedPathSkills(user.id) : Promise.resolve(null),
    enabled: !!user,
  });

  return {
    userSkills,
    userSkillsLoading,
    userSkillsError,
  };
};

export default useUserPathSkills;
