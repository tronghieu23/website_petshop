import React, { useEffect, useState } from "react";
import AppBarComponent from "../../Components/AppBar/AppBar";
import Footer from "../../Components/Footer/Footer";
import PartnerLogos from "../../Components/Footer/Partner/PartnerLogos";
import Promotion from "./Promotion/Promotion";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Toolbar,
} from "@mui/material";
import "swiper/swiper-bundle.css";
import Swiper from "swiper/bundle";
import ChatAI from "../../Components/ChatAI/ChatAI";
import { fetchCountCategoriesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    {
      title: "Thức ăn",
      image:
        "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743433674/foodlogo_chn5w0.png",
      products: 0,
    },
    {
      title: "Đồ dùng",
      image:
        "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743433964/pet-cage_yk9lvc.png",
      products: 0,
    },
    {
      title: "Đồ chơi",
      image:
        "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743434232/pet-toy_m8xoxp.png",
      products: 0,
    },
    {
      title: "Chăm sóc - Vệ sinh",
      image:
        "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743434371/shampoo_j6wvs6.png",
      products: 0,
    },
    {
      title: "Sức khỏe",
      image:
        "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743434917/medicine_eqycfq.png",
      products: 0,
    },
    {
      title: "Quần áo",
      image:
        "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743434813/pet_yzrcjw.png",
      products: 0,
    },
  ]);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const data = await fetchCountCategoriesAPI();

      const updatedCategories = categories.map((category) => {
        const matchingCategory = data.find(
          (item) => item.categoryName === category.title
        );
        return {
          ...category,
          products: matchingCategory ? matchingCategory.productCount : 0,
        };
      });

      setCategories(updatedCategories);
    };

    fetchCategoryCounts();

    new Swiper(".swiper-container", {
      slidesPerView: 6,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }, []);

  return (
    <div>
      <AppBarComponent />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        pt={2}
        pb={3}
        px={3}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} style={{ maxWidth: "1200px" }}>
            <Card
              style={{
                width: "100%",
                height: "450px",
                overflow: "hidden",
                position: "relative",
                borderRadius: "10px",
              }}
            >
              <CardMedia
                component="img"
                alt="Promotion"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 25%",
                }}
                image="src/img/banner1.png"
                title="PetFood Banner"
              />
              <CardContent
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "10%",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <Toolbar />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box p={3}>
        <Typography
          variant="h5"
          style={{ fontWeight: "bold", fontSize: "25px" }}
        >
          Danh mục nổi bật
        </Typography>

        <div
          className="swiper-container"
          style={{ width: "100%", overflow: "hidden" }}
        >
          <div
            className="swiper-wrapper"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            {categories.map((category, index) => (
              <div
                key={index}
                className="swiper-slide"
                style={{
                  backgroundColor: "#f4f6fa",
                  borderRadius: "10px",
                  padding: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "160px",
                  maxWidth: "120px",
                  flex: "0 0 auto",
                  height: "150px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() =>
                  navigate(`/Customer/Product?category=${category.title}`)
                }
              >
                <img
                  src={category.image}
                  alt={category.title}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "contain",
                    marginBottom: "5px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />

                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    lineHeight: "1.2",
                    whiteSpace: "normal",
                    maxWidth: "100px",
                    wordWrap: "break-word",
                    marginTop: "3px",
                  }}
                >
                  {category.title}
                </Typography>
              </div>
            ))}
          </div>

          <div className="swiper-pagination"></div>
        </div>
      </Box>

      <Promotion />
      <PartnerLogos />
      <Footer />
      <ChatAI />
    </div>
  );
};

export default Home;
