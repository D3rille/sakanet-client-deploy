import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  TextField,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useMutation} from "@apollo/client";
import toast from "react-hot-toast";
import DeleteIcon from '@mui/icons-material/Delete';

import { ADD_STOCKS, GET_CONTRIBUTORS, GET_PRODUCT_POOLS, DELETE_CONTRIBUTION } from '../../graphql/operations/productPool';
import CustomDialog from '../popups/customDialog';

const AddStocksModal = ({ onClose, poolId, myContribution}) => {
  const [quantity, setQuantity] = useState(myContribution ?? 0);
  const [unit, setUnit] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState("");

  const [addStock] = useMutation(ADD_STOCKS);

  const handleAddStocks = () =>{
    addStock({
      variables:{
        quantity: quantity,
        productPoolId:poolId
      },
      refetchQueries:[GET_PRODUCT_POOLS, GET_CONTRIBUTORS],
      onCompleted:()=>{
        let message = myContribution ? "Successfully edited contribution.":"You have successfully contributed added stocks.";
        toast.success(message);
      },
      onError:(error)=>{
        toast.error(error?.message);
      }
    }).catch((error)=>{
      toast.error(error);
    }).then(()=>{
      onClose();
    })
  };

  const [deleteContribution] = useMutation(DELETE_CONTRIBUTION);

  const handleDeleteContribution = () =>{
    deleteContribution({
      variables:{
        poolId
      },
      refetchQueries:[GET_CONTRIBUTORS, GET_PRODUCT_POOLS],
      onCompleted:()=>{
        toast.success("You removed your contribution");
      },
      onError:(error)=>{{
        toast.error(error.message);
      }}
    })
  }

  const handleQuantityChange = (e) => {
    setQuantity(parseFloat(e.target.value));
    // const value = parseInt(e.target.value);
    // if (!isNaN(value) && value >= 0) {
    //   setQuantity(value);
    // }
  };

  const handleAddQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleRemoveQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  // const handleAddStock = () => {
  //   onClose();
  // };

  return (
    <Dialog open={true} onClose={onClose} PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle fontWeight="bold">Add Stock</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>Quantity: </Typography> {/* Add margin */}
          <TextField
            fullWidth
            variant="outlined"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ style: { borderColor: '#2E603A' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start" onClick={handleRemoveQuantity}>
                    <RemoveIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleAddQuantity}>
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          {myContribution && (
          <IconButton
            onClick={()=>{
              setIsDialogOpen("deleteContribution");
            }}
          >
            <DeleteIcon/>
          </IconButton>
          )}
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#2E603A',
                color: '#fff',
                '&:hover': { backgroundColor: '#286652' },
                borderRadius: '13px',
              }}
              onClick={handleAddStocks}
            >
              {myContribution ? "Save":"Add"}
            </Button>
            <Button
              sx={{
                borderColor: '#2E603A',
                color: '#2E603A',
                mr: 2,
                '&:hover': {
                  borderColor: '#286652',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '13px',
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
      {isDialogOpen == "deleteContribution" &&(
        <CustomDialog
          title={"Delete Contribution"}
          message={"Delete your contribution to this pool?"}
          btnDisplay={0}
          openDialog={Boolean(isDialogOpen)}
          setOpenDialog={setIsDialogOpen}
          callback={()=>{
            handleDeleteContribution();
          }}
        />
      )}
    </Dialog>
  );
};

export default AddStocksModal;
