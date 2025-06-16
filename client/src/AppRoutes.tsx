import {
  Home,
  DevatePage,
  DashBoardPage,
  EvaluationPage,
  DevateHistoryPage,
} from "./pages";
import DeveloperPage from "./pages/developerPage";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

export const routeList = [
  //{path:"example",element:<Example/>,name:"論理名"}
  { path: "/", element: <Home />, name: "ホームページ" },
  { path: "/develop", element: <DeveloperPage />, name: "開発者ページ" },
  /**
   * 以下、アプリケーションページ
   */
  {
    path: "/debate/room/:roomId",
    element: <DevatePage />,
    name: "ディベートページ",
  },
  {
    path: "/dashboard/:accountId",
    element: <DashBoardPage />,
    name: "ダッシュボード",
  },
  {
    path: "/dashboard/:accountId/evaluation/:historyId ",
    element: <EvaluationPage />,
    name: "評価ページ",
  },
  {
    path: "/dashboard/:accountId/history/:historyId",
    element: <DevateHistoryPage />,
    name: "ディベート履歴ページ",
  },
];

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routeList.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
