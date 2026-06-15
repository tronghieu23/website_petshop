import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { toast } from "react-toastify";
import AppBarComponent from "../../../../Components/AppBar/AppBar";
import Footer from "../../../../Components/Footer/Footer";
import {
  fetchAllProductsAPI,
  addToCartAPI,
  fetchAllCategoriesAPI,
} from "../../../../apis";
import ChatAI from "../../../../Components/ChatAI/ChatAI";

// Format price
const formatPrice = (price) => {
  return Number(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Check discount expiry
const isDiscountExpired = (expiryDate) => {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
};

// Calculate display price
const calculateDisplayedPrice = (price, discount, discountExpiration) => {
  if (discount && !isDiscountExpired(discountExpiration)) {
    return price * (1 - discount / 100);
  }
  return price;
};

const Product = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [sortOption, setSortOption] = useState("default");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.search, location.pathname]);

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [priceFilter, setPriceFilter] = useState({
    price1: false,
    price2: false,
    price3: false,
    price4: false,
  });

  // Toggle category
  const handleToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchAllProductsAPI();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategoriesAPI();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔥 NEW — Read ?query= & ?category=
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const query = params.get("query") || "";
    const categoryFromURL = params.get("category") || "";

    setSearchQuery(query.toLowerCase());

    if (categoryFromURL && categories.length > 0) {
      const foundCategory = categories.find(
        (c) => c.name.toLowerCase() === categoryFromURL.toLowerCase()
      );

      if (foundCategory) {
        setSelectedCategories([foundCategory.id]);
      }
    }
  }, [location.search, categories]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search keyword
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category.id)
      );
    }

    // Price filter
    filtered = filtered.filter((product) => {
      if (
        !priceFilter.price1 &&
        !priceFilter.price2 &&
        !priceFilter.price3 &&
        !priceFilter.price4
      ) {
        return true;
      }

      if (priceFilter.price1 && product.price < 100000) return true;
      if (
        priceFilter.price2 &&
        product.price >= 100000 &&
        product.price <= 300000
      )
        return true;
      if (
        priceFilter.price3 &&
        product.price > 400000 &&
        product.price <= 700000
      )
        return true;
      if (
        priceFilter.price4 &&
        product.price > 800000 &&
        product.price <= 1000000
      )
        return true;

      return false;
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategories, priceFilter]);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "asc":
        return a.name.localeCompare(b.name);
      case "desc":
        return b.name.localeCompare(a.name);
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  // Add to cart
  const addToCartHandler = async (productId) => {
    try {
      const accountId = localStorage.getItem("id");
      const quantity = 1;
      await addToCartAPI(productId, quantity, accountId);
      toast.success("Bạn đã thêm sản phẩm vào giỏ hàng");
      navigate("/customer/ShoppingCart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const navigateToDetail = (id) => {
    navigate(`/Customer/ProductDetail/${id}`);
  };

  return (
    <>
      <AppBarComponent />

      <Container sx={{ marginTop: 2 }}>
        <Grid container spacing={3}>
          {/* Sidebar left */}
          <Grid item xs={12} md={3}>
            <Box sx={{ backgroundColor: "#f8f9fa", padding: "16px" }}>
              <Typography
                variant="h6"
                sx={{
                  padding: "10px",
                  fontWeight: "bold",
                  backgroundColor: "#FFC1C1",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Danh mục sản phẩm
              </Typography>

              <List>
                {categories.map((category) => (
                  <ListItem key={category.id}>
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleToggle(category.id)}
                    />
                    <ListItemText primary={category.name} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ marginY: 2 }} />

              <Typography
                variant="h6"
                sx={{
                  padding: "10px",
                  fontWeight: "bold",
                  backgroundColor: "#FFC1C1",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Bộ lọc sản phẩm
              </Typography>

              <FormControl component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="price1"
                      checked={priceFilter.price1}
                      onChange={(e) =>
                        setPriceFilter({
                          ...priceFilter,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Dưới 100.000đ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="price2"
                      checked={priceFilter.price2}
                      onChange={(e) =>
                        setPriceFilter({
                          ...priceFilter,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  }
                  label="100.000đ - 300.000đ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="price3"
                      checked={priceFilter.price3}
                      onChange={(e) =>
                        setPriceFilter({
                          ...priceFilter,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  }
                  label="400.000đ - 700.000đ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="price4"
                      checked={priceFilter.price4}
                      onChange={(e) =>
                        setPriceFilter({
                          ...priceFilter,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  }
                  label="800.000đ - 1.000.000đ"
                />
              </FormControl>
            </Box>
          </Grid>

          {/* Product list */}
          <Grid item xs={12} md={9}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 3, borderBottom: "1px solid #e0e0e0" }}
            >
              <Typography variant="h4">Tất cả sản phẩm</Typography>

              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <MenuItem value="default">Mặc định</MenuItem>
                  <MenuItem value="asc">A → Z</MenuItem>
                  <MenuItem value="desc">Z → A</MenuItem>
                  <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
                  <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
                  <MenuItem value="newest">Mới nhất</MenuItem>
                  <MenuItem value="oldest">Cũ nhất</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              {sortedProducts.map((item, index) => {
                const displayedPrice = calculateDisplayedPrice(
                  item.price,
                  item.discount,
                  item.discountExpiration
                );

                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigateToDetail(item.id)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        sx={{ objectFit: "cover" }}
                      />

                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h6">{item.name}</Typography>

                        {item.discount &&
                        !isDiscountExpired(item.discountExpiration) ? (
                          <Typography>
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {formatPrice(displayedPrice)}
                            </span>
                            <span
                              style={{
                                marginLeft: 8,
                                textDecoration: "line-through",
                                color: "#999",
                              }}
                            >
                              {formatPrice(item.price)}
                            </span>
                          </Typography>
                        ) : (
                          <Typography
                            style={{ color: "red", fontWeight: "bold" }}
                          >
                            {formatPrice(item.price)}
                          </Typography>
                        )}

                        <Button
                          variant="contained"
                          sx={{ mt: 2, backgroundColor: "#FFC1C1" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCartHandler(item.id);
                          }}
                        >
                          Thêm vào giỏ
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Footer />
      <ChatAI />
    </>
  );
};

export default Product;
