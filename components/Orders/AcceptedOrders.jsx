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
import {useRouter} from "next/router";
import CustomDialog from "../popups/customDialog";
import { Waypoint } from "react-waypoint";

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

export default function AcceptedOrders({...props}) {
  const {orders, role, handleUpdateStatus, handleGetMoreOrders}=props;
  const [openDialog, setOpenDialog] = useState(false);


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
            <React.Fragment key={index}>
              <StyledTableRow >
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
                  <div>
                    {role =="FARMER"? (<Button
                      variant="contained"
                      size="medium"
                      sx={{
                        borderRadius: "20px",
                        backgroundColor: "#2E603A",
                        color: "#FFF",
                        mr: 1,
                        alignItems: "center",
                        "&:hover": {
                          backgroundColor: "#FE8C47",
                        },
                        width: "75px",
                        height: "20px",
                        fontSize: "0.6rem",
                      }}
                      onClick={()=>{
                        setOpenDialog(true);
                      }}
                    >
                      Complete
                    </Button>):(
                    
                    <Typography sx={{color:"green"}}>
                      Preparing Order
                    </Typography>
                    )}
                    </div>
                    <CustomDialog
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      title={"Complete Order"}
                      message={"Mark this order as complete?"}
                      btnDisplay={0}
                      callback={() => {
                        handleUpdateStatus(order._id, "Accepted", "For Completion", order?.buyer?.id, order?.modeOfPayment );
                      }}
                    />
                </TableCell>
                <TableCell>
                    <TriggeredDialog
                    triggerComponent={More}
                    title={"Order Details"}
                    message={orderDetails(order)}
                    btnDisplay={0}
                    />
                </TableCell>
              </StyledTableRow>
              {index == orders.length - 1 && (<Waypoint onEnter={()=>{handleGetMoreOrders()}}/>)}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
