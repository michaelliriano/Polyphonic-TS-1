import { useState, useEffect } from "react";

type WindowType = "mobile" | "tablet" | "desktop";

interface WindowTypeInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const useWindowType = (): WindowTypeInfo => {
  const [windowTypeInfo, setWindowTypeInfo] = useState<WindowTypeInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = window;
      let type: WindowType;

      if (innerWidth < 768) {
        type = "mobile";
      } else if (innerWidth < 1024) {
        type = "tablet";
      } else {
        type = "desktop";
      }

      setWindowTypeInfo({
        isMobile: type === "mobile",
        isTablet: type === "tablet",
        isDesktop: type === "desktop",
      });
    };

    handleResize(); // Initial detection

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowTypeInfo;
};

export default useWindowType;
