import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import the styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import AppRoutes from "./AppRoutes";

import "./App.css";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
