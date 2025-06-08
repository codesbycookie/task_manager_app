/* eslint-disable no-useless-catch */
import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase/Firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, 
    updatePassword,
      reauthenticateWithCredential,
        EmailAuthProvider,



} from "firebase/auth";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    setLoading(true); 
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  
  const loginFirebase = async (email, password) => {
    setLoading(true); 
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false); 
    }
  };
  
  const verifyEmailFirebase = async () => {
    setLoading(true); 
    try {
      return await sendEmailVerification(currentUser);
    } catch (error) {
      throw error; 
    } finally {
      setLoading(false)
    }
  };
  
  const logoutFirebase = async () => {
    setLoading(true); 
    try {
      return await auth.signOut();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false); 
    }
  };

  const forgetPasswordFirebase = async (email) => {
    setLoading(true)
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (err) {
      throw err;
    }finally{
      setLoading(false)
    }
  };

const changePasswordFirebase = async (currentPassword, newPassword) => {
  setLoading(true);
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("User not found");
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    // Re-authenticate
    await reauthenticateWithCredential(user, credential);

    // Now update password
    await updatePassword(user, newPassword);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};


  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, loginFirebase , verifyEmailFirebase, logoutFirebase, loading,changePasswordFirebase, forgetPasswordFirebase };

  return (
    <AuthContext.Provider value={value}>
      { children}
      </AuthContext.Provider>
  );
}
