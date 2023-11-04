import React, { useState, useEffect } from "react";
import { Typography, Button,Divider } from "@mui/material";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/system";
import {useMutation} from "@apollo/client";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import { useDropzone } from "react-dropzone";

import {CONFIG_POOL_GROUP_INFO, GET_POOL_GROUP_INFO } from "../../graphql/operations/poolGroup";
import { uploadPoolGroupCoverPhoto, uploadPoolGroupProfilePic } from "../../util/imageUtils";

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
  height: "500px",
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

const StyledDivider = styled(Divider)({
  marginTop: "10px",
  marginBottom: "10px",
});

const StyledButton = styled(Button)({
  backgroundColor: "#2E603A",
  "&:hover": {
    backgroundColor: "#FE8C47",
  },
});

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

const EditGroupInfo = ({isOpen, setIsOpen, data}) => {
    // const router = useRouter();
    const [groupName, setGroupName] = useState(data?.groupName ?? "");
    const [groupDescription, setGroupDescription] = useState(data?.groupDescription ?? "");
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [profilePicSecureURL, setProfilePicSecureURL] = useState("");
    const [coverPicSecureURL, setCoverPicSecureURL] = useState("");

    const [configPoolGroup] = useMutation(CONFIG_POOL_GROUP_INFO);

    const handleConfigGroupInfo = async() =>{
        try {
          configPoolGroup({
                variables:{
                  "poolGroupId": data?.poolGroupId,
                  "poolGroupConfigInput": {
                    "cover_photo": coverPicSecureURL ?? "",
                    "groupDescription": groupDescription ?? "",
                    "groupName": groupName ?? "",
                    "profile_pic": profilePicSecureURL ?? ""
                  },
                },
                refetchQueries:[GET_POOL_GROUP_INFO],
                onCompleted:(data)=>{
                    toast.success(data?.configPoolGroupInfo);
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
    const handleProfilePictureDrop = (acceptedFiles) => {
      setProfilePicture(acceptedFiles[0]);
    };

    const handleCoverPhotoDrop = (acceptedFiles) => {
      setCoverPhoto(acceptedFiles[0]);
    };

    const profilePictureDropzone = useDropzone({
      accept: {'image/jpeg': ['.jpeg', '.png']},
      maxFiles:1,
      onDrop: handleProfilePictureDrop,
    });

    const coverPhotoDropzone = useDropzone({
      accept:  {'image/jpeg': ['.jpeg', '.png']},
      maxFiles:1,
      onDrop: handleCoverPhotoDrop,
    });

    const onClose = () =>{
        setIsOpen("");
    }

    const handleProfilePicUpload = async() => {
  
      try {
        const profilePicSecureURL = await uploadPoolGroupProfilePic(profilePicture);
        console.log(profilePicSecureURL);
        setProfilePicSecureURL(profilePicSecureURL)
        toast.success("Profile Picture Succesfully Uploaded");

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    const handleCoverPicUpload = async() => {
      try {
        const coverPicSecureURL = await uploadPoolGroupCoverPhoto(coverPhoto);
        console.log(coverPicSecureURL);
        setCoverPicSecureURL(coverPicSecureURL);
        toast.success("Cover Photo Succesfully Uploaded");
      } catch (error) {
        toast.error('Error uploading image:', error);
        console.error('Error uploading image:', error);
      }
    };
    

  return (
      <StyledModal open={isOpen} onClose={onClose}>
      <ModalContent>
          <Header>
          <h6 style={{ fontSize: "18px" }}>Configure</h6>
          </Header>

          <div style={{overflowY:"scroll", height:"100%", paddingInline:"1em", paddingBottom:"5em"}}>
            {/* Group Profile Picture */}
            <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px" }}>
              <div
                style={{
                  marginRight: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  {...profilePictureDropzone.getRootProps()}
                  style={{
                    width: "90px",
                    height: "90px",
                    marginBottom: "5px",
                    border: "2px dashed #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile"
                      style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "4px" }}
                    />
                  ) : (
                    <Typography variant="caption" textAlign="center">Drop profile picture here</Typography>
                  )}
                </div>
                <Typography variant="caption">Max size 10mb</Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <h4>Profile Picture</h4>
                <StyledButton
                  onClick= {handleProfilePicUpload} //Image upload 
                  variant="contained"
                  style={{
                    width: "150px",
                    margin: "auto 0",
                    marginBottom: "5px",
                    marginTop: "7px",
                  }}
                >
                  Upload
                </StyledButton>
                <Typography variant="caption">
                  This setting will change the group's photo.
                </Typography>
              </div>
            </div>
            
            <StyledDivider />

            <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px" }}>
              <div
                style={{
                  marginRight: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  {...coverPhotoDropzone.getRootProps()}
                  style={{
                    width: "200px", 
                    height: "120px", 
                    marginBottom: "5px",
                    border: "2px dashed #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {coverPhoto ? (
                    <img
                      src={URL.createObjectURL(coverPhoto)}
                      alt="Cover"
                      style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "4px" }}
                    />
                  ) : (
                    <Typography variant="caption" textAlign="center">Drop cover photo here</Typography>
                  )}
                </div>
                <Typography variant="caption">Max size 10mb</Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <h4>Cover Photo</h4>
                <StyledButton
                  onClick={handleCoverPicUpload} // Cover Photo upload logic here
                  variant="contained"
                  style={{
                    width: "150px",
                    margin: "auto 0",
                    marginBottom: "5px",
                    marginTop: "7px",
                  }}
                >
                  Upload
                </StyledButton>
                <Typography variant="caption">
                  This setting will change the group's  cover photo.
                </Typography>
              </div>
            </div>

            <StyledDivider />

            <div>
              <h4>Group Name</h4>

              <StyledInput
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
              />
            </div>

            <StyledDivider />

            <div>
                <h4>Group Description</h4>
              <DetailsTextarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Description"
              />
            </div>

          </div>

          <Footer>
          <div>
              <ActionButton
              variant="save"
              onClick={() => {
                handleConfigGroupInfo().then(()=>{
                  setGroupName("");
                  setGroupDescription("");
                  onClose();
                })
              }}
              disabled={!groupName}
              >
              Save Changes
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

export default EditGroupInfo;
