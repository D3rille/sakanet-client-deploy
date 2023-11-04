import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/system";
import {useMutation} from "@apollo/client";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import toast from "react-hot-toast";
import {useRouter} from "next/router";

import {CREATE_POOL_GROUP } from "../../graphql/operations/poolGroup";

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

const CreatePoolGroupModal = ({isOpen, setIsOpen}) => {
    const router = useRouter();
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");

    const [createPoolGroup] = useMutation(CREATE_POOL_GROUP);

    const handleCreatePoolGroup = async() =>{
        try {
            createPoolGroup({
                variables:{
                    groupName,
                    groupDescription
                },
                onCompleted:(data)=>{
                    toast.success("successfully create the pool group");
                    // router.push(`/Groups?groupId=${data?.createPoolGroup}`);
                    router.push(`/Groups/${data?.createPoolGroup}`);

                },
                onError:(error)=>{
                    toast.error(error?.message);
                }
            })
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    }

    const onClose = () =>{
        setIsOpen("");
    }


    return (
        <StyledModal open={isOpen} onClose={onClose}>
        <ModalContent>
            <Header>
            <h6 style={{ fontSize: "18px" }}>Create Pool Group</h6>
            </Header>
            <StyledInput
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            />
            <DetailsTextarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Description"
            />
            <Footer>
            <div>
                <ActionButton
                variant="save"
                onClick={() => {
                    handleCreatePoolGroup().then(()=>{
                        setGroupName("");
                        setGroupDescription("");
                        onClose();
                    })
                }}
                disabled={!groupName}
                >
                Create Group
                </ActionButton>
                <ActionButton
                variant="cancel"
                onClick={() => {
                    onClose();
                    setGroupName("");
                    setGroupDescription("");
                }}
                style={{ color: "#4A4C59" }}
                >
                Cancel
                </ActionButton>
            </div>
            </Footer>
        </ModalContent>
        </StyledModal>
    );
};

export default CreatePoolGroupModal;
