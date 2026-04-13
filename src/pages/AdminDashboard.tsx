import { useState, useEffect } from "react";
import { Blog } from "@/src/types";
import { Plus, Edit2, Trash2, X, Save, Sparkles, Loader2, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDate } from "@/src/lib/utils";
import { GoogleGenAI, Type } from "@google/genai";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog> | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
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

  const handleCreate = () => {
    setCurrentBlog({
      title: "",
      content: "",
      excerpt: "",
      category: "DevOps",
      series: "",
      seriesPart: 1,
      tags: [],
      image: "",
    });
    setIsEditing(true);
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        fetchBlogs();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `blogs/${id}`);
      }
    }
  };

  const handleSuggestSeries = async () => {
    if (!currentBlog?.title || !currentBlog?.content) {
      alert("Please enter a title and some content first.");
      return;
    }

    setIsSuggesting(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: `Analyze this blog post and suggest if it belongs to a series. 
        Title: ${currentBlog.title}
        Content: ${currentBlog.content.substring(0, 1000)}
        
        If it belongs to a series, provide the series name and the part number. 
        If it doesn't seem to be part of a series, suggest a potential series name it could start.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              series: { type: Type.STRING, description: "The name of the series" },
              seriesPart: { type: Type.NUMBER, description: "The part number in the series" },
              reasoning: { type: Type.STRING, description: "Why this series was suggested" }
            },
            required: ["series", "seriesPart"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (result.series) {
        setCurrentBlog({
          ...currentBlog,
          series: result.series,
          seriesPart: result.seriesPart
        });
      }
    } catch (error) {
      console.error("AI suggestion failed:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBlog) return;

    setIsSaving(true);
    try {
      const blogData = {
        ...currentBlog,
        updatedAt: new Date().toISOString(),
      };

      if (currentBlog.id) {
        const { id, ...data } = blogData;
        await updateDoc(doc(db, "blogs", id), data);
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogData,
          createdAt: new Date().toISOString(),
        });
      }

      setIsEditing(false);
      setCurrentBlog(null);
      fetchBlogs();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, currentBlog.id ? `blogs/${currentBlog.id}` : "blogs");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Content Manager</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your blog posts here.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Plus className="mr-2" size={18} />
          New Post
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Post</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {blog.image ? (
                      <img src={blog.image} className="h-10 w-10 rounded-lg object-cover mr-3" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 mr-3 flex items-center justify-center text-[10px] text-gray-400">
                        N/A
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">{blog.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {blog.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(blog.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentBlog?.id ? "Edit Post" : "Create New Post"}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="max-h-[70vh] overflow-y-auto px-8 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Title</label>
                      <input
                        type="text"
                        required
                        value={currentBlog?.title}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                        placeholder="Post title"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                      <select
                        required
                        value={currentBlog?.category}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      >
                        {["DevOps", "MLOps", "LLMOps", "AI", "Cloud", "Security", "General"].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                          Series
                          <button
                            type="button"
                            onClick={handleSuggestSeries}
                            disabled={isSuggesting}
                            className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {isSuggesting ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                            AI Suggest
                          </button>
                        </label>
                        <input
                          type="text"
                          value={currentBlog?.series || ""}
                          onChange={(e) => setCurrentBlog({ ...currentBlog, series: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                          placeholder="e.g. K8s Masterclass"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Part #</label>
                        <input
                          type="number"
                          value={currentBlog?.seriesPart || ""}
                          onChange={(e) => setCurrentBlog({ ...currentBlog, seriesPart: parseInt(e.target.value) || 1 })}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Excerpt</label>
                      <textarea
                        required
                        rows={3}
                        value={currentBlog?.excerpt}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                        placeholder="A short summary of the post"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Image URL</label>
                      <div className="flex flex-col gap-4">
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="url"
                            value={currentBlog?.image || ""}
                            onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                        
                        {currentBlog?.image && (
                          <div className="relative group aspect-video overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                            <img 
                              src={currentBlog.image} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/error/800/450";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setCurrentBlog({ ...currentBlog, image: "" })}
                              className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                      <textarea
                        required
                        rows={12}
                        value={currentBlog?.content}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-mono focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                        placeholder="# Your content here..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={currentBlog?.tags?.join(", ")}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, tags: e.target.value.split(",").map(t => t.trim()) })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                        placeholder="react, design, tech"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full px-8 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 animate-spin" size={18} />
                    ) : (
                      <Save className="mr-2" size={18} />
                    )}
                    {isSaving ? "Saving..." : "Save Post"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
