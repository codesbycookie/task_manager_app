import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase/Firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

const AuthContext = createContext();

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
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, loginFirebase , verifyEmailFirebase, logoutFirebase, loading, forgetPasswordFirebase };

  return (
    <AuthContext.Provider value={value}>
      { children}
      </AuthContext.Provider>
  );
}
