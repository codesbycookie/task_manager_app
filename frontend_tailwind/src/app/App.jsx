import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Toaster/>
      <AppRoutes />
    </Router>
  );
}

export default App;
