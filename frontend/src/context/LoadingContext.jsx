import { createContext, useContext, useState, useMemo } from "react";

const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  const startLoading = (message = "") => {
    setLoading(true);
    setLoaderMessage(message);
  };

  const stopLoading = () => {
    setLoading(false);
    setLoaderMessage("");
  };

  const value = useMemo(
    () => ({ loading, loaderMessage, startLoading, stopLoading }),
    [loading, loaderMessage]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}