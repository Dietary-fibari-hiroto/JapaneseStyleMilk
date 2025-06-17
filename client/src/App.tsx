import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Sidebar from "./components/common/Sidebar";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
