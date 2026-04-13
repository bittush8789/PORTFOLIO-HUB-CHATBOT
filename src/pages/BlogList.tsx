import { useState, useEffect } from "react";
import { Blog } from "@/src/types";
import BlogCard from "@/src/components/BlogCard";
import { Search, Filter } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Blog[];
        setBlogs(blogsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "blogs");
      }
    };
    fetchAllBlogs();
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          The Blog
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sharing my thoughts, tutorials, and experiences in tech.
        </p>
      </div>

      <div className="mb-12 flex flex-col gap-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-gray-100 py-3 pl-12 pr-4 text-sm focus:outline-none dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center rounded-2xl border border-gray-100 bg-white p-1 dark:border-gray-900 dark:bg-[#0a0a0a]">
          <div className="flex w-full items-center gap-2 overflow-x-auto px-2 py-1 no-scrollbar">
            {["All", "DevOps", "MLOps", "LLMOps", "AI", "Cloud", "Security"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === category
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
              >
                {category === "All" && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-gray-900 text-[10px] text-white dark:bg-white dark:text-black">
                    A
                  </div>
                )}
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
