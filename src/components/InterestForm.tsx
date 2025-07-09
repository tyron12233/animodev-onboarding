"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const interests = [
  "Graphic Design",
  "Coding",
  "DevOps",
  "UI/UX",
  "Frontend",
  "Backend",
  "AI/ML",
  "Game Dev",
  "Digital Arts",
  "Content Creation",
  "Project Management",
  "Psychology",
  "Healthcare Tech",
  "Creative Writing",
  "Marketing",
];

interface InterestFormProps {
  onSubmit: (interests: string[]) => void;
  value: string[];
}

const InterestForm = ({ onSubmit, value }: InterestFormProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(value);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedInterests);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
      className="w-full max-w-lg text-center px-4"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-8">
        What are you interested in?
      </h2>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
        {interests.map((interest) => (
          <motion.button
            key={interest}
            onClick={() => toggleInterest(interest)}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: selectedInterests.includes(interest)
                ? "#3b82f6"
                : "#e5e7eb",
              color: selectedInterests.includes(interest)
                ? "#ffffff"
                : "#1f2937",
            }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base"
          >
            {interest}
          </motion.button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 mx-auto"
        >
          <span>Finish</span>
          <ArrowRight />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default InterestForm;
