import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import TriggeredDialog from "../popups/confirmationDialog";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {timePassed} from "../../util/dateUtils";
import SmsIcon from '@mui/icons-material/Sms';
import {useRouter} from "next/router";
import CustomDialog from "../popups/customDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#F4F4F4",
}));

const StyledOrderIdCell = styled(StyledTableCell)({
  width: "20%",
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

const More = (handleClickOpen) =>{
  return(
    <IconButton
      onClick={()=>{
        handleClickOpen();
      }}
    >
      <MoreVertIcon/>
    </IconButton>
  );
}

export default function ForCompletionOrders({...props}) {
  const {orders, role, handleUpdateStatus, handleReturnStock}=props;
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState("");

  //Details of the Order upon clicking More icon
  const orderDetails=(order)=>{
    
    return(
      <>
        <Typography align="left">
          {`Placed: ${timePassed(order?.createdAt)}`}
        </Typography>
        <Typography align="left">
          {`Product Id: ${order?.productId}`}
        </Typography>
        {role=="FARMER"?(
          <Typography align="left">
            {`Buyer: ${order?.buyer.name}`}
          </Typography>
        ):(
          <Typography align="left">
            {`Seller: ${order?.seller.name}`}
          </Typography>
        )}
        <Typography align="left">
          {`Mode of Payment: ${order?.modeOfPayment}`}
        </Typography>
        <Typography align="left">
          {`Type: ${order?.type}`}
        </Typography>
      </>
      );
         
  }
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "90%",
        borderRadius: "20px",
        elevation: 4,
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "column",
        maxHeight:'65vh',
        overflow: "auto"
      }}
    >
      
      <Table>
        <TableHead>
          <TableRow>
            <StyledOrderIdCell> Type </StyledOrderIdCell>
            <StyledOrderIdCell>Order Id </StyledOrderIdCell>
            <StyledTableCell>Product</StyledTableCell>
            {/* <StyledTableCell>{role=="FARMER"?"Buyer":"Seller"}</StyledTableCell> */}
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Total</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <StyledTableRow key={index}>
              <TableCell>
                {order.type == "Pre-Order"?(
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
                    PRE-ORDER
                  </Box>
                ):(
                  <Box
                  sx={{
                    backgroundColor: "#2F603B",
                    borderRadius: "8px",
                    width: "fit-content",
                    padding: "2px 8px",
                    fontSize: "0.7rem",
                    
                    color: "white",
                  }}
                  >
                    ORDER
                  </Box>
                )}
              </TableCell>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.marketProductName}</TableCell>
              {/* <TableCell>{role=="FARMER"?order.buyer.name:order.seller.name}</TableCell> */}
              <TableCell>{order.quantity}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>₱{order.totalPrice}</TableCell>
              <TableCell>
                {role == "BUYER" && order.sellerResponse=="completed" && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "#2E603A",
                      color: "#FFF",
                      mr: 1,
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "#FE8C47",
                      },
                      width: "auto",
                      height: "20px",
                      fontSize: "0.6rem",
                    }}
                    onClick={()=>{
                      handleUpdateStatus(order._id, "For Completion", "Completed", null, false)
                    }}
                  >
                    {/* {role=="FARMER" ? "Completed": "Received Order"} */}
                    Received Order
                  </Button>
                )}
                  {role=="FARMER" && order.sellerResponse == "completed" && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        backgroundColor: "#2E603A",
                        color: "#FFF",
                        mr: 1,
                        alignItems: "center",
                        "&:hover": {
                          backgroundColor: "#FE8C47",
                        },
                        width: "auto",
                        height: "20px",
                        fontSize: "0.6rem",
                      }}
                      onClick={()=>{
                        setOpenDialog("restock");
                      }}
                    >
                      Return to Stock ?
                    </Button>
                  )}
                  {openDialog == "restock" && (<CustomDialog
                    openDialog={Boolean(openDialog)}
                    setOpenDialog={setOpenDialog}
                    title={"Return stock?"}
                    message={`Are you sure you want to return stock? This will delete the record of the order on both buyer and seller side.
                    Returning a stock will restock your product offering, regardless
                    whether the product is closed or open except if the product was already deleted. Proceed? 
                    `}
                    btnDisplay={0}
                    callback={()=>{
                      handleReturnStock(order?._id, order?.productId);
                    }}
                  />)}

              </TableCell>
              <TableCell>
                <div style={{display:"flex", flexDirection:"row"}}>
                 
                    <IconButton
                    onClick={()=>{
                      if(role == "FARMER"){
                        router.push(`/Chats?userId=${order?.buyer?.id}`);
                      } else{
                        router.push(`/Chats?userId=${order.seller.id}`);
                      }
                    }}
                    >
                      <SmsIcon/>
                    </IconButton>
                  
                  <TriggeredDialog
                  triggerComponent={More}
                  title={"Order Details"}
                  message={orderDetails(order)}
                  btnDisplay={0}
                  />

                </div>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
