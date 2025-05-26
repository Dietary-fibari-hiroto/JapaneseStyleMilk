import Home from "./pages/Home";
import DeveloperPage from "./pages/developerPage";

export const routeList = [
  //{path:"example",element:<Example/>,name:"論理名"}
  { path: "/", element: <Home />, name: "ホームページ" },
  { path: "/develop", eelement: <DeveloperPage />, name: "開発者ページ" },
];

const AppRoutes = () => {
  return (
    <div>
      <DeveloperPage />
    </div>
  );
};

export default AppRoutes;
