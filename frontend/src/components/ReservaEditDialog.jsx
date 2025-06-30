import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

function ReservaEditDialog({ open, onClose, reserva, onSave }) {
  const [inicio, setInicio] = useState(null);
  const [fim, setFim] = useState(null);

  useEffect(() => {
    if (reserva) {
      setInicio(dayjs(reserva.inicio));
      setFim(dayjs(reserva.fim));
    }
  }, [reserva]);

  const handleSave = () => {
    const reservaAtualizada = {
      ...reserva,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      salaId: reserva.sala.id
    };
    onSave(reservaAtualizada);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reagendar Reserva</DialogTitle>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: 400, pt: '10px !important' }}>
            <DateTimePicker label="Novo Início da Reserva" value={inicio} onChange={setInicio} ampm={false} />
            <DateTimePicker label="Novo Fim da Reserva" value={fim} onChange={setFim} ampm={false} />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 24px' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar Alterações</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ReservaEditDialog;