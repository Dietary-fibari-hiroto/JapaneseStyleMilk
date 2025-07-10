import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AccountProvider from "./contexts/AccountContext";
import { OpponentProvider } from "./contexts/OpponentContext";

function App() {
  return (
    <Router>
      <AccountProvider>
        <OpponentProvider>
          <AppRoutes />
        </OpponentProvider>
      </AccountProvider>
    </Router>
  );
}

export default App;
