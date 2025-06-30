import React from "react";
import { useApi } from "../../context/ApiContext";

export default function Loader({ message = "Loading..." }) {

    const {loaderMessage} = useApi();

    console.log(loaderMessage)

    const loadingMessage =loaderMessage ||  message


  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div
        className="spinner-border"
        role="status"
        style={{
          width: "3rem",
          height: "3rem",
          borderColor: "#8dc540",
          borderRightColor: "transparent"
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 fw-semibold" style={{ color: "#555" }}>
        {loadingMessage}....
      </p>
    </div>
  );
}
