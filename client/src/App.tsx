import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AccountProvider from "./contexts/AccountContext";

function App() {
  return (
    <Router>
      <AccountProvider>
        <AppRoutes />
      </AccountProvider>
    </Router>
  );
}

export default App;
