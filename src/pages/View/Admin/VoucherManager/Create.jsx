import React, { useState } from "react";
import {
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Dashboard from "../index";
import { createVoucherAPI } from "../../../../apis"; // Assuming createVoucherAPI function

const NewVoucher = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVoucher = {
      code: code,
      discount: discount,
      description: description,
      expirationDate: expirationDate,
    };

    try {
      // Gọi API để tạo voucher
      await createVoucherAPI(newVoucher);

      setSnackbar({
        open: true,
        message: "Voucher created successfully!",
        severity: "success",
      });

      // Reset lại form
      setCode("");
      setDiscount("");
      setDescription("");
      setExpirationDate("");

      // Chuyển hướng đến trang quản lý voucher
      navigate("/admin/voucherManager");
    } catch (error) {
      console.error("Error creating voucher:", error);
      setSnackbar({
        open: true,
        message: "Failed to create voucher.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/voucherManager");
  };

  return (
    <Dashboard>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Tạo Voucher Mới
              </Typography>
              <IconButton onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mã Voucher"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Giảm giá (%)"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    variant="filled"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ngày hết hạn"
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  style={{
                    borderColor: "#ff4d4f",
                    color: "#ff4d4f",
                    padding: "10px 20px",
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#FFC1C1",
                    color: "white",
                    padding: "10px 20px",
                  }}
                >
                  Tạo Voucher
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
      {/* Snackbar hiển thị thông báo thành công hoặc lỗi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dashboard>
  );
};

export default NewVoucher;
