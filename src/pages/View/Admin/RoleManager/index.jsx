import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton as MuiIconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon, EditCalendarOutlined as EditCalendarOutlinedIcon, FilterList, GetApp } from "@mui/icons-material";
import Dashboard from "../index";
import RoleEdit from "../RoleManager/Edit";
import { fetchAllRolesAPI, deleteRoleAPI } from "../../../../apis";

const RoleManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 16px;
    border: 1px solid #FFC1C1;
    text-align: center;
  }

  th {
    background-color: #FFC1C1;
    font-weight: bold;
    color: #333;
  }

  td {
    color: #555;
  }

  tr:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    td {
      border-bottom: none;
    }
  }
`;

const StyledTableCell = styled(TableCell)`
  && {
    border: 1px solid #FFC1C1;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:not(:first-child) {
    &:hover {
      background-color: #f1f1f1;
      cursor: pointer;
    }
  }

  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
`;

const RoleIndex = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    try {
      const response = await fetchAllRolesAPI();
      const sortedRoles = response.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setRoles(sortedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRole = {
      id: String(roles.length + 1),
      name,
    };
    setRoles([...roles, newRole]);
    setName("");
    setSnackbar({
      open: true,
      message: "Thêm vai trò thành công!",
      severity: "success",
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteRoleId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRoleAPI(deleteRoleId);
      const updatedRoles = roles.filter(
        (role) => role.id !== deleteRoleId
      );
      setRoles(updatedRoles);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa vai trò thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = (editedRole) => {
    const updatedRoles = roles.map((role) =>
      role.id === editedRole.id ? editedRole : role
    );
    setRoles(updatedRoles);
    setEditingRole(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật vai trò thành công!",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <Dashboard>
      <RoleManager>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Quản lý vai trò
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tìm kiếm tên vai trò"
              variant="outlined"
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ marginRight: 8 }}
              onClick={() => setSearchName("")}
            >
              Đặt lại
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#FFC1C1" }}
              component={Link}
              to="/admin/rolemanager/create"
            >
              Thêm vai trò mới
            </Button>
          </Grid>
        </Grid>

        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Tên vai trò</StyledTableCell>
                <StyledTableCell>Tác vụ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <StyledTableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <MuiIconButton onClick={() => handleEdit(role)}>
                      <EditCalendarOutlinedIcon color="secondary" />
                    </MuiIconButton>
                    <MuiIconButton
                      onClick={() => handleDeleteClick(role.id)}
                    >
                      <DeleteOutlineOutlinedIcon color="error" />
                    </MuiIconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </RoleManager>

      <RoleEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        role={editingRole}
        onSave={handleSaveEdit}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa vai trò</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa vai trò này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dashboard>
  );
};

export default RoleIndex;