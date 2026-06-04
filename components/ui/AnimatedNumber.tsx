"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  decimals?: number;
};

export default function AnimatedNumber({
  value,
  duration = 1.2,
  decimals = 0,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest =>
    Number(latest.toFixed(decimals))
  );

  useEffect(() => {
    const controls = animate(motionValue, value, { duration });
    return controls.stop;
  }, [value, duration, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}
