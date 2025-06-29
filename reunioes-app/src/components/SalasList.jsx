import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SalasList() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://localhost:7279/api/salas')
      .then(response => {
        setSalas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar as salas!", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Carregando salas...</p>;
  }

  return (
    <div>
      <h2>Lista de Salas</h2>
      <ul>
        {salas.map(sala => (
          <li key={sala.id}>
            {sala.nome} - Andar: {sala.andar} ({sala.quantidadeAssentos} assentos)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SalasList;