import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';

function SalaForm({ onSalaCriada }) {
  const [nome, setNome] = useState('');
  const [andar, setAndar] = useState('');
  const [quantidadeAssentos, setQuantidadeAssentos] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const novaSala = {
      nome,
      andar: parseInt(andar, 10),
      quantidadeAssentos: parseInt(quantidadeAssentos, 10),
    };

    axios.post('https://localhost:7279/api/salas', novaSala)
      .then(() => {
        setSuccess(`Sala '${nome}' criada com sucesso!`);
        setNome('');
        setAndar('');
        setQuantidadeAssentos('');
        onSalaCriada();
      })
      .catch(error => {
        console.error("Houve um erro ao criar a sala!", error);
        setError("Não foi possível criar a sala. Verifique os dados.");
      });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 400, margin: 'auto' }}
    >
      <Typography variant="h6" component="h3">
        Cadastrar Nova Sala
      </Typography>
      <TextField
        label="Nome da Sala"
        variant="outlined"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <TextField
        label="Andar"
        variant="outlined"
        type="number"
        value={andar}
        onChange={(e) => setAndar(e.target.value)}
        required
      />
      <TextField
        label="Quantidade de Assentos"
        variant="outlined"
        type="number"
        value={quantidadeAssentos}
        onChange={(e) => setQuantidadeAssentos(e.target.value)}
        required
      />
      <Button type="submit" variant="contained">Salvar</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Box>
  );
}

export default SalaForm;