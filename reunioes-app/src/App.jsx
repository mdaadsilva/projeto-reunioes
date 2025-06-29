import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, CircularProgress, Box, Alert, Typography, Grid, Paper, TextField, Pagination, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SalasList from './components/SalasList';
import SalaForm from './components/SalaForm';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

function App() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSalas = () => {
    setLoading(true);
    axios.get('https://localhost:7279/api/salas', {
      params: {
        nome: searchTerm,
        pagina: page,
        tamanhoPagina: 10
      }
    })
      .then(response => {
        setSalas(response.data.itens);
        setTotalPages(Math.ceil(response.data.totalItens / 10));
        setLoading(false);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar as salas!", error);
        setError('Não foi possível carregar as salas.');
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSalas();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  const handleSalaCriada = () => {
    if(page !== 1) setPage(1);
    else fetchSalas();
  };
  
  const handleSalaExcluida = (id) => {
    setSalas(salas.filter(sala => sala.id !== id));
  };
  
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="App" maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4, textAlign: 'center' }}>
          Sistema de Reuniões
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <SalaForm onSalaCriada={handleSalaCriada} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <TextField
                label="Buscar Sala por Nome"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {loading 
                ? <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}><CircularProgress /></Box>
                : <SalasList salas={salas} onSalaExcluida={handleSalaExcluida} onError={handleError} />
              }
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(event, value) => setPage(value)}
                  color="primary" 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
      </Container>
    </ThemeProvider>
  );
}

export default App;