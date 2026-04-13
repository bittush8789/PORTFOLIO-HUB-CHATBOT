import { motion } from "motion/react";
import { Mail, MessageSquare, Send, Github, Linkedin, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      // Note: You need to replace these with your actual EmailJS IDs
      // I've used environment variables which you can set in the settings
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_id";
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_id";
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key";

      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current!,
        publicKey
      );

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Have a project in mind or just want to say hi? Feel free to reach out!
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">bittush9534@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-900/20">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Socials</h3>
                <div className="mt-2 flex gap-4">
                  <a href="https://github.com/bittush8789" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Github size={20} />
                  </a>
                  <a href="https://www.linkedin.com/in/bittu-kumar-54ab13254/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900">
            <img
              src="https://picsum.photos/seed/contact/800/600"
              alt="Contact"
              className="h-full w-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-950"
        >
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/20">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Message Sent!</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-8 text-sm font-bold text-blue-600 hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  placeholder="How can I help you?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
