"use client";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "sonner";
import {
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
} from "@/redux/api/userApi";

type TUser = {
  id: string;
  email: string;
  role: string;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  createdAt: string;
  admin?: { name: string } | null;
  doctor?: { name: string } | null;
  patient?: { name: string } | null;
};

const statusColor: Record<TUser["status"], "success" | "warning" | "error"> = {
  ACTIVE: "success",
  BLOCKED: "warning",
  DELETED: "error",
};

const ManageUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");

  const { data, isLoading } = useGetAllUsersQuery({
    ...(searchTerm && { searchTerm }),
    ...(role && { role }),
  });
  const [changeUserStatus, { isLoading: isUpdating }] =
    useChangeUserStatusMutation();

  const handleToggleStatus = async (user: TUser) => {
    const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await changeUserStatus({ id: user.id, status: nextStatus }).unwrap();
      toast.success(`User ${nextStatus === "ACTIVE" ? "activated" : "blocked"}`);
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Chip label={row.status} color={statusColor[row.status as TUser["status"]]} size="small" />
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined",
      flex: 1,
      valueGetter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Button
          size="small"
          variant="outlined"
          color={row.status === "ACTIVE" ? "error" : "success"}
          disabled={isUpdating || row.status === "DELETED"}
          onClick={() => handleToggleStatus(row)}
        >
          {row.status === "ACTIVE" ? "Block" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Users
          </Typography>
        </Toolbar>
      </AppBar>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{ minWidth: 280 }}
        />
        <TextField
          select
          size="small"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="DOCTOR">Doctor</MenuItem>
          <MenuItem value="PATIENT">Patient</MenuItem>
        </TextField>
      </Stack>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid rows={data || []} columns={columns} getRowId={(row) => row.id} />
        </Box>
      )}
    </Box>
  );
};

export default ManageUsersPage;
