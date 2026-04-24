import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const imageUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `http://127.0.0.1:8000${course.thumbnail}`;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group relative h-64 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Background Image */}
      <img
        src={
          course.thumbnail
            ? imageUrl
            : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
        }
        alt={course.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4 text-white w-full space-y-2">
        
        <h3 className="text-lg font-semibold line-clamp-1">
          {course.title}
        </h3>

        <p className="text-sm text-white/70 line-clamp-2">
          {course.description}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-2">
          
          <span className="text-amber-400 font-semibold">
            ${course.price}
          </span>

          <Link
            to={`/courses/${course.id}`}
            className="px-3 py-1 text-sm rounded-md bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition"
          >
            View →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;