import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "react-widgets/styles.css";
import CustomDialog from "../popups/customDialog";

const CartItem = ({...props}) => {
  const {product, itemIndex, updateQuantity, handleDelete, getTotalPrice, deleteItem } = props;
  const [quantity, setQuantity] = useState(product.quantity);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(()=>{
    updateQuantity(itemIndex, quantity=="" ? 0:parseFloat(quantity));
    getTotalPrice();
  }, [quantity]);

  return(
    <>
      <TableCell>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={product?.photo}
            alt="Product"
            width={50}
            height={50}
            layout="fixed"
          />
          <div style={{ marginLeft: 10 }}>
            <Typography
              variant="body2"
              color="textPrimary"
              sx={{ marginLeft: 2 }}
            >
              {product.marketProductName}
            </Typography>

            <Accordion
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:before": {
                  opacity: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  "&.Mui-expanded": {
                    minHeight: "inherit",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  style={{ fontSize: "0.8rem" }}
                >
                  More Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ flexDirection: "column", paddingTop: 0 }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 0 }}
                >
                  Seller: {product.seller.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 0 }}
                >
                  Type: {product.type}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 0 }}
                >
                  Mode Of Delivery: {product.modeOfDelivery}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 0 }}
                >
                  Mode Of Payment: {product.modeOfPayment}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <TextField
        type="number"
        style={{width:"80px"}}
        value={quantity}
        onChange={(e)=>{
          getTotalPrice();
          setQuantity(e.target.value)
        }}
        />
      </TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>
        <IconButton onClick={() => {
          setOpenDialog(true)
          }}>
          <DeleteIcon />
        </IconButton>
        <CustomDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          title={"Delete Cart Item"}
          message={"Are you sure you want to remove this product from your cart?"}
          btnDisplay={0}
          callback={()=>{
              deleteItem({variables:{
                "cartItemId":product._id
              }});
              handleDelete(itemIndex);
          }}
        />
      </TableCell>
    </>
      
                

  );

}

export default CartItem;