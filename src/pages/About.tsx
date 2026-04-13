import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const skills = [
    "DevOps", "MLOps", "CI/CD", "Docker", "Kubernetes", 
    "Cloud Computing", "AI/ML Workflows", "Infrastructure as Code", "Python", "Linux"
  ];

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Hi, I'm <span className="text-blue-600">Bittu Kumar</span>
          </h1>
          <div className="mt-2 flex items-center space-x-2 text-lg font-medium text-gray-600 dark:text-gray-400">
            <span>DevOps</span>
            <span className="h-1 w-1 rounded-full bg-gray-400"></span>
            <span>MLOps</span>
            <span className="h-1 w-1 rounded-full bg-gray-400"></span>
            <span>LLMOps Engineer</span>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              I am a specialized DevOps, MLOps, and LLMOps Engineer with a proven track record in architecting scalable infrastructure and automating complex machine learning lifecycles. I focus on bridging the gap between advanced AI development and production-grade operational excellence.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              With over 2 years of experience, I specialize in building resilient CI/CD pipelines, orchestrating high-availability Kubernetes clusters, and streamlining Large Language Model (LLM) workflows. My mission is to empower engineering teams to deploy sophisticated AI systems with maximum confidence and speed.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              I thrive in high-impact remote environments, leveraging global collaboration to stay at the forefront of the cloud-native landscape. I am dedicated to driving business value through containerization, infrastructure-as-code, and robust AI/ML operational frameworks.
            </p>
          </div>

          <div className="mt-8 flex space-x-4">
            <a href="https://github.com/bittush8789" target="_blank" rel="noopener noreferrer" className="rounded-full bg-gray-100 p-3 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/bittu-kumar-54ab13254/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-gray-100 p-3 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
              <Linkedin size={20} />
            </a>
            <a href="mailto:bittush9534@gmail.com" className="rounded-full bg-gray-100 p-3 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
              <Mail size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQH62lVf6HzTaQ/profile-displayphoto-scale_400_400/B56ZrQmDwuI0Ag-/0/1764436231313?e=1777507200&v=beta&t=ySyudiR1P5Xg8r1AaNiXzLbKf0TxCA--AaEL_2Vhuow"
              alt="Bittu Kumar"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Open for Remote Roles</span>
            </div>
          </div>
        </motion.div>
      </div>

      <section className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">What I Do</h2>
          <ul className="space-y-4">
            {[
              { title: "DevOps", desc: "Automating infrastructure and CI/CD pipelines for seamless delivery." },
              { title: "MLOps", desc: "Streamlining machine learning lifecycles from experimentation to production." },
              { title: "LLMOps", desc: "Architecting robust operational frameworks for Large Language Models at scale." }
            ].map((item) => (
              <li key={item.title} className="flex items-start space-x-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600"></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Key Strengths</h2>
          <div className="space-y-4 rounded-2xl bg-blue-50/50 p-8 dark:bg-blue-900/10">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              "Expert in container orchestration with Docker and Kubernetes, with a deep focus on system reliability and automation."
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              I specialize in turning complex manual processes into efficient, repeatable automated workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Technical Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-32 rounded-3xl bg-gray-900 p-12 text-center dark:bg-white">
        <h2 className="text-3xl font-bold text-white dark:text-gray-900">Let's build something together</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-400 dark:text-gray-600">
          I'm currently open to new opportunities and collaborations. If you have a project in mind or just want to chat, feel free to reach out.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/contact"
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            Get in Touch
          </a>
          <a
            href="mailto:bittush9534@gmail.com"
            className="rounded-full border border-gray-700 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 dark:border-gray-200 dark:text-gray-900 dark:hover:bg-gray-50"
          >
            Email Me
          </a>
        </div>
      </section>
    </div>
  );
}
