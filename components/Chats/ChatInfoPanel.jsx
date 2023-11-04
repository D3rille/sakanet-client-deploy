import React, { useEffect, useState, useContext } from 'react';
import {
    Box, 
    styled, 
    Avatar, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    List,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Checkbox,
    InputBase,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from "@mui/icons-material/Close";
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CONVERSATIONS, GET_GROUP_MEMBERS, GET_MESSAGES, RENAME_GROUP_CHAT, UPDATE_GROUP_PROFILE_PIC } from '../../graphql/operations/chat';
import CircularLoading from '../circularLoading';
import {useRouter} from "next/router";
import { handleError } from '@apollo/client/link/http/parseAndCheckHttpResponse';
import { AuthContext } from '../../context/auth';
import ManageMembersDialog from './ManageMembersDialog';
import CustomDialog from '../popups/customDialog';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { uploadGroupChatPhoto } from '../../util/imageUtils';


const StyledChatInfoPanel = styled(Box)({
    flex: 1, 
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    overflowY: 'auto',
    maxHeight: '80vh',
});

const StyledAvatar = styled(Avatar)({
    width: '70px',
    height: '70px',
    margin: '16px 0',
});

const StyledNameTypography = styled(Typography)({
    fontWeight: 500,
    fontSize: '1.2rem',
    marginBottom: '1rem',
});

const StyledAccordionSummary = styled(AccordionSummary)({
    fontWeight: '600',
    color:'#2C2C2C'
});

const StyledAccordion = styled(Accordion)({
    boxShadow: 'none',
    border: 'none',
    '&::before': {
        display: 'none',
    },
    width: '100%',
    background: 'transparent',
});

const StyledTextField = styled(TextField)({
    '& .Mui-focused': {
        color: '#2E613B',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2E613B',
    },
});

const StyledCancelButton = styled(Button)({
    color: '#2C2C2C',
});

const ChatInfoPanel = ({...props}) => {
    const {user} = useContext(AuthContext);
    const router = useRouter();
    const {getMessagesData, currentConvoId, addParticipants, kickOut, leaveGroupChat} = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [chatNameInput, setChatNameInput] = useState("");
    const [isChanged, setIsChanged] = useState(false);
    const [members, setMembers] = useState([]);
    const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
    const [addOrKick, setAddOrKick] = useState("");
    const [leaveDialog, setLeaveDialog] = useState(false);
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
    const [groupPhotoIsChanged, setGroupPhotoIsChanged] = useState(false);
    const recipient = getMessagesData?.getMessages;

    const [updateGroupProfilePic] = useMutation(UPDATE_GROUP_PROFILE_PIC); //Mutation for Changing Profile Picture

    // Chat Group Image Upload
    const handleDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
      };

    const groupChatProps = useDropzone({
        onDrop: handleDrop,
        accept:  {'image/jpeg': ['.jpeg', '.png']},
        maxFiles:1,
      });

    const [file,setFile] = useState(null);

    async function handleGroupChatPicUpload(groupChatId) {

        var photoLink = "";
        if (file) {
        try {
            photoLink = await uploadGroupChatPhoto(file);
            if(photoLink) {
                await updateGroupProfilePic({
                    variables:{
                        groupChatId,
                        newGroupProfilePic: photoLink,
                    },
                    refetchQueries:[GET_MESSAGES, GET_CONVERSATIONS],
                    onCompleted:(data)=>{
                    toast.success(`Successfully uploaded Group Chat Picture`);
                    },
                    onError:(error)=>{
                    toast.error(error.message);
                    }
                });
            }
           

        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image:', error);

        }
        }
    }
    
    

    // const {data:getGroupMembers, loading, error} = useQuery(GET_GROUP_MEMBERS);
    const [findGroupMembers, {data:findGroupMembersData, loading:findGroupMembersLoading}] = useLazyQuery(GET_GROUP_MEMBERS);
    const [renameGroupChat] = useMutation(RENAME_GROUP_CHAT);

    const handleRenameGroupChat = async(groupChatId, newName) =>{
        try {
            await renameGroupChat({
                variables:{
                    groupChatId,
                    newName
                },
                refetchQueries:[GET_MESSAGES],
                onCompleted:(data)=>{
                    toast.success(`Successfully renamed group chat to ${data?.renameGroupChat}`);
                },
                onError:(error)=>{
                    toast.error(error.message);
                }
            })
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }


    //get members, return list
    useEffect(()=>{
        try {
            if(recipient?.isGroup){
                findGroupMembers({
                    variables:{
                        conversationId:recipient?._id
                    },
                    onError:(error)=>{
                        toast.error(error.message)
                    }
                });
    
            } else{
                setMembers([]);
            }
            
        } catch (error) {
            console.log(error)
        }
    },[getMessagesData]);

    useEffect(()=>{
        if(findGroupMembersData){
            setMembers(findGroupMembersData?.getGroupMembers);
        }
    }, [findGroupMembersData, findGroupMembersLoading, getMessagesData]);

    // for Avatar and the User's or Group's name
    const avatarSrc = recipient?.recipientPic; 
    const chatName = recipient?.recipientUsername;
    
    const handleOpenModal = () =>{
        setOpenAddGroupModal(!openAddGroupModal);
    }

    const handleInputChange = (event) => {
        setChatNameInput(event.target.value);
        setIsChanged(event.target.value !== chatName);
    };

    const handleAddParticipant = async(userIds) =>{
        try {
            await addParticipants({
                variables:{
                    conversationId:currentConvoId,
                    userIds
                },
                refetchQueries:[GET_GROUP_MEMBERS, GET_MESSAGES],
                onError:(error)=>{
                    toast.error(error.message);
                }
            });
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong. Cannot Add participants.")
        }
    };

    const handleKickOut = async(userToRemove) =>{
        try {
            await kickOut({
                variables:{
                    groupChatId:currentConvoId,
                    userToRemove
                },
                refetchQueries:[GET_GROUP_MEMBERS, GET_MESSAGES],
                onError:(error)=>{
                    toast.error(error.message);
                }
            });
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong. Cannot kickout participant from the group.");
        }
    };

    const handleLeaveGroupChat = async() =>{
        try {
            await leaveGroupChat({
                variables:{
                    groupChatId:currentConvoId,
                },
                refetchQueries:[GET_GROUP_MEMBERS, GET_MESSAGES, GET_CONVERSATIONS],
                onError:(error)=>{
                    toast.error(error.message);
                }
            });
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong. Cannot leave from the group.");
        }
    };

    if(findGroupMembersLoading){
        return (
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", width:"24vw"}}>
                <CircularLoading/>

            </div>
        );
    }

    // if(findGroupMembersData){
    //     members = findGroupMembersData.getGroupMembers;
    // }


    return (
        <StyledChatInfoPanel>
            <StyledAvatar src={avatarSrc} />
            <StyledNameTypography variant="h6">{chatName}</StyledNameTypography>
            {!recipient?.isGroup && (
                <Button 
                    sx={{width:"100%", color:"black", padding:"1em", textTransform:"none"}} 
                    onClick={() => {router.push(`/Find/${recipient?._id}`)}}
                    endIcon={<ArrowForwardIosIcon/>}
                >
                        Visit Profile
                </Button>
                
            )}

            {recipient?.isGroup && (recipient?.admin == user.id) && (<StyledAccordion>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Customize Chat
                </StyledAccordionSummary>
                <AccordionDetails>
                    <List>
                        <ListItem button onClick={() => setDialogOpen(true)}>
                            <ListItemIcon><EditIcon /></ListItemIcon> 
                            <ListItemText primary="Chat Name" />
                        </ListItem>
                        <ListItem button onClick={() => setPhotoDialogOpen(true)}>
                            <ListItemIcon><ImageIcon /></ListItemIcon> 
                            <ListItemText primary="Chat Photo" />
                        </ListItem>
                    </List>
                </AccordionDetails>
            </StyledAccordion>)}

            {recipient?.isGroup && (<StyledAccordion>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Chat Members
                </StyledAccordionSummary>
                <AccordionDetails>
                    <List>
                        <Box sx={{maxHeight:"30vh", overflowY:"scroll"}}>
                            {members.map((member, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon><Avatar src={""} /></ListItemIcon>
                                    <ListItemText primary={member.username} />
                                </ListItem>
                            ))}
                        </Box>
                        
                        {recipient?.isGroup && (
                            <ListItem button onClick={()=>{
                                setAddOrKick("add");
                                handleOpenModal();
                                }}>
                                <ListItemIcon><GroupAddIcon /></ListItemIcon>
                                <ListItemText primary="Add people" />
                            </ListItem>
                        )}
                            { recipient?.admin == user.id && (<ListItem button onClick={()=>{
                                setAddOrKick("kick");
                                handleOpenModal();
                                }}>
                                <ListItemIcon><GroupRemoveIcon /></ListItemIcon>
                                <ListItemText primary="Kickout people" />
                            </ListItem>)}
                    </List>
                </AccordionDetails>
            </StyledAccordion>)}

            {recipient?.isGroup && (
                <StyledAccordion>
                    <ListItem button onClick={()=>{setLeaveDialog(true);}}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Leave Chat" /> 
                    </ListItem>
                </StyledAccordion>
            )}
            <CustomDialog
                    openDialog={leaveDialog}
                    setOpenDialog={setLeaveDialog}
                    title={"Leave Group Chat"}
                    message = {
                        "If you leave this group chat you will not be able to " + 
                        "see the past messages and receive future messages from this group. Leave from this group chat?"
                    }
                    btnDisplay={2}
                    callback={()=>{
                        handleLeaveGroupChat();
                    }}
                />

            {/* Dialog for Add User */}
            {/* TODO: add a state variable for switching from adding to kicking */}
            {recipient?.admin && members && (<ManageMembersDialog
                isModalOpen={openAddGroupModal}
                admin={recipient?.admin}
                setAddOrKick={setAddOrKick}
                handleOpenModal={handleOpenModal}
                action={addOrKick}
                members={members}
                handleAddParticipant={handleAddParticipant}
                handleKickOut={handleKickOut}
            />)} 
            {/* Dialog for renaming Group */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Change chat name</DialogTitle>
                <DialogContent>
                    <Typography variant="caption">
                        Changing the name of a group chat changes it for everyone.
                    </Typography>
                    <StyledTextField 
                        margin="dense"
                        label="Chat Name"
                        type="text"
                        fullWidth
                        helperText={`${chatNameInput.length}/500`}
                        value={chatNameInput}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <StyledCancelButton onClick={() => setDialogOpen(false)}>
                        Cancel
                    </StyledCancelButton>
                    <Button 
                        color="primary" 
                        disabled={!isChanged} 
                        onClick={()=>{
                            handleRenameGroupChat(recipient?._id, chatNameInput).then(()=>{
                                setDialogOpen(false);
                            });
                        }}
                        style={{ backgroundColor: isChanged ? '#2E613B' : undefined, borderRadius:'10px', color:'#FFFEFE' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Changing Chat Photo */}
            <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)}>
                <DialogTitle>Change Chat Photo</DialogTitle>
                <DialogContent>
                    <Typography variant="caption">
                        Replace Current Group Chat Photo. Maximum should be 10 mb.
                    </Typography>

                    <Box
                        sx={{
                            height: '170px',
                            margin: '5px',
                            border: '2px dashed #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        {...groupChatProps.getRootProps()} // Assuming you have the necessary props from `useDropzone`
                    >
                        {file ? ( 
                            <>
                                <img
                                    src={URL.createObjectURL(file)} 
                                    alt="Group Chat Photo"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '120px',
                                        borderRadius: '4px',
                                    }}
                                />
                                <Typography variant="caption" style={{ marginTop: '8px' }}>
                                    Max size 10mb
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="caption" textAlign="center">
                                Upload Group Chat Photo
                            </Typography>
                        )}
                    </Box>


                </DialogContent>
                <DialogActions>
                    <StyledCancelButton onClick={() => setPhotoDialogOpen(false)}>
                        Cancel
                    </StyledCancelButton>
                    <Button 
                        color="primary" 
                        disabled={!file} 
                        onClick={()=>{
                            handleGroupChatPicUpload(recipient?._id).then(()=>{
                                setPhotoDialogOpen(false);
                            });
                        }}
                        style={{ backgroundColor: file ? '#2E613B' : undefined, borderRadius:'10px', color:'#FFFEFE' }}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledChatInfoPanel>
    );
    

    
};

export default ChatInfoPanel;
