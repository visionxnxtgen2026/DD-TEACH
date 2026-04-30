import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // 🔗 Handle anchor links (#section)
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // 🔙 Handle back/forward (don't force smooth scroll)
    if (navigationType === "POP") {
      window.scrollTo(0, 0);
    } else {
      // 🔥 Normal navigation
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pathname, hash, navigationType]);

  return null;
}