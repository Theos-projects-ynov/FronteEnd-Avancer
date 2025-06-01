import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import ProfilPage from "../component/page/ProfilPage";
import Home from "../component/page/Home";
import NotFound from "../component/page/NotFound";
import PokemonPage from "../component/page/PokemonPage";
import DungeonPage from "../component/page/Dungeon";
import Login from "../component/page/Login";
import Register from "../component/page/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/pokemon/:id",
        element: <PokemonPage />,
      },
      {
        path: "/profil",
        element: <ProfilPage />,
      },
      {
        path: "/dungeon",
        element: <DungeonPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // Routes d'authentification sans layout principal
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
