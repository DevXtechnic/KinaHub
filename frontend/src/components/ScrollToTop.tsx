import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure the scroll happens after React has rendered the new layout
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      // Fallback for some mobile browsers
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
