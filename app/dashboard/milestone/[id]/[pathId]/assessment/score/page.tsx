// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import { SkillCard } from "@/components/shared/SkillCard";
import { ProgressGauge } from "@/components/shared/ProgressGauge";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useUserPaths from "@/components/hooks/useUserPaths";
import useUserPathSkills from "@/components/hooks/useUserPathSkills";
import Loading from "@/app/loading";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { markCompletedMilestones } from "@/lib/backend/score";
import { toast } from "sonner";

export default function ScorePage() {
  // Temporary data to display the content properly until the backend is ready
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.user.userData);

  // Concatenate params.id and getmilestoneId and then format the path name
  const formattedPathName = `${params?.id} ${params?.pathId}`;

  const { userSkills, userSkillsLoading, userSkillsError } = useUserPathSkills(
    //@ts-ignore
    user?.id,
    formattedPathName
  );

  const { isPending, mutate } = useMutation({
    mutationFn: (milestoneName) => markCompletedMilestones(milestoneName),

    onSuccess: () => {
      // queryClient.invalidateQueries('your-query-key');
      toast.success(`${formattedPathName} completed successfully`);
      router.push("/dashboard");
    },
    onError: () => {
      toast.error(`Something went wrong`);
    },
  });

  const handleMarkCompleted = async (milestoneName: string) => {
    // Call the mutation function
    mutate(milestoneName);
  };

  if (userSkillsLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (userSkillsError) {
    return <>Something went wrong</>;
  }

  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-full my-8 rounded-2xl mx-auto flex flex-col gap-12 py-[34px] px-[52px] bg-white_background">
      <div className="border-b-[1px] border-[#B1ABAB] w-full">
        <h1 className="text-2xl font-bold m-6">Scorecard</h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:mx-[50px]">
        {userSkills &&
          userSkills.map((skill, i) => <SkillCard key={i} skill={skill} />)}
      </div>
      <div className="flex flex-col items-center">
        <Button
          onClick={() => handleMarkCompleted(`${formattedPathName}`)}
          variant={"violate"}
          className="max-w-[284px]"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
