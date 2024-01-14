import React from 'react'

const Contexts={
    //el valor inicial del contexto se define aqui pero puede ser modificado al declarar un provider
    userContext: React.createContext([]),
    promoContext: React.createContext([]),
    listContext: React.createContext('LISTA CONTEXTO')
}

export default Contexts