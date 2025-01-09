"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const WaveAnimation = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full md:w-[110%] overflow-hidden", className)}>
      <svg
        viewBox="-30 -30 1997 157"
        strokeLinecap="round"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        <motion.path
          fill="none"
          stroke="#7c3aed"
          strokeWidth="50"
          d="M0.5 86.5C91 22.1667 604.9 -67.9 1936.5 86.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.3,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

export default WaveAnimation;
