import { useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";  


const ProductCategories = ({categoryType, onCategoryChange, setCurrentPage }) => {
  const handleProductsSortChange = (event) => {
    const selectedCategory = event.target.value;
    setCurrentPage(1);
    onCategoryChange(selectedCategory);

  };
  return (
    <div
      style={{
        marginTop:'2rem',
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: "10px",
        marginLeft: "2rem",
      }}
    >
      <Typography style={{ marginRight: "10px", fontSize: "15px" }}>
        Product Categories:
      </Typography>
      <Select
        value={categoryType}
        onChange={handleProductsSortChange}
        displayEmpty
        style={{
          height: "40px",
          minWidth: 300,
          borderRadius: "10px",
          backgroundColor: "#FEFEFF",
          width: 300,
          
        }}
        IconComponent={ArrowDropDownIcon}
        sx={{
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2E603A',
          },
        }}
      >
        <MenuItem value={""}>All</MenuItem>
        <MenuItem value={"Cereals"}>Cereals</MenuItem>
        <MenuItem value={"Rootcrops"}>Root Crops</MenuItem>
        <MenuItem value={"Beans and Legumes"}>Beans and Legumes</MenuItem>
        <MenuItem value={"Condiments"}>Condiments</MenuItem>
        <MenuItem value={"Fruit Vegetables"}>Fruit Vegetables</MenuItem>
        <MenuItem value={"Leafy Vegetables"}>Leafy Vegetables</MenuItem>
        <MenuItem value={"Fruits"}>Fruits</MenuItem>
        <MenuItem value={"Commercial Crops"}>Commercial Crops</MenuItem>
        <MenuItem value={"Cutflowers"}>Cut Flowers</MenuItem>
        <MenuItem value={"Livestock and Poultry (Backyard)"}>Livestock and Poultry (Backyard)</MenuItem>
      </Select>
    </div>
  );
};

export default ProductCategories;
