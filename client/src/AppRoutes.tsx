import {
  Home,
  DevatePage,
  DashBoardPage,
  EvaluationPage,
  DevateHistoryPage,
} from "./pages";
import Test from "./test/Test";
import Test2 from "./test/Test2";
import DeveloperPage from "./pages/developerPage";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

export const routeList = [
  //{path:"example",element:<Example/>,name:"論理名"}
  { path: "/", element: <Home />, name: "ホームページ" },
  { path: "/test", element: <Test />, name: "テストページ" },
  { path: "/test2", element: <Test2 />, name: "テストページ2" },

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
        <Route element={<MainLayout />}>
          {" "}
          {routeList.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
      <Routes location={location} key={location.pathname}>
        <Route path={"/develop"} element={<DeveloperPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
