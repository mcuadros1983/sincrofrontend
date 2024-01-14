import React, { createContext, useState, useContext } from "react";
import Contexts from "./Contexts";
// const UserContext = createContext();

export default function UserContext({ children }) {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000'

  const login = async (credentials) => {
    try {
      const response = await fetch(`${apiUrl}/login/`, {
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
        console.log("usuario", data.user);
        setUser(data.user);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Credenciales inválidas");
      }
    } catch (error) {
      throw error; // Lanza el error para que sea capturado por el código que llama a login
    }
  };
  
  const logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout/`, {
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
