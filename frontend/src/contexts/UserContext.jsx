import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie, setCookie, removeCookie } from "../utils/CookieService";
import { useAuth } from "./AuthContext";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/ApiService";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import Loading from "../pages/components/Loading/Loading";
// import { useNavigateOnce } from "../utils/UseNavigateOnce";
import urls from "../utils/ApiUrls";

const { addProductUrl,fetchAdminUrl, fetchOrdersUrl, fetchProducts, deleteProductUrl } = urls;
const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [admin, setAdmin] = useState(() => getCookie("admin"));
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const { loginFirebase, logoutFirebase } = useAuth();

  const login = async (formData) => {
    setLoading(true);
    try {
      const user = await loginFirebase(formData.email, formData.password);
      if (user) {
        console.log(user.user)
        const apiUser = await getRequest(`${fetchAdminUrl}/${user.user.uid}`);
        console.log(apiUser)
        navigate("/dashboard");
        toast.success("Successfully login!");
        setCookie("admin", user.user);
        setAdmin(apiUser.admin)
      }
    } catch (e) {
      handleFirebaseError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getRequest(fetchOrdersUrl);
      console.log(response);
      setOrders(response.orders);
    } catch (error) {
      toast.error("Error fetching orders.");
      navigate("/dashboard");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // const deletePost = async (data) => {
  //   setLoading(true);
  //   try {
  //     const res = await deleteRequest(deleteEventUrl + data);
  //     fetchUserData(userCredentials.uid);
  //     navigate("/dashboard", res.message, "success");
  //   } catch (e) {
  //     toast.error("Something Went Wrong.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const add_product = async (product, image) => {
    setLoading(true);
    try {
      const formData = createFormData(product, { image: image });

      const response = await postRequest(addProductUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        toast.success("Product added successfully!");
        fetch_products(); // Refresh Products List
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Something went wrong while adding product.");
    } finally {
      setLoading(false);
    }
  };

  const delete_product = async (productId) => {
    setLoading(true);
    try {
      const response = await deleteRequest(`${deleteProductUrl}/${productId}`);
console.log(response)
      toast.success(response.message || "Product deleted successfully!");
      fetch_products();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Something went wrong while deleting product.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutFirebase();
      removeCookie("admin");
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (e) {
      toast.error(e.message || "Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  const fetch_products = async () => {
    setLoading(true);
    try {
      const response = await getRequest(fetchProducts);
      setProducts(response?.products || []);
      console.log(response.products);
    } catch (e) {
      toast.error(e.message || "Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  function createFormData(data, extraFields = {}, excludeKeys = []) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        formData.append(key, value);
      }
    });

    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return formData;
  }

  // ERROR HANDLING FOR FIREBASE ERRORS

  const handleFirebaseError = (e) => {
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

  // ///ERROR HANDLING FOR LOADINGS AND ERRORS

  const value = {
    fetch_products,
    products,
    loading,
    login,
    admin,
    logout,
    fetchOrders,
    orders,
    add_product,
    delete_product,
  };
  return (
    <ApiContext.Provider value={value}>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {children}
    </ApiContext.Provider>
  );
}
