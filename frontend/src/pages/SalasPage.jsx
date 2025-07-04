import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Button, Dialog, TextField, InputAdornment, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import SalasDataGrid from '../components/SalasDataGrid';
import StatCards from '../components/StatCards';
import SalaForm from '../components/SalaForm';
import SalaEditDialog from '../components/SalaEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';

function SalasPage() {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [rowCount, setRowCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [salaParaEditar, setSalaParaEditar] = useState(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [salaParaDeletar, setSalaParaDeletar] = useState(null);
    
    const [error, setError] = useState('');

    const fetchSalas = () => {
        setLoading(true);
        axios.get('https://localhost:7279/api/salas', {
            params: {
                nome: searchTerm,
                pagina: paginationModel.page + 1,
                tamanhoPagina: paginationModel.pageSize
            }
        })
        .then(response => {
            setSalas(response.data.itens);
            setRowCount(response.data.totalItens);
            setLoading(false);
        })
        .catch(error => {
            console.error("Houve um erro ao buscar as salas!", error);
            setError("Não foi possível carregar as salas.");
            setLoading(false);
        });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSalas();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [paginationModel, searchTerm]);

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
        fetchSalas();
    };

    const handleOpenConfirmDelete = (id) => {
        setSalaParaDeletar(id);
        setConfirmDeleteOpen(true);
    };

    const handleCloseConfirmDelete = () => {
        setSalaParaDeletar(null);
        setConfirmDeleteOpen(false);
    };

    const handleConfirmDelete = () => {
        axios.delete(`https://localhost:7279/api/salas/${salaParaDeletar}`)
            .then(() => {
                handleCloseConfirmDelete();
                fetchSalas();
            })
            .catch(err => {
                console.error("Erro ao excluir sala", err);
                setError("Não foi possível excluir a sala.");
                handleCloseConfirmDelete();
            });
    };

    const handleOpenEditDialog = (sala) => {
        setSalaParaEditar(sala);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSalaParaEditar(null);
    };

    const handleSaveEdit = (salaAtualizada) => {
        axios.put(`https://localhost:7279/api/salas/${salaAtualizada.id}`, salaAtualizada)
            .then(() => {
                handleCloseEditDialog();
                fetchSalas();
            })
            .catch(err => {
                console.error("Erro ao atualizar sala", err);
                setError("Não foi possível atualizar a sala.");
            });
    };

    return (
        <Box>
            <StatCards totalSalas={rowCount} paginaAtual={`${paginationModel.page + 1} de ${Math.ceil(rowCount / paginationModel.pageSize)}`} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    placeholder="Buscar por nome da sala..."
                    variant="outlined"
                    size="small"
                    sx={{ width: '400px', bgcolor: 'background.paper' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialogOpen(true)}
                >
                    Nova Sala
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Paper sx={{ height: 600, width: '100%' }}>
                <SalasDataGrid 
                    salas={salas}
                    loading={loading}
                    rowCount={rowCount}
                    paginationModel={paginationModel}
                    setPaginationModel={setPaginationModel}
                    onEdit={handleOpenEditDialog}
                    onDeleteClick={handleOpenConfirmDelete}
                />
            </Paper>

            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
                <SalaForm onSalaCriada={handleCreateSuccess} onCancel={() => setCreateDialogOpen(false)} />
            </Dialog>

            {salaParaEditar && 
                <SalaEditDialog 
                    open={editDialogOpen} 
                    onClose={handleCloseEditDialog} 
                    onSave={handleSaveEdit}
                    sala={salaParaEditar} 
                />
            }

            <ConfirmDialog 
                open={confirmDeleteOpen}
                onClose={handleCloseConfirmDelete}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita."
            />
        </Box>
    );
}

export default SalasPage;