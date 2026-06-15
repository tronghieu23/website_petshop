import React, { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText, ListItemIcon, Drawer, AppBar, Toolbar, Typography, CssBaseline, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleIcon from '@mui/icons-material/Article';
import DiscountIcon from '@mui/icons-material/Discount';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { styled } from "@mui/system";

const drawerWidth = 300;

const DrawerContainer = styled("div")({
  display: "flex",
});

const AppBarStyled = styled(AppBar)({
  zIndex: 1201,
});

const DrawerStyled = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
  },
});

const Content = styled("main")({
  flexGrow: 1,
  padding: "16px",
});

const ListItemButtonStyled = styled(ListItemButton)({
  borderRadius: "6px",
  margin: "6px 10px",
  transition: "background-color 0.3s",
  "&.Mui-selected": {
    backgroundColor: "#ffebee",
    "&:hover": {
      backgroundColor: "#ffcdd2",
    },
  },
  "&:hover": {
    backgroundColor: "#fce4ec",
  },
});

const Dashboard = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState("/admin");

  const location = useLocation();

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DrawerContainer>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dvvshh1iv/image/upload/v1743273927/logoweb_tu4udj.png"
              alt="Logo"
              style={{ marginRight: "12px", height: "65px", width: "150px", objectFit: "cover" }}
            />
          </Link>
          <div style={{ flexGrow: 1 }}></div>
          <IconButton onClick={toggleDarkMode} style={{ color: "#fff" }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton style={{ color: "#fff" }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={handleMenuOpen} style={{ color: "#fff" }}>
            <AccountCircleIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent">
        <Toolbar />
        <Divider />
        <List>
          {[{
            text: "Thống kê", icon: <AssessmentIcon />, link: "/admin"
          }, {
            text: "Quản lý danh mục", icon: <CategoryIcon />, link: "/admin/categorymanager"
          }, {
            text: "Quản lý nhà cung cấp", icon: <Inventory2Icon />, link: "/admin/suppliermanager"
          }, {
            text: "Quản lý sản phẩm", icon: <StoreIcon />, link: "/admin/productmanager"
          }, {
            text: "Quản lý phiếu giảm giá", icon: <DiscountIcon />, link: "/admin/vouchermanager"
          }, {
            text: "Quản lý chức vụ", icon: <ManageAccountsIcon />, link: "/admin/RoleManager"
          }, {
            text: "Quản lý nội bộ", icon: <PeopleIcon />, link: "/admin/InternalManager"
          }, {
            text: "Quản lý khách hàng", icon: <GroupsIcon />, link: "/admin/customermanager"
          }, {
            text: "Quản lý hóa đơn", icon: <ShoppingCartIcon />, link: "/admin/ordermanager"
          }, {
            text: "Quản lý tin tức", icon: <ArticleIcon />, link: "/admin/newsmanager"
          }].map(({ text, icon, link }) => (
            <ListItemButtonStyled
              key={link}
              selected={selectedItem === link}
              component={Link}
              to={link}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButtonStyled>
          ))}
        </List>
      </DrawerStyled>
      <Content>
        <Toolbar />
        <Typography paragraph>{children}</Typography>
      </Content>
    </DrawerContainer>
  );
};

export default Dashboard;