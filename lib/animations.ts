// Animation variants and utilities for Framer Motion
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3, ease: "easeOut" }
}

export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 }
}

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  }
}

export const cardHover = {
  y: -8,
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" }
}

export const buttonHover = {
  scale: 1.05,
  y: -2,
  transition: { duration: 0.2, ease: "easeOut" }
}

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
}

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export const gradientAnimation = {
  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "linear"
  }
}

export const shimmerAnimation = {
  x: ["-100%", "100%"],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}
