import { RouterProvider } from "@tanstack/react-router";
import router from "@/configs/router";

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
