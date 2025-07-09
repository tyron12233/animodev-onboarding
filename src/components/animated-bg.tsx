import { FC, useMemo } from "react";

import { motion, Transition } from "motion/react";

const AnimatedBackground: FC = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const type = Math.random() > 0.5 ? "circle" : "plus";
      const color = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"][
        Math.floor(Math.random() * 4)
      ];
      const size = Math.random() * 40 + 20;
      const duration = Math.random() * 15 + 20;
      const delay = Math.random() * 15;
      const initialY = Math.random() * 50 + 50;
      const finalY = -(Math.random() * 50 + 50);

      return {
        id: i,
        type,
        color,
        size,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
        animate: {
          y: [`${initialY}vh`, `${finalY}vh`],
          rotate: [0, 360],
        },
        transition: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        } as Transition,
      };
    });
  }, []);

  return (
    <div className="inset-0 w-full h-full overflow-clip opacity-10">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute overflow-hidden"
          style={shape.style}
          animate={shape.animate}
          transition={shape.transition}
        >
          {shape.type === "circle" ? (
            <div
              className="rounded-full"
              style={{
                width: shape.size,
                height: shape.size,
                backgroundColor: shape.color,
              }}
            />
          ) : (
            <div
              style={{
                width: shape.size,
                height: shape.size,
                borderLeft: `5px solid ${shape.color}`,
                borderTop: `5px solid ${shape.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
