import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Blog } from "@/src/types";
import { formatDate, calculateReadingTime } from "@/src/lib/utils";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock, Tag, ChevronLeft, ChevronRight, List } from "lucide-react";
import { motion } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [seriesPosts, setSeriesPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Blog;
          setBlog(data);

          if (data.series) {
            const q = query(
              collection(db, "blogs"), 
              where("series", "==", data.series),
              orderBy("seriesPart", "asc")
            );
            const querySnapshot = await getDocs(q);
            const series = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Blog[];
            setSeriesPosts(series);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `blogs/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const prevPost = seriesPosts.find(p => (p.seriesPart || 0) === (blog?.seriesPart || 0) - 1);
  const nextPost = seriesPosts.find(p => (p.seriesPart || 0) === (blog?.seriesPart || 0) + 1);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post not found</h2>
        <Link to="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl py-12">
      <Link
        to="/blog"
        className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2" size={16} />
        Back to blog
      </Link>

      <header className="mb-12">
        <div className="mb-4 flex items-center gap-4">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {blog.category}
          </span>
          {blog.series && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {blog.series} • Part {blog.seriesPart}
            </span>
          )}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="mr-1" size={14} />
            {calculateReadingTime(blog.content)}
          </div>
        </div>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          {blog.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="mr-2" size={16} />
          {formatDate(blog.createdAt)}
        </div>
      </header>

      {blog.image && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 overflow-hidden rounded-3xl"
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="h-auto w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {blog.series && seriesPosts.length > 1 && (
        <div className="mt-16 rounded-3xl border border-gray-100 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
            <List size={18} className="text-blue-600" />
            {blog.series} Roadmap
          </div>
          <div className="space-y-4">
            {seriesPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
                  post.id === blog.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  post.id === blog.id ? "bg-white text-blue-600" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}>
                  {post.seriesPart}
                </div>
                <span className="text-sm font-medium line-clamp-1">{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {blog.series && (prevPost || nextPost) && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.id}`}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 p-6 transition-all hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-400"
            >
              <ChevronLeft className="text-blue-600" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Previous Part</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{prevPost.title}</div>
              </div>
            </Link>
          ) : <div />}
          {nextPost && (
            <Link
              to={`/blog/${nextPost.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-6 text-right transition-all hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-400"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Next Part</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{nextPost.title}</div>
              </div>
              <ChevronRight className="text-blue-600" />
            </Link>
          )}
        </div>
      )}

      <footer className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800">
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <Tag className="mr-1" size={12} />
              {tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}
