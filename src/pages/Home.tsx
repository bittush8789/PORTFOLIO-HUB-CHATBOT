import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "@/src/types";
import BlogCard from "@/src/components/BlogCard";
import { motion } from "motion/react";
import { ArrowRight, Settings, Cpu, Sparkles } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(3));
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
    fetchLatestBlogs();
  }, []);

  return (
    <div className="space-y-32 py-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            <Sparkles size={14} className="text-orange-500" />
            The Future of Engineering
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl dark:text-white"
          >
            Learn DevOps, <br />
            MLOps, <br />
            AI the <span className="text-gray-400 dark:text-gray-600">easy way.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-gray-400"
          >
            Deep dives into modern infrastructure, machine learning pipelines, and the emerging world of LLM engineering. Built for developers, by developers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/blog"
              className="group flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Start Reading
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="#"
              className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
            >
              Join the Community
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <img 
              src="https://media.licdn.com/dms/image/v2/D5603AQH62lVf6HzTaQ/profile-displayphoto-scale_400_400/B56ZrQmDwuI0Ag-/0/1764436231313?e=1777507200&v=beta&t=ySyudiR1P5Xg8r1AaNiXzLbKf0TxCA--AaEL_2Vhuow" 
              alt="Bittu Kumar" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* Floating Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -bottom-6 -right-6 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-900/20">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Top Contributor</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">AI Architecture</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "DevOps",
              desc: "Automating infrastructure, CI/CD pipelines, and ensuring high availability for production systems.",
              icon: <Settings className="text-blue-600" size={24} />,
            },
            {
              title: "MLOps",
              desc: "Bridging the gap between ML models and production with robust deployment and monitoring workflows.",
              icon: <Cpu className="text-blue-600" size={24} />,
            },
            {
              title: "LLMOps",
              desc: "Managing Large Language Models at scale, focusing on fine-tuning, prompt engineering, and deployment.",
              icon: <Sparkles className="text-blue-600" size={24} />,
            },
          ].map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-gray-900/50"
            >
              <div className="mb-4 inline-block rounded-xl bg-white p-3 shadow-sm dark:bg-gray-800">
                {skill.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{skill.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Blogs */}
      <section>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest from the blog</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Thoughts on software development and design.</p>
          </div>
          <Link
            to="/blog"
            className="group flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400"
          >
            View all posts
            <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
