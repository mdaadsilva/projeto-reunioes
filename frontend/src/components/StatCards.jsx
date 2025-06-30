import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PageviewIcon from '@mui/icons-material/Pageview';

function StatCards({ totalSalas, paginaAtual }) {
  const [totalReunioes, setTotalReunioes] = useState(0);

  useEffect(() => {
    axios.get('https://localhost:7279/api/reservas/total-ultimos-7-dias')
      .then(response => {
        setTotalReunioes(response.data);
      })
      .catch(error => console.error("Erro ao buscar total de reuniões", error));
  }, []);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <PageviewIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
                <Typography color="text.secondary">Total de Salas</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{totalSalas}</Typography>
            </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <EventIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
                <Typography color="text.secondary">Reuniões (7 dias)</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{totalReunioes}</Typography>
            </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
                <Typography color="text.secondary">Página Atual</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{paginaAtual}</Typography>
            </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default StatCards;