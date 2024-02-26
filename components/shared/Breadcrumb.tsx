"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Breadcrumb() {
  const params = useParams();

  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-fit rounded-2xl mx-auto mt-[43px]">
      <nav>
        <ul className="flex flex-row">
          <Link href={"/dashboard"} className="text-[#4F6181] text-sm">
            Dashboard
          </Link>
          <span className="text-sm">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
          <span className="text-sm">MileStone</span>
          <span className="text-sm">
            &nbsp;&nbsp;/&nbsp;&nbsp;{params?.pathId}
          </span>
        </ul>
      </nav>
    </motion.div>
  );
}
