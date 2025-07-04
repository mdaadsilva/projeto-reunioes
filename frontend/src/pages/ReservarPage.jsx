import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    Grid, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    List,
    ListItem,
    ListItemText,
    Alert,
    CircularProgress,
    IconButton,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import ReservaEditDialog from '../components/ReservaEditDialog';

function ReservarPage() {
    const { id: salaIdFromUrl } = useParams();

    const [salas, setSalas] = useState([]);
    const [selectedSalaId, setSelectedSalaId] = useState(salaIdFromUrl || '');
    const [reservasDaSala, setReservasDaSala] = useState([]);
    const [loadingReservas, setLoadingReservas] = useState(false);
    
    const [inicio, setInicio] = useState(null);
    const [fim, setFim] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [reagendarDialogOpen, setReagendarDialogOpen] = useState(false);
    const [reservaParaReagendar, setReservaParaReagendar] = useState(null);

    useEffect(() => {
        axios.get('https://localhost:7279/api/salas')
            .then(response => {
                setSalas(response.data.itens);
            })
            .catch(err => console.error("Erro ao buscar salas", err));
    }, []);

    const fetchReservasDaSala = (salaId) => {
        if (!salaId) {
            setReservasDaSala([]);
            return;
        }
        setLoadingReservas(true);
        axios.get(`https://localhost:7279/api/reservas?salaId=${salaId}`)
            .then(response => {
                setReservasDaSala(response.data);
                setLoadingReservas(false);
            })
            .catch(err => {
                console.error("Erro ao buscar reservas da sala", err);
                setLoadingReservas(false);
            });
    };
    
    useEffect(() => {
        if (selectedSalaId) {
            fetchReservasDaSala(selectedSalaId);
        }
    }, [selectedSalaId]);

    const handleAgendar = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedSalaId || !inicio || !fim) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const novaReserva = {
            salaId: parseInt(selectedSalaId),
            inicio: inicio.toISOString(),
            fim: fim.toISOString()
        };
        
        axios.post('https://localhost:7279/api/reservas', novaReserva)
            .then(() => {
                setSuccess('Reserva efetuada com sucesso!');
                setInicio(null);
                setFim(null);
                fetchReservasDaSala(selectedSalaId);
            })
            .catch(err => {
                setError(err.response?.data || "Não foi possível realizar a reserva.");
            });
    };

    const handleCancelar = (reservaId) => {
        axios.delete(`https://localhost:7279/api/reservas/${reservaId}`)
            .then(() => {
                setSuccess('Reserva cancelada com sucesso!');
                fetchReservasDaSala(selectedSalaId);
            })
            .catch(err => {
                setError(err.response?.data || "Não foi possível cancelar a reserva.");
            })
    };

    const handleOpenReagendarDialog = (reserva) => {
        setReservaParaReagendar(reserva);
        setReagendarDialogOpen(true);
    };

    const handleCloseReagendarDialog = () => {
        setReagendarDialogOpen(false);
        setReservaParaReagendar(null);
    };

    const handleSaveReagendamento = (reservaAtualizada) => {
        axios.put(`https://localhost:7279/api/reservas/${reservaAtualizada.id}`, reservaAtualizada)
            .then(() => {
                setSuccess('Reserva reagendada com sucesso!');
                handleCloseReagendarDialog();
                fetchReservasDaSala(selectedSalaId);
            })
            .catch(err => {
                setError(err.response?.data || "Não foi possível reagendar a reserva.");
            });
    };

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                        Nova Reserva
                    </Typography>
                    <Box component="form" onSubmit={handleAgendar} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel id="sala-select-label">Sala *</InputLabel>
                            <Select
                                labelId="sala-select-label"
                                value={selectedSalaId}
                                label="Sala *"
                                onChange={(e) => setSelectedSalaId(e.target.value)}
                            >
                                {salas.map(sala => (
                                    <MenuItem key={sala.id} value={sala.id}>{sala.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DateTimePicker label="Data e Hora de Início *" value={inicio} onChange={setInicio} ampm={false} />
                        <DateTimePicker label="Data e Hora de Fim *" value={fim} onChange={setFim} ampm={false} />
                        
                        <Button type="submit" variant="contained" size="large">Reservar Sala</Button>
                        
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                        Próximas Reservas
                    </Typography>
                    {loadingReservas ? <CircularProgress /> : (
                        <List>
                            {reservasDaSala.length > 0 ? reservasDaSala.map((reserva, index) => (
                                <React.Fragment key={reserva.id}>
                                    <ListItem>
                                        <ListItemText 
                                            primary={`De: ${dayjs(reserva.inicio).format('DD/MM/YYYY HH:mm')}`}
                                            secondary={`Até: ${dayjs(reserva.fim).format('DD/MM/YYYY HH:mm')}`}
                                        />
                                        <Box>
                                            {dayjs(reserva.inicio).isAfter(dayjs()) && (
                                                <IconButton aria-label="edit" onClick={() => handleOpenReagendarDialog(reserva)}>
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            <IconButton aria-label="delete" onClick={() => handleCancelar(reserva.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                    {index < reservasDaSala.length - 1 && <Divider />}
                                </React.Fragment>
                            )) : <Typography color="text.secondary">Nenhuma reserva encontrada para esta sala.</Typography>}
                        </List>
                    )}
                </Paper>
            </Grid>

            {reservaParaReagendar && 
                <ReservaEditDialog 
                    open={reagendarDialogOpen}
                    onClose={handleCloseReagendarDialog}
                    onSave={handleSaveReagendamento}
                    reserva={reservaParaReagendar}
                />
            }
        </Grid>
    );
}

export default ReservarPage;