import { getUserSelectedPathSkills } from "@/actions/getLearningPaths";
import { useQuery } from "@tanstack/react-query";

interface UserType {
  id: number;
}

const useUserPathSkills = () => {
  const {
    data: userSkills,
    isLoading: userSkillsLoading,
    isError: userSkillsError,
  } = useQuery({
    queryKey: ["userPathSkillScore"],
    queryFn: async () => await getUserSelectedPathSkills(),
  });

  return {
    userSkills,
    userSkillsLoading,
    userSkillsError,
  };
};

export default useUserPathSkills;
