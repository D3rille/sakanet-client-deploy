import {useState} from "react";
import { Paper, Typography, Avatar, Box, IconButton, TextField, Button } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import LogoutIcon from "@mui/icons-material/Logout";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import {useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import toast from "react-hot-toast";

import OptionsMenu from "../popups/OptionsMenu";
import CustomDialog from "../popups/customDialog";
import { LEAVE_POOL_GROUP, DELETE_POOL_GROUP, GET_MANAGED_GROUPS, GET_JOINED_GROUPS} from "../../graphql/operations/poolGroup";

const DeletePoolDialog=({isOpenDialog, setIsOpenDialog, callback})=>{

  const [confirmation, setConfirmation] = useState("");

  const handleClose = () => {
      setIsOpenDialog(false);
  };

  return (
  <div>
      {isOpenDialog && <Dialog
      fullWidth
      maxWidth={"xs"}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Pool Group Deletion
      </DialogTitle>
      <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          }}
      >
          <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <DialogContentText>
          Do you really want to delete this group? If you are the creator of this group,
          enter your password to confirm pool group"s deletion.
        </DialogContentText>
          <TextField
            value={confirmation}
            type="password"
            onChange={(e)=>{
              e.preventDefault();
              setConfirmation(e.target.value)}}
            label="Confirmation"
            variant="standard"
            // multiline
            fullWidth
          />

      </DialogContent>
      <DialogActions>     
        <Button autoFocus onClick={()=>{
          callback(confirmation);
        }} variant="contained" color="error">
            Delete Group
        </Button>
        {/* <Button autoFocus onClick={handleClose} variant="outlined" color="error">
            Cancel
        </Button> */}
      </DialogActions>
      </Dialog>}
  </div>
  );
}


const CommunityInfo = ({isAdmin, data, settingsItems}) => {
  const router = useRouter();
  const poolGroupId = router.query?.groupId;
  const [isDialogOpen, setIsDialogOpen] = useState("");

  const [leaveGroup] = useMutation(LEAVE_POOL_GROUP);
  const handleLeavePoolGroup = () =>{
    leaveGroup({
      variables:{
        poolGroupId
      },
      refetchQueries:[GET_MANAGED_GROUPS, GET_JOINED_GROUPS],
      onCompleted:()=>{
        toast("You have left the pool group.");
        router.replace("/myNetwork");
      },
      onError:(error)=>{
        toast.error(error.message);
      }
    })
  }

  const [deleteGroup] = useMutation(DELETE_POOL_GROUP);
  const handleDeleteGroup = (confirmation) =>{
    deleteGroup({
      variables:{
        poolGroupId,
        confirmation
      },
      refetchQueries:[GET_MANAGED_GROUPS],
      onCompleted:()=>{
        toast("The Pool Group has been deleted.");
        setIsDialogOpen("");
        router.replace("/myNetwork");
      },
      onError:(error)=>{
        toast.error(error.message);
      }
    });

    
  }

  const updatedSettingsItems = settingsItems.map((item) => {
    if (item.name === "Delete Group") {
      return {
        ...item,
        function: () => {
          setIsDialogOpen("delete group");
        },
      };
    } else {
      // If the condition is not met, return the original item
      return item;
    }
  });
  
  const Settings = (handleClick) =>{
    return (
    <IconButton
      
      onClick={(event)=>{
        handleClick(event);
      }}
    >
        <TuneIcon/>
    </IconButton>)
  }

  const ExitGroup = () =>{
    return(
      <IconButton
      onClick={(event)=>{
        setIsDialogOpen("leave");
      }}
    >
        <LogoutIcon/>
    </IconButton>
    )
  }

  // const settingsItems=[
  //   {name:"Configure", function:()=>{}},
  //   {name:"Delete Group", function:()=>{}}
  // ];

  return (
    <Paper
      elevation={3}
      sx={{
        position: "relative",
        padding: 2,
        marginBottom: 2,
        borderRadius: 3,
        textAlign: "center",
        backgroundColor: "#FAF9F6",
      }}
    >
      {/*COVER PHOTO */}
      <Box
        sx={{
          height: "120px",
          backgroundColor: "#D8D5F7",
          overflow:"hidden",
          marginBottom: 2,
          marginLeft: -2,
          marginRight: -2,
          marginTop: -2,
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
          borderBottomLeftRadius: "inherit",
          borderBottomRightRadius: "inherit",
          position: "relative",
          zIndex: 0,
        }}
      >
        {data?.cover_photo && (<img src={data?.cover_photo ?? ""} alt="cover photo" style={{width:"100%", height:"100%", objectFit:"cover"}} />)}

      </Box>
      <Avatar
        src={data?.profile_pic}
        alt={`${data?.groupName}`}
        sx={{
          position: "absolute",
          top: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          width: "100px",
          height: "100px",
          border: "3px solid #5FBB84",
        }}
      />
      {isAdmin ? (<div style={{display:"flex", justifyContent:"space-between", margin:0}}>
        <ExitGroup/>
        <OptionsMenu triggerComponent={Settings} itemAndFunc={updatedSettingsItems}/>
      </div>):(
        <div style={{display:"flex", justifyContent:"end", margin:0}}>
          <ExitGroup/>
        </div>
      )}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: "#1A1A1A",
          mt: "1em",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          padding:1
        }}
      >
        {data?.groupName}
      </Typography>

      <Box 
      sx={{ 
        textAlign: "left",
        paddingInline:"1em", 
        mb: "1rem",  
        ml:1, mr:1, mt:0.8, 
        maxHeight:"6em", 
        overflowY:"auto"}}>
        {data && data?.groupDescription && (<Typography
          variant="caption"
          sx={{ color: "#777777", fontWeight: "bold", fontSize:"0.79em" }}
        >
          About:
        </Typography>)}
        <br/>
        <Typography
          variant="caption"
          sx={{ color: "#1A1A1A", fontWeight: "bold", fontSize:"0.79em" }}
        >
          {data?.groupDescription}
        </Typography>
      </Box>
      
      {isDialogOpen == "leave" && (
        <CustomDialog
          openDialog={Boolean(isDialogOpen)}
          setOpenDialog={setIsDialogOpen}
          title={"Leave Pool Group"}
          message={"Are you sure you want to leave this pool group?"}
          btnDisplay={0}
          callback={()=>{
            setIsDialogOpen("");
            handleLeavePoolGroup();
          }}

        />
      )}

      {isDialogOpen == "delete group" && (
        <DeletePoolDialog
          isOpenDialog={Boolean(isDialogOpen)}
          setIsOpenDialog={setIsDialogOpen}
          callback={(confirmation)=>{handleDeleteGroup(confirmation)}}

        />
        )}
        {/* <CustomDialog
          openDialog={Boolean(isDialogOpen)}
          setOpenDialog={setIsDialogOpen}
          title={"Delete Pool Group"}
          message={"Are you sure you want to delete this pool group? All Pool records will be lost."}
          btnDisplay={0}
          callback={()=>{
            setIsDialogOpen("");
          }}

        /> */}
    </Paper>
  );
};

export default CommunityInfo;
