import { Toaster } from "@/components/ui/toaster";
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
