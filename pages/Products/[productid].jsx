import * as React from "react";
import Head from 'next/head';
import { useState, useContext, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Divider,
  TextField,
  Checkbox,
  FormGroup,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../../styles/availableProducts.module.css";
import OrderProductGrid from "../../components/OrderProductGrid";
import PreOrderProductGrid from "../../components/PreOrderProductGrid";
import { GET_AVAILABLE_PRODUCTS, GET_SUGGESTED_PRODUCT, GET_PRODUCT} from "../../graphql/operations/product";
import { PLACE_ORDER } from "../../graphql/operations/order";
import { ADD_TO_CART} from "../../graphql/operations/cart";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import CircularLoading from "../../components/circularLoading";
import { DatePicker } from "@mui/x-date-pickers";
import Pagination from "@mui/material/Pagination";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AuthContext } from "../../context/auth";
import PurchaseDialog from "../../components/BuyerSide/PurchaseDialog";
import toast from 'react-hot-toast';


export default function AddProductsPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role !== 'BUYER') {
      router.push('/404');
    }
  }, [user]);

  return user.role == 'BUYER' ? <Products /> : null;
}

function Products() {
  const router = useRouter();
  const productId = router.query.productid; //Product Id for dynamic page
  const goBack = () => {
    router.push("/Products");
  };

  const [productsType, setProductsType] = React.useState("Sell"); //Order or Preorder 
  const [productsSortBy, setProductsSortBy] = React.useState("available"); //Available or Suggested Products
  const [deliveryFilter, setDeliveryFilter] = React.useState(""); //Delivery Filter
  const [priceRange, setPriceRange] = useState([0, 1000]); //Price Range Filter
  const [currentLocation, setCurrentLocation] = useState("");//Area Limit Filter
  const [selectedDate, setSelectedDate] = useState(null); //Date Filter
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [filters, setFilters] = useState({
    modeOfDelivery: "",      
    area_limit: "",
    maxPrice: 1000,
    minPrice: 0,
    until: null,
  });

  const [purchaseModal, setPurchaseModal] = useState([false, ""]);

  const productFilters = ()=>{
    setFilters({
      modeOfDelivery: deliveryFilter,      
      area_limit: currentLocation,
      maxPrice: priceRange[1],
      minPrice: priceRange[0],
      until: selectedDate,
    });

  } 
  ;

  const handleProductTypeChange = (event, newType) => {
    setProductsType(newType);
  };

  const handleDeliveryFilter = (event) => {
    setDeliveryFilter(event.target.value);
  };

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleInputChange = (index, event) => {
    const values = [...priceRange];
    values[index] = Number(event.target.value);
    setPriceRange(values);
  };

  const handleProductsSortChange = (event) => {
    setProductsSortBy(event.target.value);
  };
  
   const handlePageChange = (event, page) => { //Pagination
    event.preventDefault();
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // const resetFilters = () => {
  //   setDeliveryFilter("");
  //   setPriceRange([0, 1000]);
  //   setSelectedDate(null);
  //   setCurrentLocation("");
  // };

  
  
  // Use different queries based on the sortBy property
  const { data, loading, error } = productsSortBy === 'available'
    ? useQuery(GET_AVAILABLE_PRODUCTS, { //Available Product
        variables: {
          category: productsType,
          itemId: productId,
          filter: filters,
          page: currentPage,
          limit: 6,
        },
      })
    : useQuery(GET_SUGGESTED_PRODUCT, { //Suggested Product
        variables: {
          category: productsType,
          itemId: productId,
          filter: filters,
          page: currentPage,
          limit: 6,
        },
      });


  const [placeOrder, placeOrderResults] = useMutation(PLACE_ORDER,{
    //TODO: Refetch Orders
    onCompleted:()=>{
      toast.success("successfully placed an order");

    },
    onError:(error)=>{
      console.log(error.message);
      toast.error(error.message);
    },

  });

  const [addToCart, addToCartResults] = useMutation(ADD_TO_CART, {
    onCompleted:()=>{
      toast.success("Order Added to Cart.");
    }
  })



  if (loading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <CircularLoading/>
    </div>
  ); //TODO: Implement Loading and Error messaging
  if (error) return <p>Error: {error.message}</p>;
  
  if(data && !loading){
    let products;
    let totalProduct;

    if (productsSortBy === 'available') {
      products = data.getAvailableProducts.product;
      totalProduct = data.getAvailableProducts.totalProduct;
    } else if (productsSortBy === 'suggested') {
      products = data.getSuggestedProducts.product;
      totalProduct = data.getSuggestedProducts.totalProduct;
    }
  
     const totalPages = Math.ceil(totalProduct/ 10);

    return (
    
      <Grid container className={styles.gridContainer}>
        <Head>
          <title>Products</title>
          <meta name="description" content="Products page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid item xs={12}>
        
          <Paper elevation={3} className={styles.paperContainer}>
          <h1 style={{paddingTop:"1rem"}}>Seller Offers</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 2rem",
            }}
          >
            <IconButton
              onClick={goBack}
              sx={{
                color: "#2F613A",
                backgroundColor: "transparent",
                fontSize: "1rem",
              }}
            >
              <ArrowBackIcon /> Go Back
            </IconButton>
          
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  borderRadius: "10px",
                  marginRight: "2rem",
                }}
              >
                <Typography style={{ marginRight: "10px", fontSize: "15px" }}>
                  Sort by:
                </Typography>
                <Select
                  value={productsSortBy}
                  onChange={handleProductsSortChange}
                  displayEmpty
                  style={{
                    height: "40px",
                    minWidth: "160px",
                    borderRadius: "10px",
                    backgroundColor: "#FEFEFF",
                  }}
                  IconComponent={ArrowDropDownIcon}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2E603A',
                    },
                  }}
                >
                  <MenuItem value={"available"}>Available Sellers</MenuItem>
                  <MenuItem value={"suggested"}>Suggested Sellers</MenuItem>
                </Select>
              </div>
          
              <ToggleButtonGroup
                sx={{
                  "& .Mui-selected": {
                    bgcolor: "#C2E7CB",
                  },
                }}
                color="primary"
                value={productsType}
                exclusive
                onChange={handleProductTypeChange}
                aria-label="Product Type"
              >
                <ToggleButton
                  value="Sell"
                  sx={{
                    color: "#2F613A",
                    "&.Mui-selected": {
                      color: "#2F613A",
                    },
                  }}
                >
                  ORDER
                </ToggleButton>
                <ToggleButton
                  value="Pre-Sell"
                  sx={{
                    color: "#2F613A",
                    "&.Mui-selected": {
                      color: "#2F613A",
                    },
                  }}
                >
                  PRE-ORDER
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
  
  
            {/* Content Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Paper
                elevation={3}
                className={styles.innerPaperLeft}
                sx={{ borderRadius: "13px", padding: "1rem" }}
              >
                <Typography sx={{ fontSize: "14px", marginBottom: "1rem" }}>
                  Mode of Delivery
                </Typography>
                <RadioGroup
                  aria-label="mode-of-delivery"
                  name="mode-of-delivery"
                  value={deliveryFilter}
                  onChange={handleDeliveryFilter}
                  // flexDirection="column"
                  sx={{ marginLeft: "1rem", marginBottom: "1rem" }}
                >
                  <FormControlLabel
                    value="pick-up"
                    control={
                      <Radio sx={{ "&.Mui-checked": { color: "#2F603B" } }} />
                    }
                    label={
                      <Typography sx={{ fontSize: "12px" }}>Pick Up</Typography>
                    }
                  />
                  <FormControlLabel
                    value="delivery"
                    control={
                      <Radio sx={{ "&.Mui-checked": { color: "#2F603B" } }} />
                    }
                    label={
                      <Typography sx={{ fontSize: "12px" }}>Delivery</Typography>
                    }
                  />
                  <FormControlLabel
                    value=""
                    control={
                      <Radio sx={{ "&.Mui-checked": { color: "#2F603B" } }} />
                    }
                    label={<Typography sx={{ fontSize: "12px" }}>All</Typography>}
                  />
                </RadioGroup>
                <Divider sx={{ marginBottom: "1rem" }} />
                <Typography sx={{ fontSize: "14px", marginBottom: "1rem" }}>
                  Price Range
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  sx={{
                    marginBottom: "1rem",
                    "& .MuiSlider-track": {
                      bgcolor: "#2F603B",
                    },
                    "& .MuiSlider-thumb": {
                      color: "#2F603B",
                    },
                    "& .MuiSlider-rail": {
                      bgcolor: "#ECEDEC",
                    },
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Min"
                    value={priceRange[0]}
                    onChange={(e) => handleInputChange(0, e)}
                    style={{ width: "45%" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#2F603B" },
                        "&.Mui-focused fieldset": { borderColor: "#2F603B" },
                      },
                    }}
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Max"
                    value={priceRange[1]}
                    onChange={(e) => handleInputChange(1, e)}
                    style={{ width: "45%" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#2F603B" },
                        "&.Mui-focused fieldset": { borderColor: "#2F603B" },
                      },
                    }}
                  />
                </div>
                <Divider sx={{ marginBottom: "1rem", marginTop: "1rem" }} />
                <Typography sx={{ fontSize: "14px", marginBottom: "1rem" }}>
                  Area Limit
                </Typography>
  
                <TextField
                    placeholder="Enter location: ex. Quezon"
                    variant="outlined"
                    size="small"
                    style={{ borderColor: "#2E603A", width: "100%" }}
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                  />
  
                <Divider sx={{ marginTop: "1rem" }} />
  
                <Typography
                  sx={{
                    fontSize: "14px",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  Time Limit
                </Typography>
  
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Set Time Limit"
                    sx={{
                      width: "100%",
                    }}
                    value={selectedDate}
                    onAccept={(newValue) => setSelectedDate(newValue.toISOString())} // This triggers after user selects a date                  
                  />
                </LocalizationProvider>
  
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "#2F603B",
                    marginTop: "2rem",
                    width: "100%",
                  }}
                  // onClick={resetFilters}
                  onClick={productFilters}
                >
                  SEARCH
                </Button>
              </Paper>
              <div className={styles.parentContainer}>
                {/* <Paper elevation={3} className={styles.innerPaperRight}>
                  <div className={styles.logosearchbar}>
                    <TextField
                      size="small"
                      type="text"
                      fullWidth
                      className={styles.searchicon}
                      sx={{
                        borderRadius: "30px",
                        backgroundColor: "#FFFEFE",
                        justifyItems: "right",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "transparent",
                            borderRadius: "30px",
                          },
                          "&:hover fieldset": {
                            borderColor: "transparent",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "transparent",
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "10px 10px 10px 15px",
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Search"
                    />
                  </div>
                </Paper> */}
                
                <div className={styles.productGridContainer}>
    {productsType === "Sell" ? <OrderProductGrid products = {products}  setPurchaseModal={setPurchaseModal}/> : 
  <PreOrderProductGrid products = {products}  setPurchaseModal={setPurchaseModal} />}
  
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
        marginBottom: "2rem",
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#2F603B",
          },
          "& .MuiPaginationItem-page.Mui-selected": {
            backgroundColor: "#2F603B",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#2F603B",
            },
          },
          "& .MuiPaginationItem-page.Mui-selected.Mui-focusVisible": {
            backgroundColor: "#2F603B",
          },
        }}
      />
                  </div>
                </div>
              </div>
            </div>
          </Paper>
          <PurchaseDialog
          placeOrderResults = {placeOrderResults}
          purchaseModal = {purchaseModal}
          closePurchaseModal = {()=>{
            let id = purchaseModal[1];
            setPurchaseModal([false, id])
          }} 
          placeOrder={placeOrder} 
          addToCart={addToCart}
          addToCartResults={addToCartResults}
          />
        </Grid>
      </Grid>
    );
  }

  
  
}
