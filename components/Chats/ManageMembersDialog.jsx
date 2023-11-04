import React, { useRef, useEffect, useState} from 'react';
import {
    Box, 
    styled, 
    Typography, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Checkbox,
    InputBase,
    Chip, 
    Avatar,
    Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from "@mui/icons-material/Close";
import { format, set } from 'date-fns';
import {useLazyQuery, useQuery} from "@apollo/client";
import { FIND_USERS, GET_GROUP_MEMBERS } from '../../graphql/operations/chat';
import SearchIcon from "@mui/icons-material/Search";
import toast from 'react-hot-toast';
import CircularLoading from '../circularLoading';
import { AuthContext } from '../../context/auth';
import CustomDialog from "../popups/customDialog";


const SearchPanel = styled(Box)({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F9FAFC",
    borderRadius: "5px",
    marginLeft: "1.5rem",
    marginRight: "1.5rem",
    marginBottom: "0.5rem",
    border: "1px solid #DBE4EC",
  });
const UserInfo = styled(Box)({
    maxWidth: "65%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
    justifyContent: "flex-start",
  });
  
  const ModalTitle = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  });
  
  const CloseButton = styled(IconButton)({
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
  });
  
  const ModalButton = styled(LoadingButton)({
    backgroundColor: "#2E613B",
    borderRadius: "10px",
    width: "100%",
    marginLeft: "1.5rem",
    marginRight: "1.5rem",
  });
  
  const StyledCheckbox = styled(Checkbox)({
    color: "#2E613B",
    "&.Mui-checked": {
      color: "#2E613B",
    },
  });
  
  const SuggestedUser = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginInline:"3em",
    marginBlock:"1.5em",
    // marginLeft: "1.5rem",
    // marginBottom: "0.5rem",
  });
  
  const SuggestedContainer = styled(Box)({
    maxHeight: "40vh",
    overflowY: "auto",
    overflowX: "hidden",
    marginRight: "1.5rem",
  });
const ManageMembersDialog = ({...props}) =>{
    const {isModalOpen,admin, handleOpenModal, action, members, setAddOrKick, handleAddParticipant, handleKickOut} = props;
    const [excludedIds, setExcludedIds] = useState([]);
    const [query,setQuery] = useState("");
    // const [focus, setFocus] = useState(false);
    const [users, setUsers] = useState([]);// data for chip object, will be used to store members excluding admin in kickout's members listing
    const [userIds, setUserIds] = useState([]); // input for adding members
    const [userToRemove, setUserToRemove] = useState(["",""]); //input for kickout
    const [addConfirmation, setAddConfirmation] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const [findUsers, {data:findUserData, loading:findUserLoading}]= useLazyQuery(FIND_USERS, {
        variables:{
            searchInput:query,
            excludedIds:excludedIds
        }
    });
    // console.log(findToAddUsersData?.findUsers);
    // const {data:findGroupMembersData, loading:findGroupMembersLoading} = useQuery(GET_GROUP_MEMBERS);

    // useEffect(()=>{
    //     setUsers([]);
    // },[actionTriggered, setActionTriggerd])

    useEffect(() => {
        if (members && action=="add") {
          let arr = members.map((member) => member._id);
          setExcludedIds([...arr, ...userIds]);
          findUsers();
          
        } else if(action=="kick" && members && admin){
            let arr = members.filter((member)=>member._id !== admin);
            setUsers(arr);
        }
      }, [members, findUserData, action]);

    //   useEffect(()=>{
    //     if(action=="kick" && )
    //   });
;
    //   const handleActionTriggered = () => {
    //     setActionTriggerd(!actionTriggered);
    //   }

    // const handleFindToAddUsers = () =>{
    //     try {
    //         findToAddUsers({
    //             variables:{
    //                 "searchInput":query,
    //                 "excludedIds":members
    //             }
    //         })
    //     } catch (error) {
    //         toast.error(error.message);
    //         console.log(error);
    //     }
    // }
    const Recipients = ({users, handleRemoveUsers}) => {
        return(
            <div
                style={{display:"flex", flexDirection:"row", maxWidth:"50vw",flexWrap: "wrap", marginInline:"1.5em",  }}
            >
                {users && users?.map((user, index)=>(
                    <Chip
                        avatar={<Avatar src={user.profile_pic ?? ""} alt={user.username ?? ""} />}
                        label={user.username ?? ""}
                        onDelete={()=>{handleRemoveUsers(index)}}
                        key={user._id}
                    
                    />  
                ))}
            </div>
        );

    }

    const handleQueryChange = (event) =>{
        setQuery(event.target.value);
        findUsers();
    }
    const handleAddRecipients = (user) =>{
        let newRecipients = users;
        let newRecipientIds = userIds;
        newRecipients.push(user)
        newRecipientIds.push(user._id)
        setUsers(newRecipients);
        setUserIds(newRecipientIds);
        setQuery("");
        // setFocus(false);
    }
    const handleRemoveUsers = (index) =>{
        let updatedRecipients = [...users];
        updatedRecipients.splice(index, 1);
        let updatedRecipientIds = updatedRecipients.map((recipient)=>recipient._id);
        setUsers([...new Set(updatedRecipients)]);
        setUserIds([...new Set(updatedRecipientIds)]);
     
    }


    // useEffect(()=>{
    //     if(findUserData?.findUsers){
    //         setParticipants(findUserData?.findUsers);
    //     }
    // }, [findUserData, findUserLoading]);

    // useEffect(()=>{
    //     if(action=="kick"){
    //         setParticipants(members);
    //     }
    // },[]);

    return(
        <>
            {/* Dialog for Adding group members */}
            <Dialog
                open={isModalOpen}
                onClose={handleOpenModal}
                fullWidth
                maxWidth="sm"
                PaperProps={{ style: { borderRadius: '20px', padding:'1rem', height:"80vh" } }}
            >
                <ModalTitle>
                <DialogTitle style={{ fontWeight: 600 }}>{action=="add"? "Add People": "Kickout Member"}</DialogTitle>
                <CloseButton
                    edge="end"
                    color="inherit"
                    onClick={()=>{
                        setQuery("");
                        setUsers([]);
                        setUserIds([]);
                        setAddOrKick("");
                        // handleActionTriggered();
                        handleOpenModal();
                    }}
                    aria-label="close"
                >
                    <CloseIcon />
                </CloseButton>
                </ModalTitle>
                <DialogContent style={{ padding: '1rem' }}>
                {action == "add" && (<SearchPanel>
                        <>
                            <SearchIcon
                            color="action"
                            style={{
                                marginLeft: "8px",
                                marginRight: "8px",
                                color: "#AEBAC6",
                            }}
                            />
                            <InputBase
                            value={query}
                            onChange={handleQueryChange}
                            placeholder="Search"
                            fullWidth
                            style={{ paddingLeft: "8px", color: "#AEBAC6" }}
                            />
                        </>
                </SearchPanel>)}
                {action == "add" && (<Recipients users={users} handleRemoveUsers={handleRemoveUsers}/>)}
               
                {!findUserData?.findUsers && action =="add" && !findUserLoading && (
                    <Typography
                    style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        textAlign: "center",
                    }}
                    >
                    No user selected
                    </Typography>
                )}
                <Typography
                    style={{
                    fontWeight: 600,
                    marginLeft: "1.5rem",
                    marginBottom: "1rem",
                    }}
                >
                    {action=="add" ? "Result":"Members:"}
                </Typography>
                <SuggestedContainer>
                    {/* conditional, one for list of search result and one for group */}
                    {findUserLoading && (
                        <div style={{display:"flex", margin:"auto"}}>
                            <CircularLoading/>
                        </div>
                    
                    )}
                    {action=="add" && query && findUserData?.findUsers && findUserData?.findUsers.map((user) => (
                        
                        <SuggestedUser key={user._id}>
                            <Box sx={{display:"flex",flexDirection:"row", gap:"1em", alignItems:"center", justifyContent:"center"}}>
                                <Avatar src ={user.profile_pic ?? ""} />
                                <Typography>{user.username}</Typography>
                            </Box>
                            {/* <StyledCheckbox /> */}
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{padding:"0.2em", borderRadius:"1em", textTransform:"none"}}
                                onClick={()=>{handleAddRecipients(user)}}
                            >
                                Add
                            </Button>
                        </SuggestedUser>
                        
                    
                    ))}

                    {action=="kick" && users && users?.map((user) => (
                    <SuggestedUser key={user._id}>
                        <Box sx={{display:"flex",flexDirection:"row", gap:"1em", alignItems:"center", justifyContent:"center"}}>
                                <Avatar src ={user.profile_pic ?? ""} />
                                <Typography>{user.username}</Typography>
                            </Box>
                            {/* <StyledCheckbox /> */}
                            <LoadingButton
                                variant="outlined"
                                color="error"
                                sx={{padding:"0.2em", borderRadius:"1em", textTransform:"none"}}
                                onClick={()=>{
                                    setAddConfirmation(true);
                                    setUserToRemove([user._id, user.username]);
                                }}
                            >
                                Kick
                            </LoadingButton>
                    </SuggestedUser>
                    ))}
                </SuggestedContainer>
                </DialogContent>
                <DialogActions>
                {action=="add" && (
                <ModalButton 
                    loading={btnLoading}
                    variant="contained" 
                    onClick={()=>{
                    setAddConfirmation(true);
                }}>
                    Add
                </ModalButton>)}

                {/* Add Participant confirmation dialog */}
                {action=="add" && (<CustomDialog
                    openDialog={addConfirmation}
                    setOpenDialog={setAddConfirmation}
                    title={"Add Participants"}
                    message = {"Add Participant or participants to this group?"}
                    btnDisplay={2}
                    callback={()=>{
                        setBtnLoading(true);
                        handleAddParticipant(userIds).then(()=>{
                            handleOpenModal()
                        });
                        
                    }}
                />)}

                {/* Kickout participant dialog */}
                {action =="kick" && (
                    <CustomDialog
                    openDialog={addConfirmation}
                    setOpenDialog={setAddConfirmation}
                    title={"Remove Participants"}
                    message = {"Remove or Kick-out this member from the group?"}
                    btnDisplay={2}
                    callback={()=>{
                        setBtnLoading(true);
                        handleKickOut(userToRemove).then(()=>{
                            setBtnLoading(false);
                            setUserToRemove([]);
                            // setAddConfirmation(false);
                        });
                        
                    }}
                />
                )}
                </DialogActions>
            </Dialog>
        </>
    );

}

export default ManageMembersDialog;