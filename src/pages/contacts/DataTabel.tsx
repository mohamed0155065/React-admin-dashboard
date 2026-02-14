import React, { FC, useMemo } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";

/**
 * Type definition for table row
 * Improves scalability & maintainability
 */
export interface UserRow {
    id: number;
    registerId: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
}

interface DataTableProps {
    rows: UserRow[];
}

/**
 * Reusable DataTable component
 * - Fully typed
 * - Theme aware
 * - Optimized using memoization
 */
export const DataTable: FC<DataTableProps> = ({ rows }) => {
    const theme = useTheme();

    const columns: GridColDef<UserRow>[] = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 70 },
            { field: "registerId", headerName: "Register ID", width: 120 },
            { field: "name", headerName: "Name", flex: 1 },
            { field: "age", headerName: "Age", width: 80, type: "number" },
            { field: "phone", headerName: "Phone", width: 150 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "address", headerName: "Address", flex: 1 },
            { field: "city", headerName: "City", width: 120 },
            { field: "zipCode", headerName: "Zip Code", width: 100 },
        ],
        []
    );

    return (
        <Box
            sx={{
                height: "75vh",
                width: "100%",
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#3e4396" : "#f5f5f5",
                    borderBottom: "none",
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
            />
        </Box>
    );
};
