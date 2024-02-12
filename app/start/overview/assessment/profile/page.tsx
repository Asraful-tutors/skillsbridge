"use client";

import UserProfileCard from "@/components/app/start/overview/UserProfileCard";
import ProfileOverview from "@/components/app/start/overview/assessment/profile/ProfileOverview";
import { motion } from "framer-motion";

export default function page() {
  return (
    <motion.div className="max-w-screen-2xl my-8 rounded-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 py-6 px-9 bg-white_background">
      <UserProfileCard />
      <div className="lg:col-span-2">{/* <ProfileOverview /> */}</div>
    </motion.div>
  );
}
