import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Main from "./container/client/main";
import ClientLayout from "./container/client/layout";
import AdminLayout from "./container/admin/layout";
import AdminLogin from "./container/admin/login";
import AdminMain from "./container/admin/main";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ClientLayout />}>
              <Route path="/" element={<Main />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/admin/users" element={<AdminMain />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
