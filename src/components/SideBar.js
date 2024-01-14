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
        </>
      )}
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
