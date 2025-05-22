import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useNavigateOnce = () => {
  const navigationRef = useRef(null); 
  const navigate = useNavigate();

  const navigateOnce = (path, toastMsg = '', toastType = 'warn') => {
    console.log({path, toast})
    if (navigationRef.current !== path) {
      console.log(`[Navigating Once] To: ${path}`);
      navigationRef.current = path;
      if (toastMsg) {
        switch (toastType) {
          case "warn":
            toast.warn(toastMsg);
            break;
          case "success":
            toast.success(toastMsg);
            break;
          case "info":
            toast.info(toastMsg);
            break;
          case "error":
            toast.error(toastMsg);
            break;
          default:
            toast(toastMsg);
        }
      }
      navigate(path);
    }
  };

  return navigateOnce;
};
