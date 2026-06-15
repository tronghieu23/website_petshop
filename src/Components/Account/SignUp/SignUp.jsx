import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { signupAPI } from '../../../apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AppBar from '../../AppBar/AppBar';
import Footer from '../../Footer/Footer';
import { Container, TextField, Button, Typography, Card, CardContent, Box, IconButton } from '@mui/material';
import { Facebook, Google } from '@mui/icons-material';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    try {
      const response = await signupAPI(formData);
      if (response?.message) {
        localStorage.setItem('username', formData.username);
        toast.success('Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác nhận.');
        navigate('/account/Verify', { state: { email: formData.email } });
      } else {
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <>
      <AppBar />
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Card sx={{ p: 2, boxShadow: 2, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
              Đăng Ký
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth margin="dense" label="Tên Đăng Nhập" name="username" value={formData.username} onChange={handleInputChange} required />
              <TextField fullWidth margin="dense" type="email" label="Email" name="email" value={formData.email} onChange={handleInputChange} required />
              <TextField fullWidth margin="dense" type="password" label="Mật Khẩu" name="password" value={formData.password} onChange={handleInputChange} required />
              <TextField fullWidth margin="dense" type="password" label="Xác nhận Mật Khẩu" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                Đăng Ký
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
              Đã có tài khoản? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/account/Login')}>Đăng nhập ngay</span>
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default SignUp;