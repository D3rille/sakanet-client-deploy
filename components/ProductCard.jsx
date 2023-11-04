import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Avatar,
  Box,
  Rating,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Link from "next/link";

function ProductCard({ product }) {
  return (
    <Card
      sx={{
        width: "100%",
        height: "355px",
        borderRadius: "12px",
        mb: 1,
        boxShadow: 3,
        position: 'relative',
      }}
    >
      <CardMedia
        sx={{ borderRadius: "10px", position: 'relative' }}
        component="img"
        alt={product.title}
        height="200"
        image={product.img}
      />

      <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 0.5, textShadow: '3px 1px 4px white' }}>
          <Avatar src={product.userAvatar} />
          <Box sx={{ marginLeft: 1 }}>
            <Box sx={{ height: "22px", display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bolder', fontSize: "0.9rem", textShadow: '4px 1px 6px white' }}>
                {product.userName}
              </Typography>
            </Box>
            <Box sx={{ height: "22px", display: 'flex', alignItems: 'center' }}>
              <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 'bolder', fontSize: "0.9rem", textShadow: '4px 1px 6px white' }}>
                {product.location}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginLeft: 5.5, display: 'flex', alignItems: 'flex-start' }}>
          <Rating name="user-rating" value={product.rating} readOnly sx={{ color: '#2E603A', fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ fontWeight: 'bolder', marginLeft: 1, textShadow: '8px 2px 6px white' }}>
            {`${product.rating} (${product.ratingCount} ratings)`}
          </Typography>
        </Box>
      </Box>

      <CardContent>
        <Typography
          variant="body1"
          align="right"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          ₱ {product.price}/kg
        </Typography>
        <Typography
          gutterBottom
          align="left"
          sx={{ fontSize: "1.1rem", fontWeight: "bolder", marginBottom: "0.5rem" }}
        >
          {product.title}
        </Typography>
        <Typography
          align="left"
          sx={{ fontSize: "0.9rem", marginBottom: "1rem" }}
        >
          Stocks: {product.stock} kg
        </Typography>
      </CardContent>
      <div style={{ display: "flex", width: "100%", height:'50px', maxHeight:'150px'}}>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#ECEDEC",
            color: "#2C2D2D",
            width: "50%",
            fontSize: "0.7rem",
            borderBottomLeftRadius: "12px",
            margin: 0,
            bottom: 18,
            borderRadius: 0,
          }}
          component={Link}
          href={`/Products/productOverviewBuy?productId=${product.id}`}
        >
          Buy Now
        </Button>
        <Button
          variant="contained"
          endIcon={<AddShoppingCartIcon style={{ color: "#C9D5CA" }} />}
          style={{
            backgroundColor: "#2F603B",
            color: "#C9D5CA",
            width: "50%",
            fontSize: "0.7rem",
            borderBottomRightRadius: "12px",
            margin: 0,
            bottom: 18,
            borderRadius: 0,
          }}
          component={Link}
          href={`/Products/productOverview?productId=${product.id}`}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
