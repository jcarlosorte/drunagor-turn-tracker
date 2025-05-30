// src/AppWrapper.jsx
import React, { useEffect, useState } from 'react';
import App from './App';

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una pequeña espera para permitir la carga de estilos y fuentes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // puedes ajustar el tiempo si quieres

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-xl font-bold">
        Cargando...
      </div>
    );
  }

  return <App />;
};

export default AppWrapper;
