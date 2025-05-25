import {toast} from 'react-toastify';
  export default function handleFirebaseError (e) {
    const errorCode = e.code;
    const errorMessage = e.message;

    switch (errorCode) {
      case "auth/invalid-email":
        toast.error(
          "The email address is invalid. Please enter a valid email."
        );
        break;
      case "auth/user-not-found":
        toast.error(
          "No user found with this email. Please check your email or sign up."
        );
        break;
      case "auth/wrong-password":
        toast.error(
          "Incorrect password. Please try again or reset your password."
        );
        break;
      case "auth/email-already-in-use":
        toast.error("This email is already in use.");
        break;
      case "auth/weak-password":
        toast.error(
          "The password is too weak. Please choose a stronger password."
        );
        break;
      case "auth/invalid-credential":
        toast.error(
          "The email or password you entered is invalid. Please try again."
        );
        break;
      case "auth/user-disabled":
        toast.error(
          "This account has been disabled. Please contact support for assistance."
        );
        break;
      case "auth/too-many-requests":
        toast.error("Too many attempts. Please try again later.");
        break;
      case "auth/operation-not-allowed":
        toast.error("This operation is not allowed. Please contact support.");
        break;
      case "auth/expired-action-code":
        toast.error("The action code has expired. Please try again.");
        break;
      case "auth/network-request-failed":
        toast.error(
          "Network error. Please check your internet connection and try again."
        );
        break;
      case "auth/invalid-verification-code":
        toast.error(
          "Invalid verification code. Please check the code and try again."
        );
        break;
      default:
        toast.error(errorMessage || "Something went wrong. Please try again.");
    }
  };