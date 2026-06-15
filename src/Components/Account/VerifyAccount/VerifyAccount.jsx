import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, CardContent } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyCodeAPI  } from '../../../apis';
import { toast } from 'react-toastify';
import AppBar from '../../AppBar/AppBar';
import Footer from '../../Footer/Footer';

const VerifyAccount = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      const response = await verifyCodeAPI({ email, code : token});
      toast.success('Xác thực tài khoản thành công');  // ✅ thêm dòng này
      navigate('/account/Login');
    } catch (error) {
      console.error(error);  // Log thêm thông tin lỗi
      toast.error(error.response?.data?.message || 'Xác thực thất bại');
    }
  };

  return (
    <>
      <AppBar />
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Nhập mã xác thực
          </Typography>
          <TextField
            fullWidth
            label="Mã xác minh (6 số)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 6 }}
            />
          <Button fullWidth variant="contained" onClick={handleVerify}>
            Xác nhận
          </Button>
        </CardContent>
      </Card>
    </Container>
    <Footer />
    </>
  );
};

export default VerifyAccount;
