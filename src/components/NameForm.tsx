"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface NameFormProps {
  onSubmit: (name: string) => void;
}

const NameForm = ({ onSubmit }: NameFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
      className="w-full max-w-md px-4"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 tracking-tight">
        What should we call you?
      </h2>
      <form className="relative w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-6 py-4 pr-20 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-200/50 focus:border-cyan-500 transition-all bg-white/50 backdrop-blur-sm"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/30"
        >
          <ArrowRight />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default NameForm;
