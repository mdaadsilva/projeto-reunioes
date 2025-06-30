import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

function SalaEditDialog({ open, onClose, sala, onSave }) {
  const [nome, setNome] = useState('');
  const [andar, setAndar] = useState('');
  const [quantidadeAssentos, setQuantidadeAssentos] = useState('');

  useEffect(() => {
    if (sala) {
      setNome(sala.nome || '');
      setAndar(sala.andar || '');
      setQuantidadeAssentos(sala.quantidadeAssentos || '');
    }
  }, [sala]);

  const handleSave = () => {
    const salaAtualizada = {
      ...sala,
      nome,
      andar: parseInt(andar, 10),
      quantidadeAssentos: parseInt(quantidadeAssentos, 10),
    };
    onSave(salaAtualizada);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Sala</DialogTitle>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 24px' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar Alterações</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SalaEditDialog;