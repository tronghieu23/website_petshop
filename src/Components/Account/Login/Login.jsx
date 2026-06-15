import React, { useState } from 'react';
import { loginAPI } from '../../../apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AppBar from '../../AppBar/AppBar';
import Footer from '../../Footer/Footer';
import { Container, TextField, Button, Typography, Card, CardContent, Box, IconButton } from '@mui/material';
import { Facebook, Google } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAPI(formData);
      setFormData({
        email: '',
        password: ''
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        const id = response.id;
        localStorage.setItem('id', id);
        toast.success(response.message || 'Đăng nhập thành công');
        login(id);
        navigate('/');
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <>
      <AppBar />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Card sx={{ p: 2, boxShadow: 2, borderRadius: 2, maxWidth: 350, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
              Đăng Nhập
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth margin="dense" type="email" label="Email" name="email" value={formData.email} onChange={handleInputChange} required />
              <TextField fullWidth margin="dense" type="password" label="Mật Khẩu" name="password" value={formData.password} onChange={handleInputChange} required />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                Đăng Nhập
              </Button>
            </form>
            <Typography align="center" sx={{ mt: 1 }}>
              Hoặc đăng nhập bằng
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} mt={1}>
              <IconButton onClick={() => {}}>
                <Facebook fontSize="small" sx={{ color: '#1877F2' }} />
              </IconButton>
              <IconButton onClick={() => {}}>
                <Google fontSize="small" sx={{ color: '#DB4437' }} />
              </IconButton>
            </Box>
            <Typography align="center" sx={{ mt: 1 }}>
              Chưa có tài khoản? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/account/signup')}>Đăng ký ngay</span>
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Login;