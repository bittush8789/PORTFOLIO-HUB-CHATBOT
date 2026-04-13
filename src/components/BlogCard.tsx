import { Link } from "react-router-dom";
import { Blog } from "@/src/types";
import { formatDate, calculateReadingTime } from "@/src/lib/utils";
import { motion } from "motion/react";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
        <Link to={`/blog/${blog.id}`} className="block overflow-hidden">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-48 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">No Image</span>
            </div>
          )}
        </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {blog.category}
            </span>
            {blog.series && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                Part {blog.seriesPart}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {calculateReadingTime(blog.content)}
          </span>
        </div>
        <Link to={`/blog/${blog.id}`}>
          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {blog.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {blog.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(blog.createdAt)}
          </span>
          <Link
            to={`/blog/${blog.id}`}
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Read More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
