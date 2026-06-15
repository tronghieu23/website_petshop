import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
  TextField,
  IconButton,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import AppBarComponent from "../../../../../Components/AppBar/AppBar";
import Footer from "../../../../../Components/Footer/Footer";
import {
  fetchOneProductsAPI,
  addToCartAPI,
  fetchUserInfoAPI,
} from "../../../../../apis";
import BestSellerProducts from "./BestSellerProducts";
import {
  getCommentAPI,
  postCommentAPI,
  deleteCommentAPI,
} from "../../../../../apis";

const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // tính theo giây

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng trước`;
  return `${Math.floor(diff / 31536000)} năm trước`;
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inputWidth, setInputWidth] = useState(50);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const commentEndRef = useRef(null);

  const inputRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await fetchOneProductsAPI(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchUser = async () => {
      const userId = localStorage.getItem("id");
      try {
        const data = await fetchUserInfoAPI(userId);
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchProduct();
    fetchUser();
  }, [productId]);

  useEffect(() => {
    if (inputRef.current) {
      const inputLength = String(quantity).length;
      setInputWidth(Math.max(70, inputLength * 15));
    }
  }, [quantity]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getCommentAPI(productId);
        console.log("API comments:", res);

        // Nếu BE trả về {rows: [...]}, thì lấy rows
        const commentsArray = Array.isArray(res) ? res : res.rows || [];

        const formattedComments = commentsArray.map((c) => ({
          id: c.id,
          user: {
            id: c.account?.id,
            name: c.account?.username || "User",
            image: c.account?.image || "",
            role: c.account?.role || null,
          },
          text: c.content,
          date: c.createdAt ? timeAgo(c.createdAt) : "Không rõ thời gian",
        }));
        setComments(formattedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [productId]);

  useEffect(() => {
    if (commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const addToCartHandler = async () => {
    try {
      await addToCartAPI(productId, quantity, localStorage.getItem("id"));
      alert("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleCommentChange = (e) => {
    const commentText = e.target.value;
    const wordCount = commentText.trim().split(/\s+/).length;

    // Nếu số từ vượt quá 200 thì thông báo lỗi
    if (wordCount <= 200) {
      setNewComment(commentText);
      setCommentError(""); // Xóa lỗi nếu nhập hợp lệ
    } else {
      setCommentError("Bình luận không được vượt quá 200 từ.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!userInfo) {
      alert("Bạn cần đăng nhập để bình luận");
      return;
    }
    if (!newComment.trim()) return;

    try {
      // Gửi comment
      const response = await postCommentAPI(
        productId,
        localStorage.getItem("id"),
        newComment.trim()
      );

      // Kiểm tra nếu có lỗi từ backend
      if (response.error) {
        alert(response.error); // Hiển thị thông báo lỗi
        return;
      }

      // Xử lý UI sau khi gửi
      setNewComment("");
      setCommentError("");
      const updatedComments = await getCommentAPI(productId);
      const formattedComments = updatedComments.map((c) => ({
        id: c.id,
        user: {
          id: c.account?.id,
          name: c.account?.username || "User",
          image: c.account?.image || "",
          role: c.account?.role || null,
        },
        text: c.content,
        date: c.createdAt ? timeAgo(c.createdAt) : "Không rõ thời gian",
      }));
      setComments(formattedComments);
    } catch (error) {
      console.error("Bình luận bạn bị chặn vì chứa nội dung toxic:", error);
      alert("Bình luận bạn bị chặn vì chứa nội dung toxic");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bình luận này không?"))
      return;

    try {
      await deleteCommentAPI(commentId);
      // Sau khi xoá thì fetch lại comment
      const data = await getCommentAPI(productId);
      const formattedComments = data.map((c) => ({
        id: c.id,
        user: {
          id: c.account?.id,
          name: c.account?.username || "User",
          image: c.account?.image || "",
          role: c.account?.role || null,
        },
        text: c.content,
        date: c.createdAt ? timeAgo(c.createdAt) : "Không rõ thời gian",
      }));
      setComments(formattedComments);
    } catch (error) {
      console.error("Lỗi khi xoá bình luận:", error);
      alert("Không thể xoá bình luận");
    }
  };

  const calculateDiscountProgress = () => {
    if (!product || !product.discountExpiration) return 0; // Đảm bảo product và discountExpiration tồn tại

    const now = new Date();
    const discountEnd = new Date(product.discountExpiration);

    const discountStart = product.discountStartDate
      ? new Date(product.discountStartDate)
      : new Date(discountEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (now >= discountEnd) {
      return 0;
    }

    if (now < discountStart) {
      return 100;
    }

    const totalDuration = discountEnd - discountStart;
    const remainingDuration = discountEnd - now;

    const progressPercentage = (remainingDuration / totalDuration) * 100;
    return progressPercentage > 0 ? progressPercentage : 0;
  };

  const isExpired = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now > expiry;
  };

  const discountExpired =
    product?.discountExpiration && isExpired(product.discountExpiration);

  const price = product?.price
    ? product.price
    : Math.round((product?.price || 0) * (1 - (product?.discount || 0) / 100));

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };
  if (!product) {
    return <div>Loading...</div>; // Hoặc một spinner, hình ảnh mặc định, v.v.
  }
  const displayPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
  return (
    <>
      <AppBarComponent />
      <Container sx={{ marginTop: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                alt={product?.name || "Tên sản phẩm"}
                image={product.image}
                title={product.name}
                sx={{ objectFit: "contain", height: "100%", width: "100%" }}
              />
            </Card>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {product.additionalImages?.map((img, index) => (
                <Grid item xs={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt={`additional-${index}`}
                      image={img}
                      title={`additional-${index}`}
                      sx={{
                        objectFit: "contain",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontSize: "28px", fontWeight: "bold" }}
              >
                {product.name}
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "20px", color: "#f00" }}>
                {product.discount > 0 && !discountExpired ? (
                  <>
                    <span style={{ marginRight: "10px" }}>
                      {displayPrice.toLocaleString()}đ
                    </span>
                    <span
                      style={{ textDecoration: "line-through", color: "#999" }}
                    >
                      {product.price.toLocaleString()}đ
                    </span>
                  </>
                ) : (
                  `${product.price.toLocaleString()}đ`
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginTop: 2,
                  color: product.quantity > 0 ? "#7f7f7f" : "#f00",
                  fontWeight: "bold",
                }}
              >
                {product.quantity > 0
                  ? `Còn lại: ${product.quantity} sản phẩm`
                  : "Hết hàng"}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {!discountExpired && product.discountExpiration && (
                <>
                  <Typography sx={{ marginY: 2, color: "#FFC1C1" }}>
                    Còn lại {calculateDiscountProgress().toFixed(0)}% thời gian
                    khuyến mãi
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateDiscountProgress()}
                    sx={{
                      height: "10px",
                      borderRadius: "5px",
                      marginY: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          calculateDiscountProgress() > 50
                            ? "#FFC1C1"
                            : "#ff4c4c",
                      },
                    }}
                  />
                </>
              )}
              <Box
                sx={{
                  backgroundColor: "#f9f9f9",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  marginTop: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#FFC1C1",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Nhà cung cấp sản phẩm
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ marginTop: 1, fontSize: "16px", color: "#555" }}
                >
                  Tên:{" "}
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {product.supplier?.name || "Không rõ"}
                  </span>
                </Typography>

                {product.supplier?.address && (
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: 0.5,
                      color: "#777",
                    }}
                  >
                    Địa chỉ: {product.supplier.address}
                  </Typography>
                )}
              </Box>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {product.description}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <IconButton
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  <Remove />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    // Chỉ cho phép nhập số nguyên dương
                    const inputValue = e.target.value;

                    // Kiểm tra nếu giá trị nhập vào là số nguyên dương
                    if (/^\d+$/.test(inputValue)) {
                      setQuantity(Math.max(1, Number(inputValue)));
                    }
                  }}
                  inputRef={inputRef}
                  sx={{
                    minWidth: "70px", // Đặt chiều rộng tối thiểu
                    width: `${inputWidth}px`, // Chiều rộng thay đổi theo nội dung
                    mx: 1,
                    "& input": {
                      textAlign: "center",
                    },
                  }}
                />

                <IconButton
                  onClick={() =>
                    setQuantity((prevQuantity) => prevQuantity + 1)
                  }
                >
                  <Add />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFC1C1",
                  color: "#fff",
                  marginRight: 1,
                }}
                onClick={addToCartHandler}
              >
                Thêm vào giỏ
              </Button>
            </CardContent>
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 2 }} />

        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Bình luận sản phẩm
          </Typography>

          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
          >
            <Avatar
              src={userInfo?.image || "default-avatar.jpg"} // Sử dụng hình ảnh mặc định nếu không có hình ảnh của userInfo
              alt={userInfo?.username || "User"} // Nếu không có username, dùng 'User' làm tên mặc định
            />{" "}
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder="Nhập bình luận của bạn..."
              value={newComment}
              onChange={handleCommentChange}
              onKeyPress={handleKeyPress}
              error={!!commentError}
              helperText={commentError}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: 2,
              }}
            />
            <Typography variant="caption" sx={{ color: "#999", marginTop: 1 }}>
              {newComment.trim().split(/\s+/).filter(Boolean).length} / 200 từ
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={!newComment.trim() || !!commentError}
            sx={{ backgroundColor: "#FFC1C1", color: "#fff" }}
          >
            Gửi bình luận
          </Button>

          {/* Danh sách bình luận */}
          <Box sx={{ marginTop: 3 }}>
            {comments.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#999" }}>
                Chưa có bình luận nào.
              </Typography>
            ) : (
              comments.map((comment, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar src={comment.user.image} alt={comment.user.name} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {comment.user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      {comment.date}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {comment.text}
                    </Typography>
                    {(() => {
                      const isOwner = userInfo?.id === comment.user.id;
                      const isAdmin = userInfo?.role?.name === "Quản Trị Viên";
                      const isManager = userInfo?.role?.name === "Quản Lý";
                      const commentOwnerIsAdmin =
                        comment.user.role?.name === "Quản Trị Viên";
                      const canDelete =
                        isOwner ||
                        isAdmin ||
                        (isManager && !commentOwnerIsAdmin);
                      return (
                        canDelete && (
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              onClick={() => handleDeleteComment(comment.id)}
                              sx={{
                                color: "#FFC1C1",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "14px",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              Xóa bình luận
                              {(isAdmin || isManager) && !isOwner && (
                                <span
                                  style={{
                                    fontSize: "12px",
                                    marginLeft: "4px",
                                  }}
                                >
                                  ({isAdmin ? "Admin" : "Quản Lý"})
                                </span>
                              )}
                            </Typography>
                          </Box>
                        )
                      );
                    })()}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
        <BestSellerProducts />
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetail;
