// utils/handleApiError.js
import { toast } from 'sonner';

const handleApiError = (err, fallbackMessage = "Something went wrong!") => {
  console.error(err);

  const serverMessage =
    err?.response?.data?.error ||  
    err?.response?.data?.message || 
    err?.message ||                 
    fallbackMessage;

  toast(serverMessage);
};

export default handleApiError;