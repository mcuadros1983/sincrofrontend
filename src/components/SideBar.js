import { useContext, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";
import Contexts from "../context/Contexts";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";

const SideBar = () => {
  const [useritem, setUseritem] = useState(false);
  const [sucitem, setSucitem] = useState(false);
  const [promitem, setPromitem] = useState(false);
  // const [proditem, setProditem] = useState(false);
  // const [custitem, setCustitem] = useState(false);
  // const [waypitem, setWaypayitem] = useState(false);
  // const [sellitem, setSellitem] = useState(false);
  // const [debtitem, setDebtitem] = useState(false);
  // const [ctacteitem, setCtacteitem] = useState(false);
  // const [stockitem, setStockitem] = useState(false);
  // const [movitem, setMovitem] = useState(false);
  // const [orditem, setOrditem] = useState(false);
  // const [receiptitem, setReceiptitem] = useState(false);

  const context = useContext(Contexts.userContext);
  const navigate = useNavigate();

  return (
    <Nav defaultActiveKey="/" className="flex-column">
      <Nav.Item>
        <Link
          to="/"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Inicio
        </Link>
      </Nav.Item>

      {/* Mostrar todos los enlaces solo si el usuario tiene el rol de 'admin' */}
      {context.user && context.user.usuario === "admin" && (
        <>
          <Nav.Item onClick={() => setUseritem(!useritem)} className="nav-item">
            <Link
              to="#"
              className="nav-link"
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              Usuarios
            </Link>
          </Nav.Item>
          <Collapse in={useritem} >
            <div className="ml-3" >
              <Link
                to="/users/new"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Crear Usuario
              </Link>
              <Link
                to="/users"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Listar Usuarios
              </Link>
            </div>
          </Collapse>

          
          <Nav.Item onClick={() => setSucitem(!sucitem)}>
            <Link
              to="#"
              className="nav-link"
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              Sucursales
            </Link>
          </Nav.Item>
          <Collapse in={sucitem}>
            <div className="ml-3">
              {/* <Link
                to="/branches/new"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Crear Sucursal
              </Link> */}
              <Link
                to="/branches"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Listar Sucursales
              </Link>
            </div>
          </Collapse>

          <Nav.Item onClick={() => setPromitem(!promitem)}>
            <Link
              to="#"
              className="nav-link"
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              Promociones
            </Link>
          </Nav.Item>
          <Collapse in={promitem}>
            <div className="ml-3">
              <Link
                to="/promotions/new"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Copiar Promociones
              </Link>
              <Link
                to="/promotions"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Listar Promociones
              </Link>
            </div>
          </Collapse>
          
          

          {/* <Nav.Item onClick={() => setProditem(!proditem)}>
            <Link
              to="#"
              className="nav-link"
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              Productos
            </Link>
          </Nav.Item>
          <Collapse in={proditem}>
            <div className="ml-3">
              <Link
                to="/products/new"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Crear Productos
              </Link>
              <Link
                to="/products"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Listar Productos
              </Link>
            </div>
          </Collapse>
           */}
{/* 
          <Nav.Item onClick={() => setCustitem(!custitem)}>
            <Link
              to="#"
              className="nav-link"
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              Clientes
            </Link>
          </Nav.Item>
          <Collapse in={custitem}>
            <div className="ml-3">
              <Link
                to="/customers/new"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Crear Cliente
              </Link>
              <Link
                to="/customers"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Listar Clientes
              </Link>
            </div>
          </Collapse> */}
{/* 
          <Nav.Item onClick={() => setWaypayitem(!waypitem)}>
            <Link
              to="#"
              className="nav-link"
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              Formas de Pago
            </Link>
          </Nav.Item>
          <Collapse in={waypitem}>
            <div className="ml-3">
              <Link
                to="/waypays/new"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Crear Forma Pago
              </Link>
              <Link
                to="/waypays"
                className="nav-link"
                style={{ color: "white", whiteSpace: "nowrap" }}
              >
                Listar Formas Pago
              </Link>
            </div>
          </Collapse> */}
        </>
      )}

      {/* <Nav.Item onClick={() => setSellitem(!sellitem)}>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Ventas
        </Link>
      </Nav.Item>
      <Collapse in={sellitem}>
        <div className="ml-3">
          <Link
            to="/sells/new"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Crear Venta
          </Link>
          <Link
            to="/sells"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Listar Ventas
          </Link>
        </div>
      </Collapse>

      <Nav.Item onClick={() => setDebtitem(!debtitem)}>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Cobranzas
        </Link>
      </Nav.Item>
      <Collapse in={debtitem}>
        <div className="ml-3">

          <Link
            to="/debts"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Listar Cobranzas
          </Link>
        </div>
      </Collapse>

      <Nav.Item onClick={() => setCtacteitem(!ctacteitem)}>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Cuentas Corrientes
        </Link>
      </Nav.Item>
      <Collapse in={ctacteitem}>
        <div className="ml-3">
          <Link
            to="/accounts/new"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Registros
          </Link>
          <Link
            to="/accounts"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Saldos
          </Link>
        </div>
      </Collapse>


      <Nav.Item onClick={() => setStockitem(!stockitem)}>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Stock
        </Link>
      </Nav.Item>
      <Collapse in={stockitem}>
        <div className="ml-3">
          <Link
            to="/stock"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Stock Sucurales
          </Link>
          <Link
            to="/stock/central"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Stock Central
          </Link>

        </div>
      </Collapse>

      <Nav.Item onClick={() => setOrditem(!orditem)}>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Ordenes
        </Link>
      </Nav.Item>
      <Collapse in={orditem}>
        <div className="ml-3">
          <Link
            to="/orders/new"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Crear Orden
          </Link>
          <Link
            to="/orders"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Listar Ordenes
          </Link>
        </div>
      </Collapse>
      <Nav.Item onClick={() => setReceiptitem(!receiptitem)}>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
        >
          Ingresos
        </Link>
      </Nav.Item>
      <Collapse in={receiptitem}>
        <div className="ml-3">
          <Link
            to="/receipts/new"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Crear Ingreso
          </Link>
          <Link
            to="/receipts"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Listar Ingresos
          </Link>
          <Link
            to="/receipts/products"
            className="nav-link"
            style={{ color: "white", whiteSpace: "nowrap" }}
          >
            Productos
          </Link>
        </div>
      </Collapse> */}

      <Nav.Item>
        <Link
          to="#"
          className="nav-link"
          style={{ color: "white", whiteSpace: "nowrap" }}
          onClick={() => {
            context.logout();
            
            navigate("/login");
          }}
        >
          Cerrar Sesión
        </Link>
      </Nav.Item>
      
    </Nav>
  );
};

export default SideBar;
