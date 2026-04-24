import { gsap } from 'gsap';

/**
 * Aurora Animation Engine - UX Refinement v2.2.1
 * Implements global 'prefers-reduced-motion' support and standard easing.
 */

export const initAnimationCore = () => {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const applyPreferences = (isReduced: boolean) => {
    if (isReduced) {
      gsap.config({ force3D: false });
      gsap.defaults({ 
        duration: 0.01, 
        ease: 'none', 
        stagger: 0 
      });
      console.log('Aurora Animation Engine: Reduced Motion Active');
    } else {
      gsap.config({ force3D: true });
      gsap.defaults({ 
        duration: 1.2, 
        ease: 'expo.out' 
      });
    }
  };

  applyPreferences(mediaQuery.matches);
  
  // Listen for changes
  mediaQuery.addEventListener('change', (e) => applyPreferences(e.matches));
};

export const getAnimationDefaults = () => {
  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return {
    duration: isReduced ? 0.1 : 1.2,
    ease: isReduced ? "none" : "expo.out",
    stagger: isReduced ? 0 : 0.1,
  };
};
