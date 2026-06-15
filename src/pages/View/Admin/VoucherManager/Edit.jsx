import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    TextField,
    Button,
    IconButton,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateVoucherAPI } from "../../../../apis"; // Đảm bảo import đúng đường dẫn

const VoucherEdit = ({ open, onClose, voucherItem, onSave }) => {
  const [editedVoucher, setEditedVoucher] = useState({ ...voucherItem });

  useEffect(() => {
    setEditedVoucher({ ...voucherItem });
  }, [voucherItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      // Cập nhật voucher qua API
      const updatedVoucher = await updateVoucherAPI(editedVoucher.id, editedVoucher);
      onSave(updatedVoucher);
      onClose();
    } catch (error) {
      console.error("Failed to update voucher:", error);
      // Handle error, show snackbar, etc.
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box p={3} width="450px" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Chỉnh sửa voucher
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin voucher từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Mã voucher"
          name="code"
          value={editedVoucher.code || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Giảm giá"
          name="discount"
          type="number"
          value={editedVoucher.discount || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ngày hết hạn"
          name="expirationDate"
          type="date"
          value={editedVoucher.expirationDate || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mô tả"
          name="description"
          value={editedVoucher.description || ""}
          onChange={handleChange}
          multiline
          rows={4}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
      
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
            variant="contained"
            style={{
              backgroundColor: "#FFC1C1",
              padding: "10px 20px",
            }}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default VoucherEdit;
