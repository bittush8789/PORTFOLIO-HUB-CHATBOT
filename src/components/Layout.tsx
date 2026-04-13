import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "motion/react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
