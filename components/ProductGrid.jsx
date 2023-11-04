import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductCard from "./ProductCard";

const productData = [
  {
    id: 1,
    title: "Apple | Mansanas",
    img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    location: "Pagbilao, Quezon",
    price: 30.0,
    stock: 633,
    userName: "Juan Dela Cruz",
    userAvatar: "JD",
    rating: 4.7,
    ratingCount: 250
    },
    {
      id: 2,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Gumaca, Quezon",
      price: 110.3,
      stock: 633,
      userName: "Maria Clara",
      userAvatar: "MC",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 3,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Tayabas, Quezon",
      price: 50.0,
      stock: 633,
      userName: "Juan Dela Cruz",
      userAvatar: "JD",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 4,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Gumaca, Quezon",
      price: 110.3,
      stock: 633,
      userName: "Maria Clara",
      userAvatar: "MC",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 5,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Mauban, Quezon",
      price: 70.0,
      stock: 633,
      userName: "Juan Dela Cruz",
      userAvatar: "JD",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 6,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Atimonan, Quezon",
      price: 100.0,
      stock: 633,
      userName: "Maria Clara",
      userAvatar: "MC",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 7,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Candelaria, Quezon",
      price: 40.5,
      stock: 633,
      userName: "Juan Dela Cruz",
      userAvatar: "JD",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 8,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Lopez, Quezon",
      price: 100.0,
      stock: 633,
      userName: "Maria Clara",
      userAvatar: "MC",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 9,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Pagbilao, Quezon",
      price: 90.7,
      stock: 633,
      userName: "Juan Dela Cruz",
      userAvatar: "JD",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 10,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Alabat, Quezon",
      price: 60.0,
      stock: 633,
      userName: "Maria Clara",
      userAvatar: "MC",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 11,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Calauag, Quezon",
      price: 112.0,
      stock: 633,
      userName: "Juan Dela Cruz",
      userAvatar: "JD",
      rating: 4.7,
      ratingCount: 250
    },
    {
      id: 12,
      title: "Apple | Mansanas",
      img: "https://images.pexels.com/photos/6097872/pexels-photo-6097872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Sariaya, Quezon",
      price: 90.0,
      stock: 633,
      userName: "Maria Clara",
      userAvatar: "MC",
      rating: 4.7,
      ratingCount: 250
    },
  ];

  const ProductsGrid = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {productData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };
  
export default ProductsGrid;
