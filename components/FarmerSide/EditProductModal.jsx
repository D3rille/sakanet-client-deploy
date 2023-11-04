import React, { useState } from "react";
import {
  Container,
  Modal,
  Select,
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CircularLoading from "../circularLoading";
import {  uploadUserProductPhoto } from "../../util/imageUtils";
import { useForm } from "../../util/hooks";
import { useDropzone } from 'react-dropzone';
import {useMutation} from "@apollo/client";
import toast from "react-hot-toast";

import { 
  EDIT_PRODUCT, 
  // DELETE_PRODUCT, 
  CLOSE_PRODUCT, 
  REOPEN_PRODUCT, 
  GET_MY_PRODUCTS 
} from "../../graphql/operations/product";
import CustomDialog from "../popups/customDialog";



export default function EditProductModal({ isOpen, onClose, data, productStatus, currentPage, selectedCategory }) {
  const {onChange, onSubmit, onClear, values} = useForm(()=>{},{
    category: data?.category,
    area_limit: data?.area_limit ?? "",
    price: data?.price ?? 0,
    description: data?.product_description ?? "",
    stocks: data?.stocks ?? 0,
    minimumOrder: data?.minimum_order ?? 0,
    unit: data?.unit ?? "kg",
    modeOfDelivery: data?.modeOfDelivery ?? "pick-up",
    pickUpLocation: data?.pickUpLocation ?? "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOfHarvest, setDateOfHarvest] = useState(null);
  const [openDialog, setOpenDialog] = useState("");

  const [editProduct] = useMutation(EDIT_PRODUCT);
  const [closeProduct] = useMutation(CLOSE_PRODUCT);
  const [reopenProduct] = useMutation(REOPEN_PRODUCT);

  const handleEditProduct = () =>{
    editProduct({
      variables:{
        "productId": data?._id,
        "product": {
          "category": data?.category,
          "product_description": values.description,
          "price": values.price,
          "stocks": values.stocks,
          "minimum_order": values.minimumOrder,
          "until": selectedDate?.toISOString(),
          "dateOfHarvest": dateOfHarvest?.toISOString(),
          "area_limit": values.area_limit,
          "modeOfDelivery": values.modeOfDelivery,
          "pickup_location": values.pickUpLocation,
          "unit": values.unit
        }
      },
      refetchQueries:[GET_MY_PRODUCTS],
      onCompleted:()=>{
        toast.success("Successfully edited product details");
      },
      onError:(error)=>{
        toast.error(error.message);
      }
    })
  }
  const handleCloseProduct = () =>{
    closeProduct({
      variables:{
        productId:data?._id
      },
      refetchQueries:[
        {
          query:GET_MY_PRODUCTS,
          variables:{
            category:selectedCategory,
            limit:8,
            page:currentPage,
            status:"closed"
          }
        },
        {
          query:GET_MY_PRODUCTS,
          variables:{
            category:selectedCategory,
            limit:8,
            page:currentPage,
            status:"open"
          }
        }
      ]
    })
  }
  const handleReopenProduct = () =>{
    reopenProduct({
      variables:{
        "productId": data?._id,
        "product": {
          "category": data?.category,
          "product_description": values.description,
          "price": values.price,
          "stocks": values.stocks,
          "minimum_order": values.minimumOrder,
          "until": selectedDate?.toISOString(),
          "dateOfHarvest": dateOfHarvest?.toISOString(),
          "area_limit": values.area_limit,
          "modeOfDelivery": values.modeOfDelivery,
          "pickup_location": values.pickUpLocation,
          "unit": values.unit
        }
      },
      refetchQueries:[GET_MY_PRODUCTS],
      onCompleted:()=>{
        toast.success("You reopened the product")
      }
    })
  }

  const handleClose = () => {
    onClear()
    setSelectedDate(null);
    setDateOfHarvest(null);
    onClose();
  }

  function setMinDate(){
    var today = dayjs(new Date);
    const nextDay = today.add(1, 'day');
    return nextDay;
  }


  function allowSubmit(){
    if(!values.price || !values.stocks || !values.minimumOrder || !selectedDate ){
      return false;

    } 
    if(values.category=="Pre-Sell" && !dateOfHarvest){
      return false;
    }
    if(values.modeOfDelivery=="pick-up" && !values.pickUpLocation){
      return false;
    }

    return true;
  }
 
  if(data){

    return (
      <Modal
        open={isOpen}
        onClose={handleClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      
        <Container
          sx={{
            // overflow:"auto",
            maxHeight:"700px",
            width: 600, 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            margin: "auto", 
            paddingTop: "1rem",
            paddingRight: "2rem",
            paddingLeft: "2rem",
            paddingBottom: "0.85rem",
            backgroundColor: "#FFFEFE",
            borderRadius: "20px",
            boxShadow: 24,
          }}
        >
        <FormControl>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6">Edit Product Details</Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ marginRight: "-0.5rem" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            <img style={{
              width:"5vw",
              height:"5vw",
            }} src={data?.photo ? data?.photo : data?.item?.photo}/>
            <Typography>
              {!data.item.tagalogName ? data.item.englishName : `${data.item.tagalogName} | ${data.item.englishName}`} ({data.item.product_type})
            </Typography>
          </Box>

          <Box sx={{overflowY:"scroll", padding:"2em", maxHeight:"70vh"}}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  value={values.price}
                  onChange={onChange}
                  fullWidth
                  label="Price"
                  type="number"
                  variant="outlined"
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2E613B",
                    },
                    "&.Mui-focused & .MuiInputLabel-outlined": {
                      color: "#2E613B",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="stocks"
                  value={values.stocks}
                  onChange={onChange}
                  fullWidth
                  label="Stocks"
                  type="number"
                  variant="outlined"
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2E613B",
                    },
                    "&.Mui-focused & .MuiInputLabel-outlined": {
                      color: "#2E613B",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{paddingTop:"1em"}}>
              <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      name="minimumOrder"
                      value={values.minimumOrder}
                      onChange={onChange}
                      fullWidth
                      label="Minimum Order per unit"
                      type="number"
                      variant="outlined"
                      sx={{
                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2E613B",
                        },
                        "&.Mui-focused & .MuiInputLabel-outlined": {
                          color: "#2E613B",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {data?.unit && (
                      <TextField
                      label="Unit"
                      defaultValue={data.unit}
                      InputProps={{
                        readOnly: true,
                      }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={6}>
                  <FormLabel id="Mode-Of-Delivery">Select mode of delivery</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="Mode-Of-Delivery"
                      name="modeOfDelivery"
                      value={values.modeOfDelivery}
                      onChange={onChange}
                    >
                      <FormControlLabel value="pick-up" control={<Radio />} label="Pick-Up" />
                      <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                    </RadioGroup>
                  </Grid>
              </Grid>

            </Grid>
            <TextField
            name="areaLimit"
              value={values.areaLimit}
              onChange={onChange}
              fullWidth
              label="Area Limit"
              variant="outlined"
              sx={{
                marginBottom: "1rem",
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E613B",
                },
                "&.Mui-focused & .MuiInputLabel-outlined": {
                  color: "#2E613B",
                },
              }}
            />
            <Grid container space={2}>
              {values.category=="Pre-Sell" && (
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    minDate={setMinDate()}
                    label="Date of Harvest"
                    sx={{
                      width: "100%",
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2E613B",
                      },
                      "&.Mui-focused & .MuiInputLabel-outlined": {
                        color: "#2E613B",
                      },
                    }}
                    value={dateOfHarvest}
                    onAccept={(newValue) => setDateOfHarvest(newValue)}
                  />
                </LocalizationProvider>
              </Grid>)}
              <Grid item xs={values.category=="Sell"?12:6} sx={{marginBottom:"1em"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    minDate={setMinDate()}
                    label="Set Time Limit"
                    sx={{
                      width: "100%",
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2E613B",
                      },
                      "&.Mui-focused & .MuiInputLabel-outlined": {
                        color: "#2E613B",
                      },
                    }}
                    value={selectedDate}
                    onAccept={(newValue) => setSelectedDate(newValue)}
                  />
                </LocalizationProvider>
              </Grid>

            </Grid>
    
            {values.modeOfDelivery=="pick-up" && (
            <TextField
              name="pickUpLocation"
              value={values.pickUpLocation}
              onChange={onChange}
              fullWidth
              label="Pick-up Location"
              variant="outlined"
              sx={{
                marginBottom: "1rem",
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E613B",
                },
                "&.Mui-focused & .MuiInputLabel-outlined": {
                  color: "#2E613B",
                },
              }}
            />
            )}
    
            <TextField
            name="description"
              value={values.description}
              onChange={onChange}
              fullWidth
              label="Description"
              multiline
              rows={4}
              // rowsMax={4}
              variant="outlined"
              sx={{
                marginTop: "1rem",
                marginBottom: "1rem",
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E613B",
                },
                "&.Mui-focused & .MuiInputLabel-outlined": {
                  color: "#2E613B",
                },
              }}
            />

            <Box
              sx={{
                marginTop: "1rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingBottom: "1rem",
              }}
            >
              {productStatus == "open" && (<Button 
                onClick={()=>{setOpenDialog("closeProduct");}}
                variant="outlined"
                sx={{
                  color:"#2E613B",
                  borderColor: "#2E613B",
                  marginInline:"0.5em",
                  marginTop: "1rem",
                  borderRadius: "12px",
                  "&:hover": { backgroundColor: "grey", color:"white", borderColor:"white" },
                }}
              >
                Close Product
              </Button>)}
              <Button
                disabled={!allowSubmit()}
                onClick={()=>{
                  if(productStatus == "open"){
                    handleEditProduct()
                  } else {
                    handleReopenProduct();
                  }
                }}
                variant="contained"
                sx={{
                  marginInline:"0.5em",
                  backgroundColor: "#2E613B",
                  marginTop: "1rem",
                  borderRadius: "12px",
                  "&:hover": { backgroundColor: "#235b2d" },
                }}
              >
                {productStatus == "open" ? "Edit Product" : "Reopen Product"}
              </Button>
            </Box>
          </Box>
         
          </FormControl>
          {openDialog == "closeProduct" && productStatus == "open" && (<CustomDialog
          openDialog={Boolean(openDialog)}
          setOpenDialog={setOpenDialog}
          title={"Close Product"}
          message={"Close product? This will no longer be visible to buyers. To display it again, you may need to reopen the product. Proceed?"}
          btnDisplay={0}
          callback={()=>{
            handleCloseProduct();
            handleClose()
          }}
          />)}
        </Container>
      </Modal>
    );

  }
}
