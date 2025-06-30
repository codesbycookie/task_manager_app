import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{ padding: '2rem' }}
    >
      <div
        className="container text-center p-4"
        style={{
          maxWidth: "500px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          border: "2px solid #8dc540",
        }}
      >
        <h1
          className="mb-3"
          style={{
            fontSize: "4rem",
            fontWeight: "700",
            color: "#8dc540",
            letterSpacing: "2px",
          }}
        >
          404
        </h1>
        <p
          className="mb-4"
          style={{
            fontSize: "1.2rem",
            color: "#555",
            fontWeight: "500",
          }}
        >
          Oops! The page you’re looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn btn-primary"
          style={{
            backgroundColor: "#8dc540",
            border: "none",
            fontWeight: "700",
            fontSize: "1.05rem",
            borderRadius: "10px",
            padding: "0.75rem 1.5rem",
            boxShadow: "0 5px 10px #8dc540aa",
            transition: "all 0.3s ease",
            color: "white",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#fac116";
            e.target.style.color = "#333";
            e.target.style.boxShadow = "0 7px 14px #fac116cc";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#8dc540";
            e.target.style.color = "white";
            e.target.style.boxShadow = "0 5px 10px #8dc540aa";
          }}
        >
          Go back to Login
        </Link>
      </div>
    </div>
  );
}
