import {
  Home,
  DevatePage,
  DashBoardPage,
  EvaluationPage,
  DevateHistoryPage,
  Register,
  RegisterForm,
  Login,
  SelectAvatar,
  WelcomePage,
  RequireLogin,
} from "./pages";
//test用
import CallConnect from "./api/realTimeConnect";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Test2 from "./test/Test2";
import DeveloperPage from "./pages/developerPage";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthLayout, MainLayout } from "./components";
export const developPathList = [
  { path: "/test", element: <CallConnect />, name: "テストページ" },
  { path: "/test2", element: <Test2 />, name: "テストページ2" },
  { path: "/develop", element: <DeveloperPage />, name: "developerページ" },
];
export const authPathList = [
  {
    path: "/register",
    element: <Register />,
    name: "アカウント登録(メール確認フェイズ)",
  },
  {
    path: "/register/form",
    element: <RegisterForm />,
    name: "アカウント詳細登録",
  },
  {
    path: "/register/selectavatar",
    element: <SelectAvatar />,
    name: "アバター選択画面",
  },
  { path: "/register/welcome", element: <WelcomePage />, name: "ウェルカム" },
  { path: "/login", element: <Login />, name: "ログイン" },
  { path: "/login/require", element: <RequireLogin />, name: "ログイン要求" },
];
export const routeList = [
  //{path:"example",element:<Example/>,name:"論理名"}
  { path: "/home", element: <Home />, name: "ホームページ" },

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
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ))}
        </Route>
        <Route>
          {" "}
          {developPathList.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        <Route element={<AuthLayout />}>
          {" "}
          {authPathList.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PublicRoute>{element}</PublicRoute>}
            />
          ))}
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
