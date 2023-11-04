import React, { useState, useEffect } from "react";
import {
Grid,
Paper,
Typography,
TextField,
Button,
Card,
CardContent,
CardMedia,
Avatar,
Box,
Rating,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
FormControl,
InputLabel,
Select,
MenuItem,
FormControlLabel,
RadioGroup,
Radio,
FormLabel,
} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import styles from "../../styles/productOverview.module.css";
import { useRouter } from "next/router";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_PRODUCT,GET_AVAILABLE_PRODUCTS  } from "../../graphql/operations/product";
import { PLACE_ORDER, SELLER_HAS_PAYMENT_CHANNELS } from "../../graphql/operations/order";
import { formatWideAddress } from "../../util/addresssUtils";
import {formatDate, timePassed} from "../../util/dateUtils";
import TriggeredDialog from "../../components/popups/confirmationDialog";
import CircularLoading from "../../components/circularLoading";
import { GET_CART_ITEMS } from "../../graphql/operations/cart";
import toast from "react-hot-toast";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });



export default function PurchaseDialog({...props}) {
    //Props from Orders page index.js
    const {placeOrderResults, purchaseModal, closePurchaseModal, placeOrder, addToCart, addToCartResults} = props;
    const {data:placeOrderData, loading:placeOrderLoading} = placeOrderResults;
    const {data:addToCartData, loading:addToCartLoading} = addToCartResults;

    const [contactNumber, setContactNumber] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const radioStyles = {
    checked: {
        color: "#2F613A",
    },
    };

    useEffect(()=>{
        if(purchaseModal[1]){
            getProduct();
        }

    },[purchaseModal]);

    const [getProduct ,{data:productData, loading:productDataLoading, error:productDataError}] = useLazyQuery(GET_PRODUCT, {
        variables: {
        productId: purchaseModal[1],
        },
        onError:(error)=>{
        toast.error("Problem Retrieving Product Information.");
        console.log(error.message);
        }
    });

    const [checkHasPaymentChannels, {data:sellerPaymentChannels}] = useLazyQuery(SELLER_HAS_PAYMENT_CHANNELS);

    useEffect(()=>{
        if(productData && !productDataLoading){
            checkHasPaymentChannels({
                variables:{
                    sellerId: productData?.getProduct?.seller?.id
    
                }
            });
        }
    },[productData, productDataLoading]);

    if (productDataLoading) return <CircularLoading/>;
    if(productData){

    const product = productData.getProduct.product;
    const seller = productData.getProduct.seller;
    
    const handleClose = () =>{
        setContactNumber("");
        setQuantity(0);
        setModeOfPayment("");
        setDeliveryAddress("");
        closePurchaseModal();
    }

    const executePlaceOrder=async()=>{

        placeOrder({variables:{
            "order": {
                "type": product?.category == "Sell" ? "Order":"Pre-Order",
                "productId": product?._id,
                "seller": {
                    "id": seller?.id,
                    "name": seller?.name
                },
                "quantity": parseFloat(quantity),
                "modeOfPayment": modeOfPayment,
                "modeOfDelivery":product.modeOfDelivery,
                "deliveryAddress": deliveryAddress,
                "phoneNumber": contactNumber,
                "unit": product?.unit,
                "photo": product.photo ? product.photo : product.item.photo
            }
        },
        refetchQueries:[GET_AVAILABLE_PRODUCTS],
        onCompleted:()=>{
            toast.success("Place Order Successful");
            handleClose();
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    });
        
    }

    const executeAddToCart = () => {
        addToCart({variables:{
                "order": {
                  "type": product?.category == "Sell" ? "Order":"Pre-Order",
                  "productId": product?._id,
                  "seller": {
                    "id": seller?.id,
                    "name": seller?.name
                  },
                  "quantity": parseFloat(quantity),
                  "modeOfPayment": modeOfPayment,
                  "modeOfDelivery":product.modeOfDelivery,
                  "deliveryAddress": deliveryAddress,
                  "phoneNumber": contactNumber,
                  "unit": product?.unit,
                  "photo": product.photo ? product.photo : product.item.photo
                }
            },
            refetchQueries:[GET_AVAILABLE_PRODUCTS,  GET_CART_ITEMS],
            onCompleted:()=>{
                toast.success("Added to Cart");
                handleClose();
            },
            onError:(error)=>{
                toast.error(error.message);
                console.error(error.message);
            }
        })
    }

    const BuyNowBtn = (handleClickOpen) =>{
        return(
            <>
            <Button
                fullWidth
                variant="contained"
                disabled={isDisabled}
                onClick={()=>{handleClickOpen()}}
                sx={{
                    backgroundColor: isDisabled ? "grey" : "#2F613A",
                    "&:hover": {
                    backgroundColor: isDisabled ? "grey" : "#FF8C46",
                    },
                    "&:active": {
                    backgroundColor: "#FF8C46",
                    },
                    borderRadius: 20,
                    flex: 1,
                }}
                >
                {placeOrderLoading ? (<CircularLoading/>):"BUY NOW"}
            
            </Button>
            </>
            
        );
    }

    const AddToCartBtn = (handleClickOpen) =>{
        return(
            <>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={()=>{handleClickOpen()}}
                    endIcon={<AddShoppingCartIcon style={{ color: "#C9D5CA" }} />}
                    sx={{
                        backgroundColor: "#2F603B",
                        "&:hover": {
                        backgroundColor: isDisabled ? "grey" : "#FF8C46",
                        },
                        "&:active": {
                        backgroundColor: "#FF8C46",
                        },
                        color: "white",
                        borderRadius: 20,
                        flex: 1,
                    }}
                    >
                    {addToCartLoading ? (<CircularLoading sx={{border:"3px solid white"}}/>):"ADD TO CART"}
                </Button>
            </>
        );
    }

    return (
        <Dialog
            fullScreen
            open={purchaseModal[0]}
            onClose={handleClose}
            TransitionComponent={Transition}
            >
            <AppBar sx={{ position: 'relative', backgroundColor:"#2F613A"}}>
                <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Cancel
                </Typography>
                {/* <Button autoFocus color="inherit" onClick={closePurchaseModal}>
                    save
                </Button> */}
                </Toolbar>
            </AppBar>
            <Grid container className={styles.gridContainer}>
        <Grid item xs={12}>
            <Paper elevation={3} className={styles.paperContainer}>
            <Paper
                className={`${styles.paperCardContainer} ${styles.mobilePaperCardContainer}`}
                elevation={2}
                style={{
                width: "70%",
                maxWidth: "100%",
                margin: "0 auto",
                marginTop: "3rem",
                borderRadius: "20px",
                }}
            >
                <Card
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    height: { xs: "auto", sm: "400px" },
                    backgroundColor: "#FEFEFF",
                    borderRadius: "20px",
                }}
                className={styles.mobileLayout}
                >
                <CardMedia
                    component="img"
                    sx={{
                    width: { xs: "100%", sm: "50%" },
                    border: "20px solid #FEFEFF",
                    }}
                    className={styles.mobileCardMedia}
                    image={product.photo ? product.photo : product.item.photo}
                    alt={product.item.tagalogName ?? product.item.englishName}
                />
                <Box
                    sx={{
                    flexGrow: 1,
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflowY: "auto",
                    boxShadow: "0px 4px 4px rgba(255, 255, 255, 0.25)",
                    width: "50%",
                    padding: "1rem",
                    }}
                >
                    <CardContent sx={{ overflowY: "auto", flex: "1" }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                        src={seller.profile_pic}
                        sx={{ mr: 3, width: "50px", height: "50px" }}
                        />
                        {/* {seller.profile_pic} */}
                        {/* </Avatar> */}
                        <div>
                        <Typography variant="subtitle1">
                            {seller.name}
                        </Typography>
                        <Box display="flex" sx={{flexDirection:"row"}}>
                            <Rating
                            name="read-only"
                            value={seller.rating}
                            precision={0.1}
                            readOnly
                            />
                            <Typography variant="body1">
                                {`${seller.rating}(${seller.reviewerCount ?? 0})`}
                            </Typography>
                        </Box>
                        
                        </div>
                    </Box>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ marginTop: 2, marginBottom: 2 }}
                    >
                        {product.item.tagalogName ? `${product.item.tagalogName} | 
                        ${product.item.englishName}`: product.item.englishName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        ₱ {product.price} /{product.unit}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                        sx={{ marginTop: 2, marginBottom: 2 }}
                    >
                        {product.product_description}
                    </Typography>

                    {/* INPUT FIELDS */}

                    <TextField
                        label="Quantity"
                        type="number"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        // onChange={onChange}
                        sx={{
                        width: "25%",
                        marginBottom: -5,
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#2F613B" },
                            "&.Mui-focused fieldset": { borderColor: "#2F613B" },
                        },
                        }}
                    />

                    <TextField
                        label="Contact Number"
                        variant="outlined"
                        name="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        // onChange={onChange}
                        sx={{
                        width: "71%",
                        marginLeft: 2,
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#2F603B" },
                            "&.Mui-focused fieldset": { borderColor: "#2F603B" },
                        },
                        }}
                    />

                    {product.modeOfDelivery && product.modeOfDelivery == "delivery" 
                    && <TextField
                        label="Delivery Address"
                        variant="outlined"
                        multiline
                        rows={1}
                        name="deliveryAddress"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        // onChange={onChange}
                        sx={{
                        width: "100%",
                        marginTop: 2,
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#2F603B" },
                            "&.Mui-focused fieldset": { borderColor: "#2F603B" },
                        },
                        }}
                        InputProps={{
                        style: { overflowY: "auto" },
                        }}
                    />}
                    <FormLabel component="legend" sx={{ marginTop: "0.7rem" }}>
                        Mode of Payment
                    </FormLabel>
                    <RadioGroup
                        name = "modeOfPayment"
                        value={modeOfPayment}
                        onChange={(event) => setModeOfPayment(event.target.value)}
                        // onChange={onChange}
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        <FormControlLabel
                        name="modeOfPayment"
                        value="Cash"
                        control={
                            <Radio
                            style={
                                modeOfPayment === "Cash"
                                ? radioStyles.checked
                                : null
                            }
                            />
                        }
                        label="Cash"
                        />
                        {sellerPaymentChannels?.sellerHasOnlinePaymentChannels && (<FormControlLabel
                        name="modeOfPayment"
                        value="Online"
                        control={
                            <Radio
                            style={
                                modeOfPayment === "Online"
                                ? radioStyles.checked
                                : null
                            }
                            />
                        }
                        label="Online"
                        />)}
                    </RadioGroup>
                    </CardContent>
                    <Box
                        sx={{
                        display: "flex",
                        flexDirection:"row",
                        // justifyContent:"center",
                        gap: 2,
                        alignItems: "stretch",
                        width: "100%",
                        padding: 2,
                        }}
                    >
                        <TriggeredDialog
                            triggerComponent={BuyNowBtn}
                            title={"Place Order"}
                            message={"Continue to place this order?"}
                            btnDisplay={0}
                            callback={()=>{
                                executePlaceOrder();
                                // handleClose();
                            }}
                        />
                        <TriggeredDialog
                        triggerComponent={AddToCartBtn}
                        title={"Add To Cart"}
                        message={"Are you sure you want to add this to cart?"}
                        btnDisplay={0}
                        callback={()=>{
                            executeAddToCart();
                        }}
                    />

                    </Box>
                    
                </Box>
                </Card>
            </Paper>

            <Paper
                className={styles.paperCardContainer2}
                elevation={3}
                style={{
                width: "70%",
                maxWidth: "100%",
                margin: "0 auto",
                marginTop: "2rem",
                marginBottom: "5rem",
                borderRadius: "20px",
                }}
            >
                {/* Product Description */}
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                        <TableCell>Product Details</TableCell>
                        <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Product Id</TableCell>
                            <TableCell>{product._id}</TableCell>
                        </TableRow>
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Category: </TableCell>
                            <TableCell>
                            {product.category == "Pre-Sell" ?(<Box
                            sx={{
                                backgroundColor: "#FE8C47",
                                borderRadius: "8px",
                                width: "fit-content",
                                padding: "2px 8px",
                                fontSize: "0.7rem",
                                
                                color: "white",
                            }}
                            >
                            PRE-ORDER
                            </Box>):(
                            <Box
                            sx={{
                                backgroundColor: "#2F613A",
                                borderRadius: "8px",
                                width: "fit-content",
                                padding: "2px 8px",
                                fontSize: "0.7rem",
                                
                                color: "white",
                            }}
                            >
                            Order
                            </Box>
                            )}
                            </TableCell>
                        </TableRow>
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Stocks</TableCell>
                            <TableCell>{product.stocks}</TableCell>
                        </TableRow>
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Minimum Order</TableCell>
                            <TableCell>{product.minimum_order}</TableCell>
                        </TableRow>
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Seller Address</TableCell>
                            <TableCell>{formatWideAddress(seller.address)}</TableCell>
                        </TableRow>
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Delivery Method</TableCell>
                            <TableCell>{product.modeOfDelivery}</TableCell>
                        </TableRow>
                        {product.category=="Pre-Sell" && product.dateOfHarvest && (<TableRow className={styles.alternateRow}>
                            <TableCell>Date of Harvest</TableCell>
                            <TableCell>{formatDate(product.dateOfHarvest, 'll')}</TableCell>
                        </TableRow>)}
                        {product.modeOfDelivery === "pick-up" ? ( //Check if delivery mode pick then display location
                            <TableRow className={styles.alternateRow}>
                            <TableCell>Pickup Location</TableCell>
                            <TableCell>{product.pickup_location}</TableCell>
                            </TableRow>
                        ) : null}
                        <TableRow className={styles.alternateRow}>
                            <TableCell>Closing</TableCell>
                            <TableCell>{timePassed(product.until)}</TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </TableContainer>

            </Paper>
            </Paper>
        </Grid>
        </Grid>
            
        </Dialog>
        
        );

    }




}
