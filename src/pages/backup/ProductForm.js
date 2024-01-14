import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function ProductForm() {
  const [product, setProduct] = useState({
    codigo_de_barra: "",
    num_media: "",
    precio: "",
    kg: "",
    tropa: "",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false); //estado para saber si se esta editando o no

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const params = useParams();

  const loadProduct = async (id) => {
    const res = await fetch(`http://localhost:4000/productos/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    setProduct(data);
    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id);
    } else {
      setEditing(false);
      setProduct({
        codigo_de_barra: "",
        num_media: "",
        precio: "",
        kg: "",
        tropa: "",
      });
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //cancela el comportamiento por defecto
    // Aquí puedes manejar la lógica de envío del formulario
    setLoading(true);

    if (editing) {
      //si esta editando
      await fetch(`http://localhost:4000/productos/${params.id}`, {
        credentials:"include",
        method: "PUT",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setEditing(false);
    } else {
      //si no esta editando
      await fetch("http://localhost:4000/productos/", {
        credentials:"include",
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setLoading(false);
    navigate("/products");
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-form-title text-center">
        {editing ? "Editar Producto" : "Agregar Producto"}
      </h1>
      <Form onSubmit={handleSubmit} className="w-50">
        <Form.Group className="mb-3">
          <Form.Label>Codigo de barra</Form.Label>
          <Form.Control
            type="text"
            name="codigo_de_barra"
            value={product.codigo_de_barra}
            onChange={handleChange}
            placeholder="Ingresa el codigo de barra"
            className="my-input"
          />
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
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio de la media</Form.Label>
          <Form.Control
            type="float"
            name="precio"
            value={product.precio}
            onChange={handleChange}
            placeholder="Ingresa el precio de la media"
            className="my-input"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Peso media</Form.Label>
          <Form.Control
            type="number"
            name="kg"
            value={product.kg}
            onChange={handleChange}
            placeholder="Ingresa el peso de la media"
            className="my-input"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Numero de tropa</Form.Label>
          <Form.Control
            type="number"
            name="tropa"
            value={product.tropa}
            onChange={handleChange}
            placeholder="Ingresa la tropa de la media"
            className="my-input"
          />
        </Form.Group>
        {/* <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            // value={formData.message}
            //onChange={handleChange}
            placeholder="Escribe tu mensaje aquí"
            className="my-textarea"
          />
        </Form.Group> */}
        <Button
          variant="primary"
          type="submit"
          disabled={loading} // Desactiva el botón mientras se carga
          style={{ position: "relative" }} // Añade una posición relativa al botón
        >
          {
            editing ? (
              "Editar"
            ) : loading ? (
              <Spinner
                animation="border"
                size="sm" // Ajusta el tamaño del Spinner a "sm" (pequeño)
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Guardar"
            )
            //"Enviar" // Si está editando muestra "Editar", si no "Enviar"
          }
        </Button>
      </Form>
    </Container>
  );
}
