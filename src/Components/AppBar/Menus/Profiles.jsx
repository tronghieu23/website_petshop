import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import UploadFileIcon from "@mui/icons-material/CloudUpload";
import { useConfirm } from "material-ui-confirm";
import Compressor from "compressorjs";
import IconButton from "@mui/material/IconButton";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"; // ← thêm
import { fetchUserInfoAPI, updateUserAPI } from "../../../apis";
import { useAuth } from "../../Account/AuthContext";

function Profiles() {
  const { userId, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [role, setRole] = useState(""); // ← thêm state role

  useEffect(() => {
    const fetchUserInfo = async () => {
      const id = localStorage.getItem("id");
      if (!id) return;
      try {
        const userData = await fetchUserInfoAPI(id);
        if (userData) {
          const userRole = userData.role ? userData.role.name : "defaultRole";
          localStorage.setItem("role", userRole);
          setRole(userRole); // ← lưu vào state

          const imageSrc = userData.image || "path/to/default-image.jpg";
          setUser(userData);
          setUsername(userData.username);
          setEmail(userData.email);
          setImage(imageSrc);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Failed to fetch user info");
      }
    };
    fetchUserInfo();
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          resolve(result);
        },
        error(error) {
          reject(error);
        },
      });
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) return;
    try {
      const compressedImage = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      if (compressedImage) reader.readAsDataURL(compressedImage);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const confirmLogout = useConfirm();
  const handleLogout = () => {
    confirmLogout({
      title: "Logout?",
      description: "Are you sure you want to logout?",
      confirmationText: "Logout",
      cancellationText: "Cancel",
      confirmationButtonProps: { color: "warning", variant: "outlined" },
    })
      .then(() => {
        logout();
        window.location.href = "/";
      })
      .catch(() => {});
  };

  const handleUpdateUser = async () => {
    try {
      const id = userId || localStorage.getItem("id");
      if (!id) throw new Error("User ID not found");
      const updatedUser = {
        username,
        ...(password && { password }),
        ...(email && { email }),
        image: selectedImage || image,
      };
      await updateUserAPI(id, updatedUser);
      setUser(updatedUser);
      toast.success("User updated successfully");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const isAdmin = role === "Quản Trị Viên"; // ← kiểm tra role

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 35, height: 35 }}
            alt="User Avatar"
            src={image}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "account-button" }}
      >
        <MenuItem onClick={handleDialogOpen}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} src={image} /> Tài khoản
          của tôi
        </MenuItem>
        <Divider />

        {/* ← Nút vào trang Admin, chỉ hiện nếu là Quản Trị Viên */}
        {isAdmin && (
          <MenuItem onClick={handleClose} component={Link} to="/admin">
            <ListItemIcon>
              <AdminPanelSettingsOutlinedIcon
                fontSize="small"
                sx={{ color: "#e91e63" }}
              />
            </ListItemIcon>
            Trang quản trị
          </MenuItem>
        )}

        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/customer/OrderDetail"
        >
          <ListItemIcon>
            <ShoppingBagOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Đơn hàng của bạn
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Tài Khoản</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Box display="flex" justifyContent="center">
              <input
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton component="span" color="primary">
                  <UploadFileIcon />
                </IconButton>
              </label>
            </Box>
            <Avatar
              src={selectedImage || image}
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              disabled
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleUpdateUser} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profiles;
