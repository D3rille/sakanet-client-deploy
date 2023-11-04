import { useState, useContext} from 'react';
import { Paper, Typography, Button, Avatar, Card, Box, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import AddStock from './AddStocksModal'
import ContributorsList from './ContributorsListModal'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@apollo/client';
import toast from "react-hot-toast";

import {DELETE_PRODUCT_POOL, GET_PRODUCT_POOLS} from "../../graphql/operations/productPool";
import { formatDate } from '../../util/dateUtils';
import { AuthContext } from '../../context/auth';
import {formatToCurrency} from "../../util/currencyFormatter";
import CustomDialog from "../popups/customDialog";


const ProductPoolCard = ({ productData, isAdmin, poolStatusFilter }) => {
    const {user} = useContext(AuthContext);
    const [isAddStockOpen, setAddStockOpen] = useState(false);
    const [isContributorsOpen, setContributorsOpen] = useState(false);
    const [isDialogOpen1, setIsDialogOpen1 ] = useState("");

    const [deleteProductPool] = useMutation(DELETE_PRODUCT_POOL);
    const handleDeleteProductPool = (productPoolId) =>{
      deleteProductPool({
        variables:{
          productPoolId
        },
        refetchQueries:[GET_PRODUCT_POOLS],
        onCompleted:()=>{
          toast("You have deleted a product pool.");
        },
        onError:(error)=>{
          toast.error(error.message);
        }
      })
    }
  
    const handleAddStockOpen = () => {
      setAddStockOpen(true);
    };
  
    const handleAddStockClose = () => {
      setAddStockOpen(false);
    };
  
    const handleContributorsOpen = () => {
      setContributorsOpen(true);
    };
  
    const handleContributorsClose = () => {
      setContributorsOpen(false);
    };

    const productName = productData?.product?.tagalogName? productData?.product?.tagalogName : productData?.product?.englishName;

    return (
        <Paper
            elevation={1}
            sx={{
                position: 'relative',
                padding: 2,
                marginBottom: 2,
                borderRadius: 3,
                boxShadow: '0.6px 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center' }}>
                <Box sx={{position:"absolute",display:"flex", flexDirection:"row", alignItems:"center", top:2, right:20}}>
                  <Typography variant="body2" sx={{ fontWeight:500, padding:2 }}>
                      Stocks: {`${productData?.stocks_contributed}/${productData?.stocks_capacity} ${productData?.unit}`}
                  </Typography>
                  {isAdmin && (<>
                    <IconButton
                      onClick={()=>{
                        setIsDialogOpen1("deletePool");
                        // handleDeleteProductPool(productData._id);
                      }}
                    >
                      <DeleteIcon sx={{fontSize:"1.2rem"}}/>
                    </IconButton>
                  </>)}
                </Box>
                
                <Card 
                    sx={{ 
                        width: 170,
                        minHeight:190,
                        maxheight: 220,
                        padding: 2, 
                        backgroundColor: '#FAF9F6',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', 
                        marginRight: 2,
                        borderRadius: 2.5,
                        boxShadow: '2px 2px 8px rgba(250, 249, 246, 0.6)', 
                    }}
                >
                    <Avatar src={productData?.product.photo} alt={productData.product.englishName} sx={{ width: 100, height: 100, marginBottom: 1 }} /> 
                    <Typography variant="body2" sx={{ marginBottom: 1, fontSize:'0.98em', fontWeight:600 }}>{productName}</Typography>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1, fontSize:'0.89em', fontWeight:520 }}>{`${formatToCurrency(productData?.price)} / ${productData?.unit}`}</Typography>
                </Card>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml:'1rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A', mb:'0.3rem' }}>Pool Id: {productData._id}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A', mb:'0.3rem' }}>Minimum Contribution: {productData.minimum_stocks}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A', mb:'0.3rem' }}>Mode of Collection: {productData.modeOfCollection}</Typography>
                           
                        </Box>
                        <Box sx={{ flexGrow: 4 }}>
                        {productData.modeOfCollection == "drop-off" && (<Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A', mb:'0.3rem' }}>Drop-off Location: {productData?.dropOffLocation}</Typography>)}
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A', mb:'0.3rem' }}>Current Contributors: {productData?.contributor_count ?? 0}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A', mb:'0.3rem' }}>Opened until: {formatDate(productData?.until, "ll")}</Typography>
                        </Box>
                    </Box>
                    {productData?.description && (<Typography variant="body2" sx={{ marginTop: 2, color: '#777777', fontWeight: 500 }}>Note: {productData?.description}</Typography>)}
                </Box>
            </Box>

       <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 'auto',
          padding: '8px',
        }}
      >
        {productData?.myContribution && productData?.myContribution > 0 && (<Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            backgroundColor: '#2E603A',
            '&:hover': {
              backgroundColor: '#286652',
            },
            borderRadius: '18px',
            marginRight: 1,
            minWidth: '100px',
          }}
          onClick={handleAddStockOpen}
        >
          Edit my Contribution
        </Button>)}
        {(!productData?.myContribution || productData?.myContribution <= 0) && (poolStatusFilter != "closed") && (<Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            backgroundColor: '#2E603A',
            '&:hover': {
              backgroundColor: '#286652',
            },
            borderRadius: '18px',
            marginRight: 1,
            minWidth: '100px',
          }}
          onClick={handleAddStockOpen}
        >
          Add Stock
        </Button>)}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{
            borderColor: '#2E603A',
            borderRadius: '18px',
            minWidth: '100px',
            color: '#2E603A',
            '&:hover': {
              borderColor: '#286652',
            },
          }}
          onClick={handleContributorsOpen}
        >
          Contributors
        </Button>
      </Box>

      {/* Add Stock Modal, TODO: missing AddStock */}
      <Dialog open={isAddStockOpen} onClose={handleAddStockClose}>
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent>
          <AddStock onClose={handleAddStockClose} poolId = {productData._id} myContribution={productData?.myContribution}/>
        </DialogContent>
      </Dialog>

      {/* Contributors List Modal,  */}
      {isContributorsOpen && (<Dialog open={isContributorsOpen} onClose={handleContributorsClose}>
        <DialogTitle>Contributors</DialogTitle>
        <DialogContent>
          <ContributorsList poolId = {productData._id} onClose={handleContributorsClose} unit={productData?.unit}/>
        </DialogContent>
      </Dialog>)}

      {isDialogOpen1 =="deletePool" && (
      <CustomDialog
        title={"Delete Product Pool"}
        message={"Do you really want to delete this product pool? If you delete this product pool, all contributions in it will also be deleted. Proceed?"}
        btnDisplay={0}
        openDialog={Boolean(isDialogOpen1)}
        setOpenDialog={setIsDialogOpen1}
        callback={()=>{
          handleDeleteProductPool(productData._id);
        }}
      />
      )}

      
    </Paper>
  );
};

export default ProductPoolCard;
