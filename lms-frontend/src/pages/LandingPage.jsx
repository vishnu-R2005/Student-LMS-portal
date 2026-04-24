import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-4 py-16">
      
      {/* Glow Background */}
      <div className="absolute w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative mx-auto max-w-6xl">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Learn Smarter, <br />
            <span className="text-cyan-400">Not Harder</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-white/70 text-lg">
            A modern learning platform designed to keep you focused, motivated,
            and progressing every day 🚀
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              to="/courses"
              className="px-8 py-3 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition hover:shadow-[0_0_15px_#22d3ee]"
            >
              Explore Courses
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition"
            >
              Get Started
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">📚 Structured Learning</h3>
            <p className="text-white/60 text-sm">
              Well-organized courses designed for efficient understanding.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">📈 Track Progress</h3>
            <p className="text-white/60 text-sm">
              Visual insights to keep you motivated and consistent.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">🎓 Expert Content</h3>
            <p className="text-white/60 text-sm">
              Learn from curated, high-quality instructor-led courses.
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold">
            Start your learning journey today
          </h2>
          <Link
            to="/register"
            className="inline-block mt-6 px-8 py-3 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition"
          >
            Join Now 🚀
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;