import { Toaster } from "sonner";
import AppProvider from "./AppProvider";
import AppRouter from "./AppRouter";

function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster />
    </AppProvider>
  );
}

export default App;
