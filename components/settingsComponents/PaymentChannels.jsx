import React, { useState, useEffect } from "react";
import {
  TextField,
  Divider,
  Button,
  Typography,
  IconButton,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import {useSubs} from "../../context/SubscriptionProvider";

import PaymentModal from "./PaymentModal";

const PaymentChannelsContainer = styled("div")({
  paddingTop: "1rem",
  margin: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "flex-start",
  minHeight: "70vh",
  maxHeight: "100vh",
});

const HeaderContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
});

const AddButtonContainer = styled("div")({
  marginTop: "1rem",
  alignSelf: "flex-end",
});

const StyledIconButton = styled(IconButton)({
  background: "#2E603A",
  color: "#ECECED",
  transition: "width 0.8s, background-color 0.5s",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  padding: "12px",
  "&:hover": {
    background: "#ECECED",
    borderRadius: "24px",
    width: "auto",
    paddingRight: "8px",
    paddingLeft: "12px",
    "& .MuiSvgIcon-root": {
      color: "#2E603A",
    },
    "& .hover-text": {
      display: "inline",
      color: "#2E603A",
      fontWeight: "bolder",
      fontSize: "15px",
    },
  },
});

const HoverText = styled("span")({
  display: "none",
  marginLeft: "8px",
  verticalAlign: "middle",
});

const PaymentBox = styled("div")({
  margin: "1rem 0",
  padding: "0.5rem",
  border: "1px solid #2E603A",
  borderRadius: "5px",
  cursor: "pointer",
  width: "300px",
});

const PaymentChannels = () => {
  const {profile} = useSubs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentChannels, setPaymentChannels] = useState([]);
  const [channelToEdit, setChannelToEdit] = useState(null);
  // const [editingIndex, setEditingIndex] = useState(null);

  useEffect(()=>{
    if(profile){
      setPaymentChannels(profile?.profile?.payment_channels);
    }
  }, [profile])

  const onBoxClick = (channel) => {
    setChannelToEdit(channel);
    setIsModalOpen(true);
  };

  // const addOrEditPaymentChannel = (channel, details) => {
  //   if (editingIndex !== null) {
  //     const updatedChannels = [...paymentChannels];
  //     updatedChannels[editingIndex] = { channel, details };
  //     setPaymentChannels(updatedChannels);
  //     setEditingIndex(null);
  //   } else {
  //     setPaymentChannels((prev) => [...prev, { channel, details }]);
  //   }
  //   setIsModalOpen(false);
  // };

  // const onRemove = () => {
  //   if (editingIndex !== null) {
  //     const updatedChannels = [...paymentChannels];
  //     updatedChannels.splice(editingIndex, 1);
  //     setPaymentChannels(updatedChannels);
  //     setEditingIndex(null);
  //     setIsModalOpen(false);
  //   }
  // };

  if(profile){
    return (
      <PaymentChannelsContainer>
        <HeaderContainer>
          <Typography variant="h6" style={{ fontWeight: "bolder" }}>
            Payment Channels
          </Typography>
          <StyledIconButton size="small" onClick={() => setIsModalOpen(true)}>
            <AddIcon />
            <HoverText className="hover-text">ADD PAYMENT CHANNEL</HoverText>
          </StyledIconButton>
        </HeaderContainer>
  
        {paymentChannels.map((item, index) => (
          <PaymentBox key={index} onClick={() => onBoxClick(item)}>
          <Typography variant="body1" style={{ fontWeight: "bolder", color:'#2E603A', textTransform: "uppercase" }}>
            {item.channel}
          </Typography>
          <Typography variant="body2">{item.details}</Typography>
        </PaymentBox>
        ))}
  
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setChannelToEdit(null);
          }}
          // onSave={addOrEditPaymentChannel}
          channelToEdit ={channelToEdit}
            // editingIndex !== null ? paymentChannels[editingIndex]: null
          
          // onRemove={onRemove}
        />
      </PaymentChannelsContainer>
    );
  }
};

export default PaymentChannels;
