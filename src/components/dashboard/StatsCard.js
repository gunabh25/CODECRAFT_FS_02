'use client';

import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color, theme }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50 text-blue-700',
        dark: 'bg-blue-900/20 text-blue-300',
        icon: 'text-blue-500'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        light: 'bg-green-50 text-green-700',
        dark: 'bg-green-900/20 text-green-300',
        icon: 'text-green-500'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50 text-purple-700',
        dark: 'bg-purple-900/20 text-purple-300',
        icon: 'text-purple-500'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        light: 'bg-orange-50 text-orange-700',
        dark: 'bg-orange-900/20 text-orange-300',
        icon: 'text-orange-500'
      }
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(color);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const valueVariants = {
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl p-6 shadow-lg backdrop-blur-sm border ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      } transition-all duration-300 hover:shadow-xl relative overflow-hidden group cursor-pointer`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 group-hover:animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            theme === 'dark' ? colorClasses.dark : colorClasses.light
          } shadow-lg`}>
            <motion.div variants={iconVariants}>
              <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
            </motion.div>
          </div>
          
          {/* Trend Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className={`w-2 h-2 rounded-full ${colorClasses.bg} bg-gradient-to-r shadow-sm`}
          />
        </div>

        {/* Value */}
        <motion.div
          variants={valueVariants}
          className="mb-2"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            <CountUp end={value} />
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {title}
        </motion.h3>

        {/* Progress Bar */}
        <div className="mt-4 relative">
          <div className={`w-full h-1 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(value * 5, 100)}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${colorClasses.bg} shadow-sm`}
            />
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorClasses.bg} blur-sm`}
          />
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
           style={{ borderColor: `var(--${color}-500)` }} />
    </motion.div>
  );
}

// CountUp Component
function CountUp({ end, duration = 1 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); // 60 FPS
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}