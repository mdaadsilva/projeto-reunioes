import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Alert, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function SalaForm({ onSalaCriada, onCancel }) {
  const [nome, setNome] = useState('');
  const [andar, setAndar] = useState('');
  const [quantidadeAssentos, setQuantidadeAssentos] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const novaSala = {
      nome,
      andar: parseInt(andar, 10),
      quantidadeAssentos: parseInt(quantidadeAssentos, 10),
    };

    axios.post('https://localhost:7279/api/salas', novaSala)
      .then(() => {
        onSalaCriada();
      })
      .catch(err => {
        setError(err.response?.data?.title || 'Não foi possível criar a sala.');
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>Nova Sala</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: 400, pt: '10px !important' }}>
        <TextField
          label="Nome da Sala"
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
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
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 24px' }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained">Salvar</Button>
      </DialogActions>
    </Box>
  );
}

export default SalaForm;