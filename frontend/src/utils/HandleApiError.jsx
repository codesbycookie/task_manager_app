// utils/handleApiError.js
import { toast } from 'react-toastify';

const handleApiError = (err, fallbackMessage = "Something went wrong!") => {
  console.error(err);

  const serverMessage =
    err?.response?.data?.error ||  
    err?.response?.data?.message || 
    err?.message ||                 
    fallbackMessage;

  toast.error(serverMessage);
};

export default handleApiError;