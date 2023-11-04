import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  TextField,
  Typography,
  Divider,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

import {GET_MARKETPRODUCT_OPTIONS, CREATE_PRODUCT_POOL, GET_PRODUCT_POOLS} from "../../graphql/operations/productPool";


const AddProductPoolModal = ({ open, onClose, poolGroupId}) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(null);
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [dropOff, setDropOff] = useState("");
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [collectionDate, setCollectionDate] = useState(null);
  const [unitOptions, setUnitOptions] = useState(["kg"]);
  const [unit, setUnit] = useState("kg");
  const [modeOfCollection, setModeOfCollection] = useState("pick-up");
  const [stock_capacity, setStock_capacity] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("none");

  const{data:marketProductData} = useQuery(GET_MARKETPRODUCT_OPTIONS,{
    onError:(error)=>{
      toast.error(error.message);
    }
  });

  const [createProductPool] = useMutation(CREATE_PRODUCT_POOL);

  const handleCreateProductPool = async() =>{
    createProductPool({
      variables:{
        "productPoolInput": {
          "collectionDate": collectionDate,
          "description": note,
          "minimum_stocks":parseFloat(minimumContribution),
          "modeOfCollection": modeOfCollection,
          "poolGroup": poolGroupId,
          "price": parseFloat(price),
          "productId": selectedProductId,
          "stocks_capacity": parseFloat(stock_capacity),
          "unit": unit,
          "until": deadline,
          "dropOffLocation": dropOff
        }
      },
      refetchQueries:[GET_PRODUCT_POOLS],
      onCompleted:()=>{
        toast.success("Successfully created a product pool.");
        // reset before closing
        setCollectionDate(null);
        setNote("")
        setMinimumContribution(0);
        setModeOfCollection("");
        setUnit("kg");
        setPrice(0)
        setSelectedProductId(null);
        setStock_capacity(0);
        setDeadline(null);

        onClose();
      },
      onError:(error)=>{
        toast.error(error.message);
        console.log(error);
      }
    });
    

    // onClose();
  }

  let inputValidation = false;
  const reachedRequiredInputs = selectedProductId && stock_capacity && price && minimumContribution && unit && deadline && collectionDate;
  if(modeOfCollection == "drop-off" && dropOff && reachedRequiredInputs){
    inputValidation = true;
  } else if(modeOfCollection == "pick-up" && reachedRequiredInputs){
    inputValidation= true
  }

 
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiPaper-root": { borderRadius: '25px', padding: '2rem' } }}
    >
      <DialogTitle sx={{fontWeight:'bold'}}>Add Product Pool</DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{display:"flex", justifyContent:"space-between"}}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={marketProductData?.getMarketProductOptions ?? []}
            sx={{ padding:0, width:"65%"}}
            autoHighlight
            // value={selectedProductId}
            onChange={(event, newValue)=>{
              if(newValue){
                setSelectedProductId(newValue?._id);
                setUnitOptions(newValue?.units);
              }
            }}
            getOptionLabel={(option) => option?.name}
            renderInput={(params) => <TextField {...params} label="Product" />}
          />
          <TextField 
            label="Stock Capacity" 
            variant="outlined" 
            value={stock_capacity}
            onChange={(event)=>setStock_capacity(event.target.value)}
            sx={{width:"30%"}}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box 
            component="input" 
            type="number" 
            placeholder="Price" 
            value={price}
            onChange={(event)=>setPrice(event.target.value )}
            sx={{ width: '35%', height: '2.5rem', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: 'transparent', color: '#2D2C2D' }} 
          />
          <Box 
            component="input" 
            type="number"  
            placeholder="Minimum Contribution"
            value={minimumContribution} 
            onChange={(event)=>setMinimumContribution(event.target.value)}
            sx={{ width: '35%', height: '2.5rem', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: 'transparent', color: '#2D2C2D' }} 
          />
          
          <Select
            value={unit}
            onChange={(event)=>{setUnit(event.target.value)}}
            sx={{width:"20%", height:"2.5rem"}}
          >
            {unitOptions && unitOptions.map((unit)=>{
              return(
                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
              )
            }
            )}
            {/* <MenuItem value={"bundle"}>bundle</MenuItem> */}
            
          </Select>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <DatePicker
            label="Set Deadline"
            sx={{ width: '48%', marginTop: '1rem', '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2E603A' } }}
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            slotProps={{ textField: { variant: 'outlined' } }}
            // renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="Set Collection Date"
            sx={{ width: '48%', marginTop: '1rem', '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2E603A' } }}
            value={collectionDate}
            onChange={(newValue) => setCollectionDate(newValue)}
            slotProps={{ textField: { variant: 'outlined' } }}
            // renderInput={(params) => <TextField {...params} fullWidth />}
          />

        </Box>
        </LocalizationProvider>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box 
            component="input"  
            placeholder="Drop-off Location" 
            value={dropOff}
            onChange={e=>setDropOff(e.target.value)}
            disabled={modeOfCollection == "pick-up"} 
            sx={{ width: '48%', height: '2.5rem', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: 'transparent', color: '#2D2C2D' }} 
          />
          <Box width="48%" display="flex" alignItems="center" backgroundColor="#f5f5f5" paddingInline="1em" textAlign="center" borderRadius="5px">
            <Typography variant="subtitle1" component="span">
              Mode of Collection:
            </Typography>
            <RadioGroup
              row
              aria-label="pickup"
              name="pickup-radio-buttons-group"
              // defaultValue="yes"
              value={modeOfCollection}
              onChange={e => setModeOfCollection(e.target.value)}
              sx={{ '& .Mui-checked': { color: '#2E603A' }, "& .MuiSvgIcon-root": { width: '0.8em', height: '0.8em' }, ml: 2 }}
            >
              <FormControlLabel value="pick-up" control={<Radio />} label="Pick-up" />
              <FormControlLabel value="drop-off" control={<Radio />} label="Drop-off" />
            </RadioGroup>
          </Box>
        </Box>

        <TextField
          value={note}
          onChange={e=>setNote(e.target.value)}
          placeholder="Note.."
          multiline
          rows={4}
          sx={{ width: '100%', mt: 2, color: '#2D2C2D' }}
        />

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: '#2E603A', 
              color: '#2E603A', 
              mr: 2, 
              '&:hover': { borderColor: '#286652', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              borderRadius: '13px'
            }} 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#2E603A', 
              color: '#fff', 
              '&:hover': { backgroundColor: '#286652' },
              borderRadius: '13px'
            }}
            onClick={()=>{
              handleCreateProductPool()

            }}
            disabled={modeOfCollection == "drop-off" && !dropOff}
          >
            Add Pool
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductPoolModal;
