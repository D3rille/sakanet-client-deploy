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



export default function SellModal({ isOpen, onClose, data, loading, error, createProduct }) {

  const {onChange, onSubmit, onClear, values} = useForm(executeCreateProduct,{
    area_limit: "",
    price: 0,
    category: "Sell",
    description: "",
    stocks: 0,
    minimumOrder:0,
    unit:"kg",
    modeOfDelivery:"pick-up",
    pickUpLocation:"",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [file, setFile] = useState(null); //Product Picture
  const [dateOfHarvest, setDateOfHarvest] = useState(null);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleClose = () => {
    onClear()
    setSelectedDate(null);
    setFile(undefined);
    setDateOfHarvest(null);
    onClose();
  }

  //Dropzone Restrictions
   const addProductProps = useDropzone({
    onDrop: handleDrop,
    accept:  {'image/jpeg': ['.jpeg', '.png']},
    maxFiles:1,
  });


  function setMinDate(){
    var today = dayjs(new Date);
    const nextDay = today.add(1, 'day');
    return nextDay;
  }

  async function executeCreateProduct() {

    var photoLink = data.photo;
    if (file) {
      try {
        photoLink = await uploadUserProductPhoto(file);

        if (photoLink) {
          try {
            await uploadUserProductPhoto({
              variables: {
                profile_pic: photoLink,
              },
            });
            console.log('Image uploaded and URL stored in MongoDB.');
          } catch (error) {
            console.error('Error uploading image and storing URL:', error);
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
     }


    createProduct({variables:{
      "product": {
        "category": values.category,
        "itemId": data && data._id ,
        "product_description": values.description,
        "photo": photoLink,
        "price": values.price? parseFloat(values.price):0,
        "stocks": values.stocks? parseInt(values.stocks):0,
        "minimum_order": values.minimumOrder ? parseFloat(values.minimumOrder):0,
        "until":  selectedDate?.toISOString(),
        "area_limit": values.areaLimit ?? "",
        "pickup_location":values.pickUpLocation,
        "dateOfHarvest":dateOfHarvest?.toISOString(),
        "modeOfDelivery": values.modeOfDelivery,
        "unit": values.unit,
      }
    }});
  }

  function allowSubmit(){
    if(!values.price || !values.stocks || !values.minimumOrder || !selectedDate || !values.unit ){
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
 

  if(loading){
    return(
      <>
        <CircularLoading/>
      </>
    );
  }

  if(error){
    console.error(error.message);
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
            overflowY:"hidden",
            maxHeight:"700px",
            width: 600, 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            margin: "auto", 
            padding:"1em",
            // paddingTop: "2rem",
            // paddingRight: "2rem",
            // paddingLeft: "2rem",
            // paddingBottom: "0.85rem",
            backgroundColor: "#FFFEFE",
            borderRadius: "20px",
            boxShadow: 24,
          }}
        >
        <FormControl error={error} >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6">Add New Product</Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ marginRight: "-0.5rem" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{overflowY:"scroll", maxHeight:"700px", paddingInline:"1em", paddingTop:"1em", paddingBottom:"5em"}}>
            <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
              <img style={{
                width:"5vw",
                height:"5vw",
                marginRight:"1em"
              }} src={data.photo}/>
              <Typography>
                {!data.name.tagalog ? data.name.english : `${data.name.tagalog} | ${data.name.english}`} ({data.type})
              </Typography>
            </Box>
          
            <ToggleButtonGroup
              fullWidth
              sx={{
                '& .Mui-selected': { 
                  bgcolor: '#C2E7CB',
                },
                marginBlock:"1em",
              }}
              name="category"
              value={values.category}
              exclusive
              onChange={onChange}
              aria-label="change category"
            >
              <ToggleButton
              name="category" 
              value="Sell" 
              aria-label="Sell"
              sx={{
                color: '#2F613A',
                '&.Mui-selected': {
                  color: '#2F613A',
                }
              }}
              >
                Sell
              </ToggleButton>
              <ToggleButton 
              name="category"
              value="Pre-Sell" 
              aria-label="Pre-Sell"
              sx={{
                color: '#2F613A',
                '&.Mui-selected': {
                  color: '#2F613A',
                }
              }}
              >
                Pre-Sell
              </ToggleButton>
            </ToggleButtonGroup>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  value={values.price}
                  // onChange={(e) => setPrice(e.target.value)}
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
                  // onChange={(e) => setStocks(e.target.value)}
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
            <Grid item xs={12} sx={{marginBlock:"1em"}}>
              <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      name="minimumOrder"
                      value={values.minimumOrder}
                      // onChange={(e) => setMinimumOrder(e.target.value)}
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
                    {data.units && (
                      <Select
                      name="unit"
                      fullWidth
                      value={values.unit}
                      label="Unit"
                      onChange={onChange}
                    >
                      {data.units.map(val=>{
                        return(
                          
                            <MenuItem key ={val} value={val}>{val}</MenuItem>
                          
                            
                        );
                      })}
                    </Select>
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
              // onChange={(e) => setAreaLimit(e.target.value)}
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
              <Grid item xs={5.8} sx={{marginRight:'1em'}} >
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
              <Grid item xs={values.category=="Sell"?12:5.8}>
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
                marginTop:"1em"
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
            {/* Image Dropzone */}
            <Box
              sx={{
                height: '170px',
                marginBottom: '5px',
                border: '2px dashed #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              {...addProductProps.getRootProps()}
            >
              {file ? (
                <>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Product"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '120px',
                      borderRadius: '4px',
                    }}
                  />
                  <Typography variant="caption" style={{ marginTop: '8px' }}>
                    Max size 10mb
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" textAlign="center">
                  Upload Product Photo
                </Typography>
              )}
            </Box>


            <Box
              sx={{
                marginTop: "1rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingBottom: "1rem",
              }}
            >
              <Button
                disabled={!allowSubmit()}
                onClick={onSubmit}
                variant="contained"
                sx={{
                  backgroundColor: "#2E613B",
                  marginTop: "1rem",
                  borderRadius: "12px",
                  "&:hover": { backgroundColor: "#235b2d" },
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
          
          </FormControl>
        </Container>
      </Modal>
    );

  }
}
