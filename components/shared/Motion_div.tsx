"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MotionDivProps {
  children: React.ReactNode;
  className?: string;
  initial_opacity?: number;
  initial_y?: number;
  final_opacity?: number;
  final_y?: number;
  transition_delay?: number;
  transition_duration?: number;
  transition_type?: "easeIn" | "easeOut" | "easeInOut" | "linear";
  once?: boolean;
}

const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className,
  initial_opacity = 1,
  initial_y = 0,
  final_opacity = 1,
  final_y = 0,
  transition_delay = 0,
  transition_duration = 0,
  transition_type = "easeInOut",
  once = false,
}) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: initial_opacity, y: initial_y }}
      whileInView={{ opacity: final_opacity, y: final_y }}
      transition={{
        delay: transition_delay,
        duration: transition_duration,
        ease: transition_type,
      }}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
};

export default MotionDiv;
