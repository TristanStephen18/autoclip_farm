import { useEffect, useState } from "react";

export function useAuthHooks() {
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checkViewport = () => setIsMobile(window.innerWidth < 768);

  const viewportChecker = () => {
    useEffect(() => {
      checkViewport();
      window.addEventListener("resize", checkViewport);
      console.log("changing size")
      return () => window.removeEventListener("resize", checkViewport);
    }, []);
  };

  return {
    isLogin,
    setIsLogin,
    isMobile,
    setIsMobile,
    showConfirmPassword,
    setShowConfirmPassword,
    showPassword,
    setShowPassword,
    viewportChecker,
  };
}
