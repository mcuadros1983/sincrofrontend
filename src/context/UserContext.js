import React, { createContext, useState, useContext } from "react";
import Contexts from "./Contexts";
// const UserContext = createContext();

export default function UserContext({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:4000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      console.log("respopnse", response);

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        // Realiza una solicitud adicional para obtener el usuario por nombre
        // const userResponse = await fetch(
        //   `http://localhost:4000/usuarios/nombre/${data.user.usuario}`
        // );
        // const usuario = await userResponse.json();
        // usuario.token = data.token
        // console.log("userfound", user);
        // Setea el usuario en el estado
        console.log("usuario", data.user);
        setUser(data.user);

        // También puedes almacenar el token u otras cosas según tus necesidades
        // localStorage.setItem("token", data.token);
        // console.log("storage", localStorage)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Credenciales inválidas");
      }
    } catch (error) {
      throw error; // Lanza el error para que sea capturado por el código que llama a login
    }
  };

  // const logout = () => {
  //   // Puedes realizar cualquier limpieza necesaria al cerrar sesión
  //   setUser(null);
  //   // localStorage.removeItem("token");
  // };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include", // Incluye las cookies en la solicitud
      });

      if (response.ok) {
        // Limpiar el estado del usuario en el frontend
        setUser(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cerrar sesión");
      }
    } catch (error) {
      throw error; // Lanza el error para que sea capturado por el código que llama a logout
    }
  };

  return (
    <Contexts.userContext.Provider value={{ user, login, logout }}>
      {children}
    </Contexts.userContext.Provider>
  );
}
