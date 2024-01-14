import React, { useEffect, useState, useRef } from "react";
import { Container, Form, Button, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/styles.css";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function OrderForm() {
  const codigoDeBarraRef = useRef(null);

  const initialProductState = {
    codigo_de_barra: "",
    num_media: "",
    precio: "",
    kg: "",
    tropa: "",
  };

  const [product, setProduct] = useState(initialProductState);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(""); // Inicializa con un valor adecuado según tus necesidades

  const [order, setOrder] = useState({
    cantidad_total: "",
    peso_total: "",
    branch_id: "",
  });
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const navigate = useNavigate();

  // Llamada a las sucursales al montar la página
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:4000/sucursales", {
          credentials: "include",
        });
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    console.log("handlesubmit", products)
    e.preventDefault(); //cancela el comportamiento por defecto
    // Verificar si se ha seleccionado una sucursal
    if (!selectedBranchId) {
      alert("Por favor, seleccione una sucursal antes de grabar.");
      return;
    }

    if (selectedBranchId == 1) {
      alert("No se pueden hacer envios a la central, cambie la sucursal .");
      return;
    }

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas grabar esta orden?"
    );
    if (!confirmDelete) {
      return;
    }

    // console.log(products);
    const cantidad_total = products.length;
    const peso_total = products.reduce(
      (acum, product) => acum + Number(product.kg),
      0
    );

    console.log("prevfetch", "productos", products, "cantidad_total", cantidad_total, "Peso", peso_total, "id_sucursal", selectedBranchId)

    await fetch(`http://localhost:4000/ordenes`, { 
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        products,
        cantidad_total,
        peso_total,
        selectedBranchId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    //setLoading(false);
    navigate("/orders");
    // setLoading(true);
    // ...
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "kg" ? Number(value) : value,
    });

    // console.log(product);

    // Enfocar el campo de entrada del código de barras al seleccionar una sucursal
    if (name === "sucursal_destino" && codigoDeBarraRef.current) {
      setSelectedBranchId(value);
      codigoDeBarraRef.current.focus();
    }
  };

  const handleSave = async () => {
    // Buscar el producto en la base de datos por código de barras
    console.log("handle", product.codigo_de_barra);
    const productResponse = await fetch(
      `http://localhost:4000/productos/${product.codigo_de_barra}/barra`,
      {
        credentials: "include",
      } // Cambiar por la URL correcta
    );
    const productData = await productResponse.json();
    console.log("detalle", productData, selectedBranchId);

    // Verificar si el producto existe en la base de datos
    if (!productData) {
      alert("El producto no existe en la base de datos");
      // setProduct(initialProductState);
      return;
    }

    // Validar los datos del formulario antes de guardar
    const formFields = ["codigo_de_barra"];
    if (formFields.some((field) => !product[field])) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Verificar si el producto existe en la base de datos
    if (productData.sucursal_id !== 1) {
      alert("El producto ya no se encuentra en stock");
      // setProduct(initialProductState);
      return;
    }

    const existingProductIndex = products.findIndex(
      (prod) => prod.codigo_de_barra === productData.codigo_de_barra
    );

    // Verificar si el código de barras ya existe en la lista
    if (existingProductIndex !== -1) {
      alert("El código de barras ya existe en la lista");
      return;
    }

    // Verificar si el código de barras solo contiene números
    const barcodePattern = /^\d+$/;
    if (!barcodePattern.test(product.codigo_de_barra)) {
      alert("El código de barras debe contener solo números");
      return;
    }

    // Actualizar el estado de products con el nuevo producto o la edición del producto existente
    // if (editingIndex !== null) {
    //   // Editar el producto existente
    //   const updatedProducts = [...products];
    //   updatedProducts[editingIndex] = product;
    //   setProducts(updatedProducts);
    //   setEditingIndex(null);
    // } else {
    //   // Agregar un nuevo producto
    //   setProducts([...products, product]);
    // }

    // Limpiar el formulario
      // console.log(productData, selectedBranchId);
    setProducts([...products, productData]);
    setProduct(initialProductState);
  };

  const handleDelete = (barcode) => {
    // Mostrar una alerta de confirmación
    const confirmDelete = window.confirm(
      "¿Seguro que desea eliminar este producto?"
    );

    // Si el usuario confirma la eliminación, proceder con la eliminación
    if (confirmDelete) {
      // Filtrar los productos para obtener una nueva lista sin el producto a eliminar
      const updatedProducts = products.filter(
        (prod) => prod.codigo_de_barra !== barcode
      );

      // Actualizar el estado de products con la nueva lista de productos
      setProducts(updatedProducts);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-form-title text-center">
        {/* {editing ? "Editar Orden" : "Agregar Orden"} */}
        Agregar Orden
      </h1>
      <Form onSubmit={(e) => e.preventDefault()} className="w-50">
        <Form.Group
          controlId="formSucursalDestino"
          className="mb-3 text-center"
        >
          {/* <Form.Label className="px-2">
            Seleccione la sucursal de destino
          </Form.Label> */}
          <Form.Select
            name="sucursal_destino"
            value={selectedBranchId} // Usa el estado seleccionado
            onChange={handleChange}
            className="my-input custom-style-select"
            size="lg"
          >
            <option value="">Seleccione una sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Codigo de barra</Form.Label>
          <Form.Control
            type="text"
            name="codigo_de_barra"
            value={product.codigo_de_barra}
            onChange={handleChange}
            placeholder="Ingresa el codigo de barra"
            className="my-input"
            ref={codigoDeBarraRef}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="button" // Cambiado de "submit" a "button"
          onClick={handleSave}
          disabled={loading}
          style={{ position: "relative" }}
        >
          Guardar
          {/* {editing ? (
            "Editar"
          ) : loading ? (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Guardar"
          )} */}
        </Button>
      </Form>
      <h1 className="my-list-title dark-text">Productos a agregar</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Codigo de Barra</th>
            <th>Numero de Media</th>
            <th>Precio</th>
            <th>Peso</th>
            <th>Numero de Tropa</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.codigo_de_barra}>
              <td>{product.codigo_de_barra}</td>
              <td>{product.num_media}</td>
              <td>{product.precio}</td>
              <td>{product.kg}</td>
              <td>{product.tropa}</td>
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.codigo_de_barra)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                {/* <Button
                  color="inherit"
                  onClick={() => handleEdit(product, index)}
                >
                  Editar
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="py-2">
        <Button color="inherit" onClick={handleSubmit}>
          Grabar
        </Button>
      </div>
    </Container>
  );
}
