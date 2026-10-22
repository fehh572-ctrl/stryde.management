import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  HTMLMotionProps,
} from "framer-motion";

export const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface EditorialRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
}

export const EditorialReveal: React.FC<EditorialRevealProps> = ({
  children,
  delay = 0,
  distance = 22,
  duration = 0.68,
  className = "",
  ...rest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const SummitScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] origin-left bg-gradient-to-r from-[#021B3A] via-[#4FA3B8] to-[#7FE0EE] pointer-events-none"
    />
  );
};

interface ParallaxFrameProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  children,
  className = "",
  offset = 24,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};
