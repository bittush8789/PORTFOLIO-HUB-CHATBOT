import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black">
                D
              </div>
              <span>DevOps Hub</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} DevOps Hub. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/bittush8789" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/bittu-kumar-54ab13254/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Linkedin size={20} />
            </a>
            <a href="mailto:bittush9534@gmail.com" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
