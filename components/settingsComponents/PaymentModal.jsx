import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/system";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {useMutation} from "@apollo/client";
import toast from  "react-hot-toast";

import { ADD_PAYMENT_CHANNEL, DELETE_PAYMENT_CHANNEL, EDIT_PAYMENT_CHANNEL } from "../../graphql/operations/settings";
import { GET_MY_PROFILE } from "../../graphql/operations/profile";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled("div")({
  backgroundColor: "#FEFFFE",
  borderRadius: "20px",
  padding: "30px",
  width: "600px",
  height: "350px",
  position: "relative",
  outline: "none",
});

const Header = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

{
  /*
const CloseButton = styled('div')({
  backgroundColor: '#ECECED',
  padding: '7px',
  borderRadius: '20%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}); */
}

const StyledInput = styled("input")({
  margin: "20px 0",
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  color: "#2C2D2D",
  backgroundColor: "#FEFFFE",
  borderColor: "#2E603A",
  "&:focus": {
    borderColor: "#2E603A",
  },
});

const DetailsTextarea = styled("textarea")({
  width: "100%",
  color: "#2C2D2D",
  height: "100px",
  padding: "10px",
  borderRadius: "5px",
  overflowY: "auto",
  resize: "none",
  backgroundColor: "#FEFFFE",
  borderColor: "#2E603A",
  "&:focus": {
    borderColor: "#2E603A",
  },
});

const Footer = styled("div")({
  backgroundColor: "#F5F2F8",
  padding: "20px",
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  display: "flex",
  justifyContent: "space-between",
  borderBottomLeftRadius: "inherit",
  borderBottomRightRadius: "inherit",
});

const ContentContainer = styled("div")({
  paddingBottom: "50px",
});

const ActionButton = styled("button")(({ variant }) => ({
  backgroundColor: variant === "save" ? "#2E603A" : "transparent",
  color: variant === "cancel" ? "#B2BEB5" : "white",
  padding: "7px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px",
  border: "none",
  fontWeight: "bold",
  height: "42px",
}));

const RemoveButton = styled("button")({
  backgroundColor: "#EAEBEF",
  padding: "7px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  border: "none",
  fontWeight: "bold",
  color: "#211E24",
});

const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  channelToEdit,
  // channelId,
  // paymentChannel: propChannel,
  // details: propDetails,
  // onRemove,
}) => {
  const channelId = channelToEdit?._id ?? "";
  const propChannel = channelToEdit?.channel ?? "";
  const propDetails = channelToEdit?.details ?? "";
  const [paymentChannel, setPaymentChannel] = useState(propChannel);
  const [details, setDetails] = useState(propDetails);

  const [addPaymentChannel] = useMutation(ADD_PAYMENT_CHANNEL);

  const handleAddPaymentChannel = async() =>{
    addPaymentChannel({
      variables:{
        paymentChannel:{
          channel:paymentChannel,
          details
        },
      },
      refetchQueries:[GET_MY_PROFILE],
      onCompleted:()=>{
        toast.success("Payment successfully added.");
      },
      onError:(error)=>{
        toast.error(error.message);
      }
    });
  }

  const [deletePaymentChannel] = useMutation(DELETE_PAYMENT_CHANNEL);

  const handleDeleteChannel = async() => {
    deletePaymentChannel({
      variables: {
        channelId
      },
      update: (cache) => {
        // Read the existing data from the cache
        const existingData = cache.readQuery({
          query: GET_MY_PROFILE,
        });
  
        const existingChannels = existingData?.getMyProfile?.profile.payment_channels;
        const updatedChannels = existingChannels.filter((channel) => channel._id !== channelId);
  
        // Write the updated data back to the cache
        cache.writeQuery({
          query: GET_MY_PROFILE,
          data: {
            getMyProfile: {
              profile: {
                ...existingData.getMyProfile.profile,
                payment_channels: updatedChannels,
              },
            },
          },
        });
      },
      onCompleted: (data) => {
        toast.success(data?.deletePaymentChannel);
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };

  const [editPaymentChannel] = useMutation(EDIT_PAYMENT_CHANNEL);
  const handleEditPaymentChannel = async() =>{
    editPaymentChannel({
      variables:{
        "channelId": channelId,
        "paymentChannel": {
          "channel": paymentChannel,
          "details": details
        }
      },
      refetchQueries:[GET_MY_PROFILE],
      onCompleted:()=>{
        toast.success("Channel edited.");
      },
      onError:(error)=>{
        toast.error(error.message);
      }
    })
  }

  useEffect(() => {
    setPaymentChannel(propChannel);
    setDetails(propDetails);
  }, [propChannel, propDetails]);

  const canSave = paymentChannel.trim() !== "" && details.trim() !== "";

  return (
    <StyledModal open={isOpen} onClose={onClose}>
      <ModalContent>
        <Header>
          <h6 style={{ fontSize: "18px" }}>Payment Channel</h6>
        </Header>
        <StyledInput
          type="text"
          value={paymentChannel}
          onChange={(e) => setPaymentChannel(e.target.value)}
          placeholder="Type of Payment Channel"
        />
        <DetailsTextarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Details"
        />
        <Footer>
          {channelToEdit && (<RemoveButton onClick={()=>{
            handleDeleteChannel().then(()=>{
              setPaymentChannel("");
              setDetails("");
              onClose();
            });;
          }}>
            <DeleteOutlineIcon style={{ marginRight: "5px" }} />
            Remove
          </RemoveButton>)}
          <div>
            <ActionButton
              variant="cancel"
              onClick={() => {
                onClose();             
                setPaymentChannel("");
                setDetails("");
              }}
              style={{ color: "#4A4C59" }}
            >
              Cancel
            </ActionButton>
            {channelToEdit && (<ActionButton
              variant="save"
              onClick={() => {
                // onSave(paymentChannel, details);
                handleEditPaymentChannel().then(()=>{
                  setPaymentChannel("");
                  setDetails("");
                  onClose();
                });
              }}
              disabled={!canSave}
            >
              Save Changes
            </ActionButton>)}

            {!channelToEdit && (<ActionButton
              variant="save"
              onClick={() => {
                // onSave(paymentChannel, details);
                handleAddPaymentChannel().then(()=>{
                  setPaymentChannel("");
                  setDetails("");
                  onClose();
                });
              }}
              disabled={!canSave}
            >
              Add Payment Channel
            </ActionButton>)}
          </div>
        </Footer>
      </ModalContent>
    </StyledModal>
  );
};

export default PaymentModal;
