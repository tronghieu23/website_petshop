import { useState, useEffect } from "react";
import styled from "styled-components";
import Dashboard from "../index";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import OrderDetail from "../OrderDetail/index";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { fetchAllOrdersAPI, updateOrderAPI, deleteOrderAPI } from "../../../../apis";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const OrderIndex = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    customerName: "",
    status: "",
    payment: "",
    startDate: "",
    endDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchAllOrdersAPI();
        console.log("API response:", response);

        if (!response || !Array.isArray(response)) {
          console.error("Dữ liệu API không hợp lệ:", response);
          setOrders([]);
          return;
        }
        const formattedOrders = response.map((order) => {
          console.log("Processing order:", order);
          return {
            invoiceNo: order.id?.toString() || "N/A",
            orderTime: order.date || "Không có ngày",
            customerName: order.customerName || "Không xác định",
            method: order.payment || "Không rõ",
            address: order.address || "Không có địa chỉ",
            phone: order.phone || "Không có số điện thoại",
            note: order.note || "Không có ghi chú",
            amount: `${order.total ? order.total.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) : "0 VND"}`,
            paymentStatus: order.paymentStatus || "Không rõ",
            status: order.shippingStatus || "Không rõ",
            vnpTxnRef: order.vnpTxnRef || "N/A",
          };
        });

        console.log("Formatted orders:", formattedOrders);
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetail = (order) => {
    setSelectedOrderId(order.invoiceNo);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm]);

  const applyFilters = () => {
    let filtered = orders;

    if (filters.customerName) {
      filtered = filtered.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.payment) {
      filtered = filtered.filter((order) => order.method === filters.payment);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.orderTime) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.orderTime) <= new Date(filters.endDate)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setFilters({
      customerName: "",
      status: "",
      payment: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
    setFilteredOrders(orders);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setOpenConfirmDialog(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      await deleteOrderAPI(orderToDelete.invoiceNo);
      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order.invoiceNo !== orderToDelete.invoiceNo
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order.invoiceNo !== orderToDelete.invoiceNo
        )
      );
      setSnackbar({
        open: true,
        message: "Đơn hàng đã được xóa thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete order", error);
      setSnackbar({
        open: true,
        message: "Xóa đơn hàng thất bại!",
        severity: "error",
      });
    } finally {
      setOpenConfirmDialog(false);
      setOrderToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStatusChange = async (invoiceNo, newStatus) => {
    try {
      const orderToUpdate = orders.find((order) => order.invoiceNo === invoiceNo);
      if (!orderToUpdate) {
        throw new Error(`Không tìm thấy đơn hàng với mã ${invoiceNo}.`);
      }

      const orderTimeISO = new Date(orderToUpdate.orderTime).toISOString();

      const updateData = {
        customerName: orderToUpdate.customerName || "Không xác định",
        date: orderTimeISO,
        address: orderToUpdate.address || "Không có địa chỉ",
        total: parseInt(orderToUpdate.amount.replace(/\D/g, ""), 10) || 0,
        payment: orderToUpdate.method || "Không rõ",
        paymentStatus: orderToUpdate.paymentStatus || "Không rõ",
        shippingStatus: newStatus,
        vnpTxnRef: orderToUpdate.vnpTxnRef || "N/A",
      };

      await updateOrderAPI(invoiceNo, updateData);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.invoiceNo === invoiceNo
            ? { ...order, status: newStatus }
            : order
        )
      );

      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.invoiceNo === invoiceNo
            ? { ...order, status: newStatus }
            : order
        )
      );

      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái đơn hàng thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Không thể cập nhật trạng thái đơn hàng", error);
      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái đơn hàng thất bại!",
        severity: "error",
      });
    }
  };

  return (
    <Dashboard>
      <OrderManager>
        <Header>
          <Typography variant="h6" style={{ marginBottom: 16 }}>
            Quản lý hóa đơn
          </Typography>
          <button style={{ color: 'black' }}>Xuất đơn hàng</button>
        </Header>
        <FilterSection>
          <TextField
            fullWidth
            label="Tìm kiếm tên khách hàng"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="Đang vận chuyển">Đang vận chuyển</option>
            <option value="Hủy bỏ">Hủy bỏ</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã giao hàng">Đã giao hàng</option>
          </select>
          <select
            name="payment"
            value={filters.payment}
            onChange={handleFilterChange}
          >
            <option value="">Phương thức</option>
            <option value="Chuyển khoản VNPay">Chuyển khoản VNPay</option>
            <option value="Ví MoMo">Ví MoMo</option>   
            <option value="Thanh toán khi nhận hàng">Tiền mặt</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <button onClick={applyFilters} style={{ background: "#FFC1C1", color: 'black' }}>
            Lọc
          </button>
          <button style={{ whiteSpace: "nowrap" }} onClick={resetFilters}>
            Đặt lại
          </button>
        </FilterSection>
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableCell>Mã</StyledTableCell>
                <StyledTableCell>Thời gian đặt hàng</StyledTableCell>
                <StyledTableCell>Tên khách hàng</StyledTableCell>
                <StyledTableCell>PHƯƠNG THỨC</StyledTableCell>
                <StyledTableCell>Số tiền</StyledTableCell>
                <StyledTableCell>Thanh Toán</StyledTableCell>
                <StyledTableCell>Vận chuyển</StyledTableCell>
                <StyledTableCell>Tác vụ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <StyledTableRow key={order.invoiceNo}>
                  <TableCell>{order.invoiceNo}</TableCell>
                  <TableCell>{order.orderTime}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.method}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell className={`status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.invoiceNo, e.target.value)}
                    >
                      <option value="Đang vận chuyển">Đang vận chuyển</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Hủy bỏ">Hủy bỏ</option>
                      <option value="Đã giao hàng">Đã giao hàng</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewDetail(order)}>
                      <VisibilityOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOrder(order)}>
                      <DeleteOutlineOutlinedIcon color="error" />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
        {selectedOrderId && (
          <OrderDetail orderId={selectedOrderId} onClose={handleCloseDetail} />
        )}
      </OrderManager>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xóa đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa đơn hàng này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDeleteOrder} color="error">
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

export default OrderIndex;

const OrderManager = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #FFC1C1;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    opacity: 0.8;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input[type="text"],
  select,
  input[type="date"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #FFC1C1;
    color: white;
    cursor: pointer;
  }

  button:last-child {
    background-color: #dc3545;
  }

  button:nth-last-child(2) {
    background-color: #007bff;
  }

  button:hover {
    opacity: 0.8;
  }
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

  .status.pending {
    color: #ffc107;
  }

  .status.cancel {
    color: #dc3545;
  }

  .status.processing {
    color: #17a2b8;
  }

  .status.delivered {
    color: #FFC1C1;
  }

  select {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
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

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  color: #007bff;

  &:hover {
    opacity: 0.8;
  }
`;