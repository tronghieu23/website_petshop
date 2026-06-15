import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/Account/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Profiles from './Menus/Profiles';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { fetchCartItemsAPI, fetchSearchSuggestionsAPI } from '../../apis';
import { useNavigate } from 'react-router-dom';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff', // Màu nền trắng
  border: '2px solid #FFC1C1', // Viền màu xanh lá
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng
  '&:hover': {
    backgroundColor: alpha('#FFC1C1', 0.1), // Màu nền khi hover
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease', // Hiệu ứng chuyển đổi mượt
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '320px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FFC1C1', // Màu biểu tượng tìm kiếm
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#333', // Màu chữ
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1rem', // Kích thước chữ lớn hơn
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));


const LogoImage = styled('img')({
  maxHeight: '50px',
  marginRight: '20px',
});

const AppBarComponent = ({ updateCartItems }) => {
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await fetchCartItemsAPI(localStorage.getItem('id'));
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [updateCartItems]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchTerm.trim()) {
      navigate(`/Customer/Product?query=${encodeURIComponent(searchTerm.trim())}`);
    } else if (e.type === 'click' && !searchTerm.trim()) {
      alert('Vui lòng nhập từ khóa!');
    }
  };
  

  const [suggestions, setSuggestions] = useState([]);

// Lấy danh sách sản phẩm từ API
const fetchSuggestions = async (query) => {
  try {
    const response = await fetch(`http://localhost:8080/api/search/suggestions?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error("Failed to fetch suggestions:", response.statusText);
      setSuggestions([]); // Clear suggestions if API fails
      return;
    }
    const data = await response.json();
    setSuggestions(data);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    setSuggestions([]); // Clear suggestions on error
  }
};



// Khi người dùng nhập từ khóa
const handleInputChange = (e) => {
  const query = e.target.value.trim();
  setSearchTerm(query);
  if (query.length > 0) {
    fetchSuggestions(query);
    setShowSuggestions(true); // Hiển thị gợi ý khi có từ khóa
  } else {
    setSuggestions([]);
    setShowSuggestions(false); // Ẩn gợi ý khi không có từ khóa
  }
};

const handleSuggestionClick = (suggestion) => {
  console.log('Suggestion clicked:', suggestion);
  navigate(`/Customer/Product?query=${encodeURIComponent(suggestion)}`);
  setShowSuggestions(false); // Ẩn danh sách gợi ý
};


useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.search-container')) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);


useEffect(() => {
  console.log('Suggestions updated:', suggestions);
}, [suggestions]);


  return (
    <>
      <AppBar position="static" sx={{ background: '#f2f3f4' }} elevation={0}>
        <Toolbar>
          <a href="/" style={{ textDecoration: 'none' }}>
            <LogoImage
              img src="https://res.cloudinary.com/dvvshh1iv/image/upload/v1743273927/logoweb_tu4udj.png"
              alt="Logo"
              style={{ width: '100px', height: '50px', objectFit: 'cover', maxHeight: '80px' }}
            />
          </a>
          <Search className="search-container" sx={{ backgroundColor: 'white', position: 'relative' }}>
  <SearchIconWrapper>
    <SearchIcon />
  </SearchIconWrapper>
  <StyledInputBase
    placeholder="Bạn muốn tìm gì?"
    inputProps={{ 'aria-label': 'search' }}
    value={searchTerm}
    onChange={handleInputChange}
    onKeyDown={handleSearch}
  />
  {showSuggestions && suggestions.length > 0 && (
    <ul 
    style={{ 
      listStyle: 'none', 
      margin: 0, 
      padding: 0, 
      position: 'absolute', 
      top: '100%', 
      left: 0, 
      right: 0, 
      background: '#fff', 
      zIndex: 1000, 
      border: '2px solid #FFC1C1', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      maxHeight: '250px',
      overflowY: 'auto',
      borderRadius: '8px', 
    }}
  >
    {suggestions.map((suggestion, index) => (
      <li 
        key={index} 
        style={{ 
          padding: '10px', 
          cursor: 'pointer', 
          backgroundColor: '#fff',
          color: '#333', // Màu chữ
          borderBottom: index !== suggestions.length - 1 ? '1px solid #eee' : 'none',
          transition: 'background-color 0.2s ease, color 0.2s ease',
        }} 
        onClick={() => handleSuggestionClick(suggestion)}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#FFC1C1'; // Màu nền khi hover
          e.target.style.color = '#fff'; // Màu chữ khi hover
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#fff';
          e.target.style.color = '#333';
        }}
      >
        {suggestion}
      </li>
    ))}
  </ul>  
  )}
</Search>

<Button
  variant="contained"
  sx={{
    backgroundColor: "#FFC1C1",
    color: "#FDF5E6",
    "&:hover": {
      backgroundColor: "#FF6A6A",
    },
    ml: -1,
    padding: "5px 5px",
    fontSize: "0.705rem",
    minWidth: "auto",
  }}
  onClick={handleSearch}
>
  Tìm kiếm
</Button>

<div style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "nowrap" }}>
  <Button
    color="inherit"
    href="/"
    sx={{
      ml: 3,
      padding: "4px 8px",
      fontSize: "0.89rem",
      minWidth: "auto",
      textAlign: "center",
    }}
  >
    Trang chủ
  </Button>
  <Button
    color="inherit"
    href="/Introduce"
    sx={{
      padding: "4px 8px",
      fontSize: "0.89rem",
      minWidth: "auto",
      textAlign: "center",
    }}
  >
    Giới thiệu
  </Button>
  <Button
    color="inherit"
    href="/Customer/Product"
    sx={{
      padding: "4px 8px",
      fontSize: "0.89rem",
      minWidth: "auto",
      textAlign: "center",
    }}
  >
    Sản phẩm
  </Button>
  <Button
    color="inherit"
    href="/News"
    sx={{
      padding: "4px 8px",
      fontSize: "0.89rem",
      minWidth: "auto",
      textAlign: "center",
    }}
  >
    Tin tức
  </Button>
  <Button
    color="inherit"
    href="/ContactPage"
    sx={{
      padding: "4px 8px",
      fontSize: "0.86rem",
      minWidth: "auto",
      textAlign: "center",
    }}
  >
    Liên hệ
  </Button>
</div>

{/* Căn chỉnh khoảng cách giữa các IconButton */}
<Box display="flex" alignItems="center" gap={2} ml={2}>
  <IconButton color="inherit">
    <Badge badgeContent={0} color="success">
      <FavoriteBorderOutlinedIcon />
    </Badge>
  </IconButton>
  <IconButton color="inherit" href="/customer/ShoppingCart">
    <Badge badgeContent={cartItems.length} color="success">
      <ShoppingBagOutlinedIcon />
    </Badge>
  </IconButton>
  <IconButton
    color="inherit"
    aria-controls="menu-appbar"
    aria-haspopup="true"
    onClick={handleMenu}
  >
    <Badge badgeContent={0} color="success">
      <NotificationsNoneIcon />
    </Badge>
  </IconButton>
  {isAuthenticated ? (
    <Profiles />
  ) : (
    <IconButton color="inherit" href="/account/login">
      <AccountCircleOutlinedIcon />
    </IconButton>
  )}
</Box>

        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppBarComponent;
