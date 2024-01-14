import { Routes, Route } from "react-router-dom";
import BranchList from "./pages/BranchList";
import Main from "./pages/Main";
import UserList from "./pages/UserList";
import UserForm from "./pages/UserForm";
import LoginForm from "./pages/LoginForm";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useContext } from "react";
import Contexts from "./context/Contexts";
import PromoList from "./pages/PromoList";
import PromoArticle from "./pages/PromoArticle";
import PromoForm from "./pages/PromoForm";

export default function App() {
  const context = useContext(Contexts.userContext);
  console.log("appcontext", context.user);

  return (
    <>
      <Routes>
        {/* <Route index element={<LoginForm />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route element={<ProtectedRoute isAllowed={!!context.user} />}>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route index element={<Main />} />
                  <Route path="/dashboard" element={<Main />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/users/new" element={<UserForm />} />
                  <Route path="/users/:id/edit" element={<UserForm />} />
                  <Route path="/branches" element={<BranchList />} />
                  <Route path="/promotions" element={<PromoList />} />
                  <Route path="/promotions/new" element={<PromoForm />} />
                  <Route path="/promotions/:promocionId/products" element={<PromoArticle />} />

                </Routes>
              </Layout>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
