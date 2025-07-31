// Animation configuration for consistent animations across the application

export const pageTransitions = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
}

export const pageTransitionConfig = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

export const cardAnimations = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}

export const listItemAnimations = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 20
  }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -30
  }
}

export const slideInLeft = {
  initial: {
    opacity: 0,
    x: -50
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: -50
  }
}

export const slideInRight = {
  initial: {
    opacity: 0,
    x: 50
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 50
  }
}

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0.8
  }
}

export const loadingSpinner = {
  animate: {
    rotate: 360
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear'
  }
}

export const progressBar = {
  initial: {
    scaleX: 0,
    opacity: 0
  },
  animate: {
    scaleX: 1,
    opacity: 1
  },
  exit: {
    scaleX: 0,
    opacity: 0
  }
}

// Navigation animations
export const navigationAnimations = {
  item: {
    initial: {
      opacity: 0,
      x: -20
    },
    animate: {
      opacity: 1,
      x: 0
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  },
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}

// Modal animations
export const modalAnimations = {
  overlay: {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  },
  content: {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20
    }
  }
}

// Table row animations
export const tableRowAnimations = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -10
  }
}

// Button animations
export const buttonAnimations = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
}

// Common transition configurations
export const transitions = {
  fast: {
    duration: 0.2,
    ease: 'easeInOut'
  },
  medium: {
    duration: 0.3,
    ease: 'easeInOut'
  },
  slow: {
    duration: 0.5,
    ease: 'easeInOut'
  },
  bounce: {
    duration: 0.6,
    ease: [0.68, -0.55, 0.265, 1.55]
  }
} 