import React from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Typography, Box, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function SalasList({ salas, onSalaExcluida, onError }) {

  const handleDelete = (id) => {
    axios.delete(`https://localhost:7279/api/salas/${id}`)
      .then(() => {
        onSalaExcluida(id);
      })
      .catch(error => {
        console.error("Houve um erro ao excluir a sala!", error);
        onError('Não foi possível excluir a sala.');
      });
  };

  if (salas.length === 0) {
      return <Typography>Nenhuma sala encontrada.</Typography>
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Salas Cadastradas
      </Typography>
      <List>
        {salas.map(sala => (
          <ListItem
            key={sala.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(sala.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={sala.nome}
              secondary={`Andar: ${sala.andar} | Assentos: ${sala.quantidadeAssentos}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default SalasList;