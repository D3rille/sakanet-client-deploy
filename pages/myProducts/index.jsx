import { useState, useContext, useEffect } from "react";
import {
  Grid,
  Box,
  Avatar,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Modal,
} from "@mui/material";
import Head from 'next/head';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../../styles/products.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Pagination from "@mui/material/Pagination";
import FarmerSideToggleButton from "../../components/FarmerSide/FarmerSideToggleButton";
import {
  GET_MY_PRODUCTS,
  SEARCH_MY_PRODUCTS,
  DELETE_PRODUCT
} from "../../graphql/operations/product";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import CircularLoading from "../../components/circularLoading";
import {formatDate, timePassed} from "../../util/dateUtils";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useRouter} from "next/router";
import TriggeredDialog from "../../components/popups/confirmationDialog";
import OptionsMenu from "../../components/popups/OptionsMenu";
import EditProductModal from "../../components/FarmerSide/EditProductModal";
import CustomDialog from "../../components/popups/customDialog";

import { AuthContext } from "../../context/auth";

const StyledIconButton = styled(IconButton)({
  background: "#2E603A",
  color: "#ECECED",
  transition: "width 0.2s, background-color 0.5s",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  padding: "12px",
  marginLeft: "2rem",
  marginTop: "2rem",
  "& .hover-text": {
    display: "none",
    color: "#2E603A",
    fontWeight: "bolder",
    fontSize: "15px",
  },
  "&:hover": {
    background: "#ECECED",
    borderRadius: "24px",
    width: "200px",
    paddingRight: "8px",
    paddingLeft: "12px",
    "& .MuiSvgIcon-root": {
      color: "#2E603A",
    },
    "& .hover-text": {
      display: "inline",
    },
  },
});

const triggerComponent = (handleClickOpen) => {
  return (
    <Button onClick={()=>{
      handleClickOpen();
    }}>
      More Details
    </Button>
  );
}

function ProductCard({ product, openDetails, setOpenDetails, productStatus, currentPage, selectedCategory }) {
  const [openOptions, setOpenOptions] = useState("");
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const handleDeleteProduct = () =>{
    deleteProduct({
      variables:{
        productId:product._id
      },
      refetchQueries:[GET_MY_PRODUCTS]
    })
  }
  
  const Options = (handleClick) =>{
    return(
    <IconButton
    onClick={(e)=>{
      handleClick(e);
    }}
    >
      <MoreVertIcon />
    </IconButton>
    );
  }
  
  const details =()=>{
    return(
      <>
        <Typography align="left" >
          Product Id: {product._id}
        </Typography>
        {product.product_description && (
          <Typography align="left" paragraph>
            Product Description:
            {product.product_description}
          </Typography>
        )}
        <Typography align="left" >
          Product Type: {product.item.product_type}
        </Typography>
        <Typography align="left" >
          Minimum_Order: {product.minimum_order}
        </Typography>
        <Typography align="left" >
          Area Limit: {product.area_limit}
        </Typography>
        <Typography align="left" >
          Created: {timePassed(product.createdAt)}
        </Typography>
      </>
    );
  }

  const moreOptions = [
    {name:"Edit", function:()=>{setOpenOptions("edit")}},
    {name:"Delete", function:()=>{setOpenOptions("delete")}},
  ]

  return (
    <Card
      sx={{
        // width: "100%",
        width:"20vw",
        maxWidth:"20vw",
        borderRadius: "12px",
        mb: 1,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FEFFFE",
      }}
    >
      {/* User details */}
      <Box sx={{ paddingLeft: 2, paddingTop: 2, paddingBottom: 1 }}>
        <Box sx={{ display: "flex", alignItems: 'center'}}>
          <Box
            sx={{
              display:"flex",
              flex:1,
            }}
          >
            <Avatar
              src={product.item.photo}
              sx={{ width: 48, height: 48 }}
            />
          </Box>
          <Box
            sx={{
              marginLeft: 1,
              display: "flex",
              flex:2,
              flexDirection: "column",
              height: "fit-content",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bolder", fontSize:'0.9rem'}}>
            {product.item.tagalogName && (<>{product.item.tagalogName} |{" "} </> )}{product.item.englishName}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              sx={{ fontWeight: "bolder", fontSize:'0.8rem' }}
            >
              Until: {formatDate(product.until, "ll")}
            </Typography>
          </Box>
          <Box 
            sx={{
              display:"flex",
              flex:1,
              justifyContent:"center",
              alignItems:"flex-start",
            }}
          >
          <OptionsMenu
          triggerComponent={Options}
          itemAndFunc={moreOptions}
          />
          </Box>

        </Box>

      </Box>

      {/* Image */}
      <CardMedia
        sx={{
          borderRadius: "10px",
          borderTop: "7px solid #FEFFFE",
          borderRight: "15px solid #FEFFFE",
          borderLeft: "15px solid #FEFFFE",
        }}
        component="img"
        alt={product.item.tagalogName ?? product.item.englishName}
        height="200"
        image={product.photo ? product.photo : product.item.photo}
      />

      {/* Product details */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography align="left" sx={{ fontWeight: "bolder" }}>
            ₱ {product.price}/kg
          </Typography>
          {product.status == "open"? (
            <Box
              sx={{
                backgroundColor: "#2E603A",
                borderRadius: "8px",
                width: "fit-content",
                padding: "2px 8px",
                fontSize: "0.7rem",
                color: "white",
              }}
            >
              {product.status}
            </Box>
          ):(
            <Box
              sx={{
                backgroundColor: "#FE8C47",
                borderRadius: "8px",
                width: "fit-content",
                padding: "2px 8px",
                fontSize: "0.7rem",
                color: "white",
              }}
            >
              {product.status}
            </Box>
          )}

        </Box>
        <Typography gutterBottom align="left" sx={{ fontWeight: "bold" }}>
          Available Stocks: {product.stocks}
        </Typography>
        <Typography align="left" >
          Mode of Delivery: {product.modeOfDelivery}
        </Typography>
        {product.modeOfDelivery == "pick-up" && (
          <>
            <Typography align="left" >
              Pick-up Location: {product.pickup_location}
            </Typography>
          </>
        )}
        {product.category == "Pre-Sell" && (
          <>
            <Typography align="left" >
              Harvest Date: {formatDate(product?.dateOfHarvest, "ll")}
            </Typography>
          </>
        )}
        
      </CardContent>
      
      <CardActions disableSpacing sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        {/* <Button onClick={()=>{
          setOpenDetails(true);
        }}>
          More Details
        </Button> */}
        <TriggeredDialog triggerComponent={triggerComponent} message={details()} title={"More Product Details"} btnDisplay={0}/>
      </CardActions>
      {/* Modals */}
      {openOptions == "edit" && (<EditProductModal
      isOpen = {Boolean(openOptions)}
      onClose={()=>{setOpenOptions("")}}
      data={product}
      productStatus={productStatus}
      currentPage={currentPage}
      selectedCategory={selectedCategory}
      />)}
      {openOptions == "delete" && (<CustomDialog
          openDialog={Boolean(openOptions)}
          setOpenDialog={setOpenOptions}
          title={"Delete Product"}
          message={"Delete product? This will no longer be visible to buyers and your product list. Proceed?"}
          btnDisplay={0}
          callback={()=>{
            handleDeleteProduct();
            setOpenOptions("");
          }}
          />)}

    </Card>
  );
}

const ProductsGrid = ({ ...props }) => {
  const {productData, openDetails, setOpenDetails, productStatus, currentPage, selectedCategory} = props;
  return (
    <div
      style={{
        display: "flex",
        flexWrap:"wrap",
        maxWidth:"100%",
        // gridTemplateColumns: "repeat(auto-fit, minmax(1px, 1fr))",
        gap: "16px",
        marginTop: "20px",
      }}
    >
      {productData?.map((product) => (
        <ProductCard 
        key={product._id} 
        product={product} 
        openDetails={openDetails} 
        setOpenDetails={setOpenDetails} 
        productStatus={productStatus}
        currentPage={currentPage}
        selectedCategory={selectedCategory}
        />
      ))}
    </div>
  );
};

export default function MyProductsPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role !== 'FARMER') {
      router.push('/404');
    }
  }, [user]);

  return user.role == 'FARMER' ? <MyProducts /> : null;
}

function MyProducts() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Sell");
  const [productStatus, setProductStatus] = useState("open");
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [filter, setFilter] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  // const [productId, setProductId] = useState("");
  

  const handleFilterChange = (event) => {
    event.preventDefault();
    const newFilter = event.target.value;
    setFilter(newFilter);
    searchProduct();
  };

  const handleProductStatChange=(event)=>{
    setProductStatus(event.target.value);
  }

  const handlePageChange = (event, page) => {
    //Pagination
    event.preventDefault();
    setCurrentPage(page);
  };

  const handleProductCategoryChange = (newType) => {
    setSelectedCategory(newType);
    setCurrentPage(1);
  };

  const { loading, error, data } = useQuery(
    GET_MY_PRODUCTS,
    {
      variables: {
        category:selectedCategory,
        limit:8,
        page:currentPage,
        status:productStatus
      },
    }
  );

  const [
    searchProduct,
    { data: searchData, error: searchError, loading: searchLoading },
  ] = useLazyQuery(
    SEARCH_MY_PRODUCTS,
    {
      variables: {
        category:selectedCategory,
        status:productStatus,
        searchInput: filter,
      },
    }
  );

  if (loading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <CircularLoading sx={{margin:"auto"}}/>
    </div>
  );
  if (error) return <p>Error: {error.message}</p>;
  if (searchError) return <p>Error: {searchError.message}</p>;

  if (data) {
    let productData;
    let totalProduct;

    const regex = new RegExp(`^${filter}`, "i");

    
    if (filter && searchData) {
      productData = searchData. searchMyProducts;
      totalProduct = productData.length;
    } else {
      productData = data.getMyProducts.product;
      totalProduct = data?.getMyProducts.totalProduct;
    }
   
    const totalPages = Math.ceil(totalProduct / 10);
    return (
      <Grid container className={styles.gridContainer}
      style={{ minHeight: '100vh' }}>
        <Head>
            <title>My Products</title>
            <meta name="description" content="My Products page" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid item xs={12}>
          <Paper elevation={3} className={styles.paperContainer}
          style={{ minHeight: '80vh' }}>
            {/*<h1 style={{paddingTop:"1rem"}}>Market Products</h1>*/}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{
                display:"flex",
                flex:1,
                justifyContent:"start"

              }}>
                <StyledIconButton
                  size="small"
                  onClick ={()=>{
                    router.push("/myProducts/addProduct");
                  }

                  }
                >
                  <AddIcon />
                  <Typography className="hover-text">ADD PRODUCT</Typography>
                </StyledIconButton>
              </div>
              <div style={{
                display:"flex",
                flex:1,
                justifyContent:"space-evenly",
              }}>
                
                <Select
                    value={productStatus}
                    onChange={handleProductStatChange}
                    // displayEmpty
                    style={{
                      marginTop:"2rem",
                      height: "40px",
                      minWidth: "160px",
                      borderRadius: "10px",
                      backgroundColor: "#FEFEFF",
                    }}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2E603A",
                      },
                    }}
                  >
                    <MenuItem value={"open"}>Open</MenuItem>
                    <MenuItem value={"closed"}>Closed</MenuItem>
                  </Select>
                <FarmerSideToggleButton
                  productsCategory={selectedCategory}
                  onProductCategoryChange={handleProductCategoryChange}
                />
              </div>

            </div>

            <Paper elevation={3} className={styles.logosearchbar}>
              <TextField
                size="small"
                type="text"
                onFocus={() => {
                  setSearchFocus(true);
                }}
                onBlur={() => {
                  setSearchFocus(false);
                }}
                value={filter}
                onChange={handleFilterChange}
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
            </Paper>
            <div className={styles.productGridContainer}>
              {searchLoading ? (
                <div style={{display:"flex", margin:"auto", justifyContent:"center"}}>
                  <CircularLoading />
                </div>
              ) : (
                <ProductsGrid 
                productData={productData} 
                openDetails={openDetails} 
                setOpenDetails={setOpenDetails} 
                productStatus={productStatus}
                currentPage={currentPage}
                selectedCategory={selectedCategory}
                />
              )}
             
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
                marginBottom: "2rem",
              }}
            >
              {!searchFocus && (
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
              )}
            </div>
            {/* Modals */}
            {/* <SellModal
              isOpen={isSellModalOpen}
              onClose={() => setIsSellModalOpen(false)}
            />
            <PreSellModal
              isOpen={isPreSellModalOpen}
              onClose={() => setIsPreSellModalOpen(false)}
            /> */}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
