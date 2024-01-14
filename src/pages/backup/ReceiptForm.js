import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";
import { processBarCode } from "../utils/processBarCode";

const ReceiptForm = () => {
  const initialProductState = {
    codigo_de_barra: "",
    num_media: "",
    precio: 0,
    kg: "",
    tropa: "",
  };

  const initialProductStateOnProcess = {
    codigo_de_barra: "",
    num_media: "",
    precio: 0,
    kg: "",
    tropa: "",
  };

  const [product, setProduct] = useState(initialProductState);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [receipt, setReceipt] = useState({
    cantidad_total: "",
    peso_total: "",
    branch_id: "",
    movement_id: "",
  });

  const [isCodeProcessing, setIsCodeProcessing] = useState(false);
  const [isCancelButtonDisabled, setIsCancelButtonDisabled] = useState(true);

  const navigate = useNavigate();

  const checkProductExistence = async (codigoDeBarra) => {
    try {
      const response = await fetch(
        `http://localhost:4000/productos/${codigoDeBarra}/barra`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return !!data; // Devuelve true si el producto existe, false si no existe
    } catch (error) {
      console.error("Error al verificar la existencia del producto", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const peso_total = products.reduce(
      (acum, product) => acum + Number(product.kg),
      0
    );
    const cantidad_total = products.length;

    const confirmSubmit = window.confirm(
      "¿Estás seguro de que deseas grabar este ingreso?"
    );
    if (!confirmSubmit) {
      return;
    }

    await fetch(`http://localhost:4000/ingresos`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ products, cantidad_total, peso_total }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/receipts");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "kg" ? Number(value) : value,
    });
  };

  // const handleEdit = (product, index) => {
  //   setProduct(product);
  //   setEditingIndex(index);
  // };

  const handleSave = async () => {
    if (
      !product.codigo_de_barra ||
      !product.num_media ||
      !product.kg ||
      !product.tropa
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const productExists = await checkProductExistence(product.codigo_de_barra);

    if (productExists) {
      alert("¡Alerta! El producto ya existe en la base de datos.");
      return;
    }

    const barcodeExists = products.some(
      (prod, index) =>
        index !== editingIndex &&
        prod.codigo_de_barra === product.codigo_de_barra
    );
    if (barcodeExists) {
      alert("El código de barras ya existe en la lista");
      return;
    }

    const barcodePattern = /^\d+$/;
    if (!barcodePattern.test(product.codigo_de_barra)) {
      alert("El código de barras debe contener solo números");
      return;
    }

    if (editingIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editingIndex] = product;
      setProducts(updatedProducts);
      setEditingIndex(null);
      setIsCancelButtonDisabled(true)
    } else {
      setProducts([...products, product]);
      setIsCancelButtonDisabled(true)
    }

    setProduct(initialProductState);

  };

  const handleDelete = (barcode) => {
    const confirmDelete = window.confirm(
      "¿Seguro que desea eliminar este elemento?"
    );

    if (confirmDelete) {
      const updatedProducts = products.filter(
        (prod) => prod.codigo_de_barra !== barcode
      );

      setProducts(updatedProducts);
    }
  };

  const processCodeBarHandler = (codigoDeBarra) => {
    setIsCodeProcessing(true);

    const processedData = processBarCode(codigoDeBarra);

    if (processedData.success) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        num_media: processedData.data.num_media,
        tropa: processedData.data.tropa,
        kg: processedData.data.kg,
        precio: 0,
      }));
      setIsCancelButtonDisabled(false);
    } else {
      alert(`Error al procesar el código de barras: ${processedData.message}`);
    }
    setIsCodeProcessing(false);
  };

  const handleCancel = () => {
    setProduct(initialProductStateOnProcess);
    setIsCancelButtonDisabled(true);
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-form-title text-center">
        {editing ? "Editar Ingreso" : "Agregar Ingreso"}
      </h1>
      <Form onSubmit={(e) => e.preventDefault()} className="w-50">
        <Form.Group className="mb-3">
          <Form.Label>Codigo de barra</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              name="codigo_de_barra"
              value={product.codigo_de_barra}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setProduct({
                    ...product,
                    codigo_de_barra: inputValue,
                    num_media: "",
                    precio: 0,
                    kg: "",
                    tropa: "",
                  });
                } else {
                  alert("El código de barras debe contener solo números");
                }
              }}
              placeholder="Ingresa el codigo de barra"
              className="my-input me-1"
            />
            <span className="ms-1">
              <Button
                variant="success"
                onClick={() => processCodeBarHandler(product.codigo_de_barra)}
                className="ml-1"
                disabled={isCodeProcessing || product.codigo_de_barra.length !== 30}
              >
                Procesar
              </Button>
            </span>
            <span className="ms-1">
              <Button variant="danger" onClick={handleCancel} className="ml-1" disabled={isCancelButtonDisabled}>
                Cancelar
              </Button>
            </span>
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Numero de media</Form.Label>
          <Form.Control
            type="number"
            name="num_media"
            value={product.num_media}
            onChange={handleChange}
            placeholder="Ingresa el numero de la media"
            className="my-input"
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Numero de Tropa</Form.Label>
          <Form.Control
            type="number"
            name="tropa"
            value={product.tropa}
            onChange={handleChange}
            placeholder="Ingresa el numero de la tropa"
            className="my-input"
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Peso de la media</Form.Label>
          <Form.Control
            type="number"
            name="kg"
            value={product.kg}
            onChange={handleChange}
            placeholder="Ingresa el peso de la media"
            className="my-input"
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio de la media</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={product.precio}
            onChange={handleChange}
            placeholder="Ingresa el precio de la media"
            className="my-input"
            // disabled
          />
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          onClick={handleSave}
          disabled={loading}
          style={{ position: "relative" }}
        >
          {editing ? (
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
          )}
        </Button>
      </Form>
      <h1 className="my-list-title dark-text">Productos a agregar</h1>
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
        <Button
          color="inherit"
          onClick={handleSubmit}
          disabled={products.length === 0}
        >
          Grabar
        </Button>
      </div>
    </Container>
  );
};

export default ReceiptForm;
