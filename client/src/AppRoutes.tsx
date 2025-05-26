import Home from "./pages/Home";
import DeveloperPage from "./pages/developerPage";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

export const routeList = [
  //{path:"example",element:<Example/>,name:"論理名"}
  { path: "/", element: <Home />, name: "ホームページ" },
  { path: "/develop", element: <DeveloperPage />, name: "開発者ページ" },
];

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routeList.map(({ path, element }, index) => (
          <Route key={index} element={element} />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
