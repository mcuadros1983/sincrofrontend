// import ProductList from "./pages/ProductList";
// import ProductForm from "./pages/ProductForm";
// import BranchForm from "./pages/BranchForm";
// import StockList from "./pages/StockList";
// import OrderForm from "./pages/OrderForm";
// import OrderList from "./pages/OrderList";
// import OrderItem from "./pages/OrderItem";
// import ReceiptForm from "./pages/ReceiptForm";
// import ReceiptList from "./pages/ReceiptList";
// import ReceiptItem from "./pages/ReceiptItem";
// import ReceiptProducts from "./pages/ReceiptProducts";
// import StockProductsList from "./pages/StockProductsList";
// import StockCentralList from "./pages/StockCentralList";
// import CustomerList from "./pages/CustomerList";
// import CustomerForm from "./pages/CustomerForm";
// import SellList from "./pages/SellList";
// import SellForm from "./pages/SellForm";
// import SellItem from "./pages/SellItem";
// import WayPayList from "./pages/WayPayList";
// import WayPayForm from "./pages/WayPayForm";
// import AccountList from "./pages/AccountList";
// import AccountForm from "./pages/AccountForm";
// import AccountItem from "./pages/AccountItem";
// import DebtList from "./pages/DebtList";
// import DebtForm from "./pages/DebtForm";
import { Routes, Route } from "react-router-dom";
import BranchList from "./pages/BranchList";
// import NotFoundPages from "./pages/NotFoundPages";
import Navigation from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Container, Row, Col } from "react-bootstrap";
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
