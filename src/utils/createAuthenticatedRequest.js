// createAuthenticatedRequest.js
export const createAuthenticatedRequest = (method, endpoint, body = null) => {
  const token = "tu_token_de_autenticacion"; // Reemplaza con la lógica para obtener el token de autenticación

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const requestOptions = {
    method,
    headers,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  return requestOptions;
};
