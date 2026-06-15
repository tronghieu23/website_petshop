import { useState, useEffect } from "react";
import { Typography, Grid, Paper, Box } from "@mui/material";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import Dashboard from "../index";
import { fetchTotalPriceOrdersAPI, fetchCountOrdersAPI, fetchCountCustomerAPI } from '../../../../apis';

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu mẫu cho biểu đồ đường
const lineData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7"],
  datasets: [
    {
      label: "Doanh số",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};

// Dữ liệu mẫu cho biểu đồ bánh
const pieData = {
  labels: ["Doanh thu", "Sản phẩm", "Thu nhập"],
  datasets: [
    {
      data: [68, 25, 7],
      backgroundColor: ["#FFC1C1", "#FF9800", "#2196F3"],
      hoverBackgroundColor: ["#FFC1C1", "#FFB74D", "#64B5F6"],
    },
  ],
};

// Dữ liệu cập nhật cho biểu đồ doanh thu hàng tháng
const barData = {
  labels: ["Th01", "Th02", "Th03", "Th04", "Th05", "Th06", "Th07", "Th08", "Th09"],
  datasets: [
    {
      label: "Doanh thu",
      data: [10, 40, 30, 50, 20, 15, 20, 25, 10],
      backgroundColor: "#00bfae",
      borderColor: "#00bfae",
      borderWidth: 1,
    },
  ],
};

const DashboardContent = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [shippingCount, setShippingCount] = useState(0); // Giả sử bạn có API để lấy dữ liệu này

  useEffect(() => {
    const fetchData = async () => {
      try {
        const total = await fetchTotalPriceOrdersAPI();
        const orders = await fetchCountOrdersAPI();
        const customers = await fetchCountCustomerAPI();

        setTotalIncome(total);
        setOrderCount(orders);
        setCustomerCount(customers);
        // Nếu bạn có API để lấy số lượng đơn vận chuyển, hãy gọi ở đây
        // const shipping = await fetchCountShippingAPI();
        // setShippingCount(shipping);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Chuyển đổi số thành định dạng hàng triệu
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + " triệu đồng";
    }
    return value + " đồng";
  };

  return (
    <Dashboard>
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: "#F5F5F5",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Thống kê
        </Typography>
        <Grid container spacing={3}>
          {/* Các chỉ số KPI */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#FFC1C1",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Tổng thu nhập</Typography>
              <Typography variant="h4">{formatCurrency(totalIncome)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#92a8d1",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Đơn đặt hàng</Typography>
              <Typography variant="h4">{orderCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#80ced6",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Khách hàng</Typography>
              <Typography variant="h4">{customerCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f18973",
                color: "#FFF",
              }}
            >
              <Typography variant="h6">Đơn vận chuyển</Typography>
              <Typography variant="h4">{orderCount}</Typography>
            </Paper>
          </Grid>

          {/* Biểu đồ doanh số */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Doanh số bán hàng</Typography>
              <Line data={lineData} />
            </Paper>
          </Grid>

          {/* Biểu đồ doanh thu hàng tháng */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Doanh thu hàng tháng</Typography>
              <Bar
                data={barData}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </Paper>
          </Grid>

          {/* Biểu đồ trạng thái đơn hàng */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Tình trạng đặt hàng</Typography>
              <Doughnut data={pieData} />
            </Paper>
          </Grid>

          {/* Doanh thu mạng xã hội */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Doanh thu xã hội</Typography>
              {/* Thay thế với biểu đồ hoặc biểu diễn dữ liệu phù hợp */}
            </Paper>
          </Grid>

          {/* Giao dịch */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6">Giao dịch gần đây</Typography>
              {/* Thay thế với bảng hoặc biểu diễn dữ liệu phù hợp */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Dashboard>
  );
};

export default DashboardContent;
