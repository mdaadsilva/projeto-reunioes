import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function SalasDataGrid({ salas, loading, rowCount, paginationModel, setPaginationModel, onEdit, onDeleteClick }) {

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome da Sala', flex: 1, minWidth: 150 },
    { field: 'andar', headerName: 'Andar', width: 100 },
    { field: 'quantidadeAssentos', headerName: 'Assentos', width: 120 },
    {
      field: 'acoes',
      headerName: 'Ações',
      sortable: false,
      width: 120,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton onClick={() => onEdit(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={salas}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default SalasDataGrid;