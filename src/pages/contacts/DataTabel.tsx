import React, { useMemo } from 'react';
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";


export const DataTabel = ({ rows }) => {
    const theme = useTheme();

    const columns: GridColDef[] = useMemo(() => [
        { field: "id", headerName: "ID", width: 70 },
        { field: "registerId", headerName: "Register ID", width: 120 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "age", headerName: "Age", width: 80, type: "number" },
        { field: "phone", headerName: "Phone", width: 150 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "address", headerName: "Address", flex: 1 },
        { field: "city", headerName: "City", width: 120 },
        { field: "zipCode", headerName: "Zip Code", width: 100 },
    ], []);

    return (
        <Box
            height="75vh"
            width="100%"
            sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: `1px solid ${theme.palette.divider}` },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.mode === 'dark' ? "#3e4396" : "#f0f0f0",
                    color: theme.palette.mode === 'dark' ? "#fff" : "#000",
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": { backgroundColor: theme.palette.background.paper },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: theme.palette.mode === 'dark' ? "#3e4396" : "#f0f0f0",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${theme.palette.text.primary} !important` },
                "& .MuiCheckbox-root": { color: theme.palette.mode === 'dark' ? "#b7ebde !important" : "inherit" },
            }}
        >
            <DataGrid rows={rows || []} columns={columns} checkboxSelection disableRowSelectionOnClick slots={{ toolbar: GridToolbar }} />
        </Box>
    );
};