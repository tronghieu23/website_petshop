import React from "react";
import {
  Typography, Container, Grid, Paper, List, ListItem,
  ListItemText, Divider, Box, Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import qs from "qs";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";

// ✅ Khai báo animation và icon TRƯỚC khi dùng
const checkmarkAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
`;

const AnimatedCheckCircleOutlineIcon = styled(CheckCircleOutlineIcon)`
  animation: ${checkmarkAnimation} 1s ease-in-out;
  color: #ffc1c1;
  font-size: 3rem;
  margin-right: 1rem;
`;

const Confirmation = () => {
  const location = useLocation();
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const Logo = () => (
    <Box display="flex" justifyContent="center" mt={4} mb={2}>
      <img
        src="https://res.cloudinary.com/dvvshh1iv/image/upload/v1743273927/logoweb_tu4udj.png"
        alt="Logo"
        style={{ width: 200, height: "auto" }}
      />
    </Box>
  );

  // ✅ Xử lý redirect từ MoMo
  if (queryParams.momoSuccess === "true") {
    return (
      <Container>
        <Logo />
        <Typography variant="h4" align="center" gutterBottom
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatedCheckCircleOutlineIcon />
          Thanh toán MoMo thành công!
        </Typography>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="contained" color="primary" href="/">
            Tiếp tục mua hàng
          </Button>
        </Box>
      </Container>
    );
  }

  // ✅ Guard check orderData
  const orderData = queryParams.orderData
    ? JSON.parse(decodeURIComponent(queryParams.orderData))
    : null;

  if (!orderData) {
    return <Typography variant="h6">Không có dữ liệu đơn hàng.</Typography>;
  }

  const calculateSubtotal = () => {
    return orderData.orderDetails.reduce((sum, item) => {
      return sum + (item.product.price || 0) * (item.quantity || 0);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = 40000;
    const discountPercent = orderData.voucher?.discount || 0;
    let totalDiscount = 0;
    let finalShippingFee = shippingFee;

    if (orderData.voucher?.code === "FREESHIP") {
      totalDiscount = (shippingFee * discountPercent) / 100;
      finalShippingFee = shippingFee - totalDiscount;
    } else {
      totalDiscount = (subtotal * discountPercent) / 100;
    }

    return { total: subtotal + finalShippingFee - totalDiscount, finalShippingFee };
  };

  const { total, finalShippingFee } = calculateTotal();

  const getCurrentDate = () =>
    new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Container>
      <Logo />
      <Typography variant="h4" align="center" gutterBottom
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatedCheckCircleOutlineIcon />
        Đặt hàng thành công!
      </Typography>

      <Grid container justifyContent="center" style={{ marginTop: 40 }}>
        <Grid item xs={12} sm={10} md={8}>
          <Paper elevation={3} style={{ padding: 20, position: "relative" }}>
            <Typography variant="h6" align="center" gutterBottom style={{ fontWeight: "bold" }}>
              ĐƠN HÀNG #{orderData.orderId || orderData.id}
            </Typography>
            <Typography variant="body2" align="right"
              style={{ position: "absolute", top: 10, right: 20 }}>
              {getCurrentDate()}
            </Typography>
            <Divider style={{ marginBottom: 20 }} />

            <Box mt={2}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Thông tin khách hàng</Typography>
              <Typography variant="body1">Tên: {orderData.customerName}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Địa chỉ nhận hàng</Typography>
              <Typography variant="body1">{orderData.address}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Số điện thoại</Typography>
              <Typography variant="body1">{orderData.phone}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Ghi chú</Typography>
              <Typography variant="body1">{orderData.note}</Typography>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Chi tiết đơn hàng</Typography>
              <List>
                {orderData.orderDetails.map((item, index) => {
                  const product = item.product;
                  const price = product.discountedPrice || product.price;
                  return (
                    <ListItem key={index}>
                      <ListItemText
                        primary={product.name}
                        secondary={`Số lượng: ${item.quantity} - Giá: ${
                          price ? price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0₫"
                        }`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            <Box mt={2} pt={2} borderTop="1px solid #ccc">
              <Typography variant="subtitle1">
                Tạm tính: <span style={{ color: "red" }}>
                  {calculateSubtotal().toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </span>
              </Typography>
              <Typography variant="h5" marginBottom="20px" fontSize="16px">
                Phí vận chuyển: <span style={{ color: "red" }}>
                  {orderData.voucher?.code === "FREESHIP"
                    ? finalShippingFee.toLocaleString("vi-VN") + "₫"
                    : "40.000₫"}
                </span>
              </Typography>
              {orderData.voucher?.discount ? (
                <Typography variant="subtitle1">
                  Giảm giá voucher: <span style={{ color: "red" }}>{orderData.voucher.discount}%</span>
                </Typography>
              ) : null}
              <Typography variant="h6" style={{ marginTop: 10 }}>
                Tổng cộng: <span style={{ color: "red" }}>
                  {orderData.total
                    ? orderData.total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                    : "0₫"}
                </span>
              </Typography>
            </Box>
          </Paper>

          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" href="/">
              Tiếp tục mua hàng
            </Button>
            <Button variant="outlined" color="primary" startIcon={<PrintIcon />}
              style={{ marginLeft: "1rem" }} onClick={() => window.print()}>
              In
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Confirmation;