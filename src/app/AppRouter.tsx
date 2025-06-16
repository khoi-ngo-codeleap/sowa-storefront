import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import router from "@/configs/router";

const AppRouter = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

export default AppRouter;
