import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import "react-widgets/styles.css";
import { styled } from "@mui/system";
import CircularLoading from  "../circularLoading";
import CartItem from "./CartItem";
import { useMutation } from "@apollo/client";
import { CHECKOUT_CART, DELETE_CARTITEM, GET_CART_ITEMS } from "@/graphql/operations/cart";
import toast from "react-hot-toast";
// import TriggeredDialog from "../popups/confirmationDialog";
import CustomDialog from "../popups/customDialog";



const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  "&.MuiCheckbox-colorSecondary.Mui-checked": {
    color: "#2E613B",
  },
}));

//TODO: Place the checkout function in props
const CartModal = ({ open, handleClose, getCartItemsData, getCartItemsLoading  }) => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [checkOutItems, setCheckOutItems] = useState([]);

  useEffect(()=>{
    if(getCartItemsData){
      setProductsOnLoad(getCartItemsData?.getCartItems ?? []);
    }
  }, [getCartItemsData]);

  const [checkOut, {loading:checkOutLoading}] = useMutation(CHECKOUT_CART,{
    refetchQueries:[GET_CART_ITEMS],
    onCompleted:()=>{
      toast.success("Checkout Successful");
    }, 
    onError:(error)=>{
      toast.error(error.message);
      console.log(error);
    }
  });

  const [deleteItem, {loading:deleteItemLoading}] = useMutation(DELETE_CARTITEM,{
    refetchQueries:[GET_CART_ITEMS],
    onError:(error)=>{
      toast.error(error.message);
      console.log(error);
    }
  });


  const handleCheckChange = (index) => {
    let updatedProducts = [...products];
    updatedProducts[index].checked = !updatedProducts[index].checked;
    setProducts(updatedProducts);
    getTotalPrice();
  };

  const setProductsOnLoad = (productsData) =>{
    setProducts(productsData.map((product) => {
      return {
        ...product,
        checked: false
    }
    }))
  }

  const updateQuantity = (index, value) =>{
    products[index].quantity=value;
  }

  const handleDelete = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const getTotalPrice = () => {
    let sum =0;
    products.map((product)=>{
      if(product.checked){
        sum += product.quantity * product.price;
      }
    })
    setTotalPrice(sum);
  };

  // let checkOutInput = [];

  const setCheckOutInput = () => {
    let input;
    products.map((product)=>{
      let items = checkOutItems;
      if(product.checked){
        input={
          id:product._id,
          quantity:product.quantity,
          productId:product.productId,
          sellerId: product.seller.id
        }
        items.push(input);
        setCheckOutItems(items);
      }
    })
  }

  const executeCheckOut = () =>{
    setCheckOutInput();
    checkOut({
      variables:{
        "cartItems": checkOutItems
        
      }, 
      onCompleted:()=>{
        setTotalPrice(0);
      }
    });
    for (let index = 0; index < products.length; index++) {
      if(products[index].checked){
        handleDelete(index);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={()=>{
        products?.map(prod =>{
          prod.checked = false;
        });
        setCheckOutItems([]);
        setTotalPrice(0);
        handleClose();
      }}
      aria-labelledby="cart-modal-title"
      aria-describedby="cart-modal-description"
    >
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          maxHeight: "80vh",
          backgroundColor: "#F8F9F8",
          boxShadow: 24,
          borderRadius: 20,
          outline: "none",
          padding: "2rem",
        }}
      >
        <Toolbar>
        <Typography
          id="cart-modal-title"
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bolder" }}
        >
          My Cart
        </Typography>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" >
        </Typography>
        <IconButton
            edge="start"
            color="inherit"
            onClick={()=>{
              products?.map(prod =>{
                prod.checked = false;
              });
              setCheckOutItems([]);
              setTotalPrice(0);
              handleClose();
            }}
            aria-label="close"
        >
            <CloseIcon sx={{color:"red"}} />
        </IconButton>
        </Toolbar>
        
        {getCartItemsLoading  && (<CircularLoading/>)}
        {checkOutLoading  && (<CircularLoading/>)}
        {!getCartItemsData && (
          <Typography>
            No Cart Items
          </Typography>
        )}
        {getCartItemsData && (
        <TableContainer
          style={{ flex: 1, maxHeight: "60vh", overflowY: "auto" }}
        >
          <Table sx={{ minWidth: 300 }} aria-label="cart table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell style={{ width: "50%" }}>Product</TableCell>
                <TableCell style={{ width: "20%" }}>Quantity</TableCell>
                <TableCell style={{ width: "15%" }}>Price</TableCell>
                <TableCell style={{ width: "15%" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                   <TableCell padding="checkbox">
                    <CustomCheckbox
                      color="secondary"
                      checked={product.checked}
                      onChange={() => handleCheckChange(index)}
                    />
                  </TableCell>
                  <CartItem
                    itemIndex={index}
                    product={product}
                    updateQuantity={updateQuantity}
                    handleDelete={handleDelete}
                    getTotalPrice={getTotalPrice}
                    deleteItem={deleteItem}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
        <div
          style={{
            display:"flex",
            justifyContent:"start", 
            marginTop: "1rem",
          }}
        >
          <Typography variant="h6">Total: ₱{totalPrice}</Typography>
        </div>

        <div
          style={{
            alignSelf: "flex-end",
            // marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {/* <Typography variant="h6">Total: ₱{totalPrice}</Typography> */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              marginTop: "1rem",
            }}
          >
            <div>
              <Button
                variant="outlined"
                style={{
                  borderColor: "#2F9C65",
                  color: "#2F9C65",
                  marginRight: "10px",
                }}
                onClick={()=>{
                  products?.map(prod =>{
                    prod.checked = false;
                  });
                  setCheckOutItems([]);
                  setTotalPrice(0);
                  handleClose();
                }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#2F9C65",
                  color: "white",
                }}
                
                onClick={()=>{
                  setOpenDialog(true);
                }}
              >
                  Checkout
              </Button>
              <CustomDialog
                  openDialog={openDialog}
                  setOpenDialog = {setOpenDialog}
                  title={"Checkout"}
                  message={"Check out selected items?"}
                  btnDisplay={0}
                  callback={executeCheckOut}
              />
              
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CartModal;
