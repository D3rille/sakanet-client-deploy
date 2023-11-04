import React, { useRef, useEffect, useState } from 'react';
import { Box, styled, TextField, InputAdornment, IconButton, Tooltip, 
        Typography, InputBase, Avatar, Chip} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from "@mui/icons-material/Close";
import MessageBubble from './MessageBubble';
import { format, set } from 'date-fns';
import {useLazyQuery, useMutation} from "@apollo/client";
import { FIND_USERS, CREATE_NEW_CONVO, CREATE_GROUP_CHAT, GET_CONVERSATIONS } from '../../graphql/operations/chat';
import FindUserResult from './FindUserResult';
import SearchIcon from "@mui/icons-material/Search";
import toast from 'react-hot-toast';
import {useRouter} from "next/router";

const StyledChatExchange = styled(Box)({
    flex: 2,
    padding: '16px',
    height: '90vh',
    position: 'relative',
});

const StyledContainer = styled(Box)({
    paddingTop: 0,
    borderRadius: '10px 10px 0 0',
    border: '1px solid #DBE4EC',
    borderBottom: 'none',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});

const StyledHeader = styled(Box)({
    backgroundColor: '#F4F4F9',
    padding: '8px 16px',
    borderBottom: '1px solid #DBE4EC',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'left',
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    color: '#4A5154',
});

const StyledChatBody = styled(Box)({
    backgroundColor: '#F9FAFC',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
});

const MessageInputContainer = styled(Box)({
    position: 'absolute',
    bottom: '0px',
    left: '16px',
    right: '16px',
    backgroundColor: '#F9FAFC',
    borderRadius: '0 0 10px 10px',
    padding: '1rem',
    border: '1px solid #DBE4EC',
    borderTop: 'none',
    maxHeight: '144px',
});

const MessageInput = styled(TextField)(({ theme }) => ({
    backgroundColor: '#FFFEFE',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
        '&.Mui-focused fieldset': {
            borderColor: '#2E613B',
        },
    },
    '& textarea': {
        overflowY: 'auto',
        maxHeight: '90px',
        minHeight: '24px',
        resize: 'none',
        transition: 'height 0.3s',
    },
}));

const StyledSendIcon = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#2E613B',
    borderRadius: '50%',
    padding: '6px',
    '& svg': {
        color: '#FFF',
        fontSize: '16px',
    },
    margin: '8px 0 8px 8px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: '#1E4A2B',
    },
}));

const SearchPanel = styled(Box)({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F9FAFC",
    borderRadius: "5px",
    margin:"1em",
    border: "1px solid #DBE4EC",
  });

const CreateConvo = ({...props}) => {
    const router = useRouter();
    const {handleSendMessage, handleStartNewConvo} = props;
    // const [inputHeight, setInputHeight] = useState('24px');
    const [messageInput, setMessageInput] = useState('');

    const [query, setQuery] = useState("");
    const [focus, setFocus] = useState(false);
    const [recipients, setRecipients] = useState([]);// data for chip object
    const [recipientIds, setRecipientIds] = useState([]); //ids for createNewConvo and createGroupChat
    const [groupName, setGroupName] = useState("");
    const [sendClicked, setSendClicked] = useState(false);

    const [createNewConvo] = useMutation(CREATE_NEW_CONVO);
    const [createGroupChat] = useMutation(CREATE_GROUP_CHAT); 
    const [findUser, {data, loading, error}] = useLazyQuery(FIND_USERS);
     
    const chatBodyRef = useRef(null);

     const handleCreateNewConvo = async (participants, groupName="") =>{
        try {
            if(participants.length == 1){
                await createNewConvo({
                    variables:{chatPartnerId:participants[0]},
                    refetchQueries:[GET_CONVERSATIONS],
                    onCompleted:(data)=>{
                        handleSendMessage(data?.createNewConversation, messageInput).then(()=>{
                            // setCurrentConvoId(data?.createNewConversation);
                            router.replace(`/Chats?convoId=${data?.createNewConversation}`);
                            handleStartNewConvo();
                        })
                       

                    }, 
                    onError:(error)=>{
                        toast.error("Cannot create conversation." + error)
                    }
                  });
            } else{
                await createGroupChat({
                    variables:{participants, groupName},
                    onCompleted:(data)=>{
                        handleSendMessage(data?.createGroupChat, messageInput).then(()=>{
                            // setCurrentConvoId(data?.createGroupChat);
                            router.replace(`/Chats?convoId=${data?.createGroupChat}`);
                            handleStartNewConvo();
                        })
                        
                    },
                    onError:(error)=>{
                        toast.error(error.message)
                    }
                });
            }

        } catch (error) {
          console.log(error);
        }
    };

    const handleFindUser = (event) =>{
        setQuery(event.target.value);
        findUser({
            variables:{
                "searchInput":query,
                "excludedIds":recipientIds
            }
        });
    };

    const handleInputChange = (event) => {
        const targetValue = event.target.value;
        setMessageInput(targetValue);

        // const targetValueLength = targetValue.length;
        // const targetHeight = targetValueLength > 30 ? Math.min(event.target.scrollHeight, 90) : 24;
        // setInputHeight(`${targetHeight}px`);
    };

    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter' && !event.shiftKey) {
    //         event.preventDefault();
    //         handleSendMessage(conversationId, messageInput);
    //         setMessageInput("");
    //     }
    // };
 
    const handleAddRecipients = (user) =>{
        let newRecipients = recipients;
        let newRecipientIds = recipientIds;
        newRecipients.push(user)
        newRecipientIds.push(user._id)
        setRecipients(newRecipients);
        setRecipientIds(newRecipientIds);
        setQuery("");
        setFocus(false);
    }

    const handleRemoveRecipients = (index) =>{
        let updatedRecipients = [...recipients];
        updatedRecipients.splice(index, 1);
        let updatedRecipientIds = updatedRecipients.map((recipient)=>recipient._id);
        setRecipients([...new Set(updatedRecipients)]);
        setRecipientIds([...new Set(updatedRecipientIds)]);
     
    }

    const Recipients = ({recipients, handleRemoveRecipients}) => {
        return(
            <div
                style={{display:"flex", flexDirection:"row", maxWidth:"50vw",flexWrap: "wrap", }}
            >
                {recipients && recipients.map((user, index)=>(
                    <Chip
                        avatar={<Avatar src={user.profile_pic ?? ""} alt={user.username ?? ""} />}
                        label={user.username ?? ""}
                        onDelete={()=>{handleRemoveRecipients(index)}}
                        key={user._id}
                    
                    />  
                ))}
            </div>
        );

    }
   

    return (
        <StyledChatExchange>
            <StyledContainer>
                <StyledHeader>
                    <Box sx={{alignItems:"center"}}>
                        
                    </Box>
                    Find User: 
                    <SearchPanel>
                        
                    <InputBase
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                            
                            marginLeft:"1em", 
                            marginRight:"2em"
                        }}
                        value = {query}
                        onChange = {handleFindUser}
                        onFocus={()=>{setFocus(true)}}
                        
                    />
                    {query && (
                    <IconButton onClick={()=>{
                        setQuery("");
                        setFocus(false);
                    }}>
                        <CloseIcon sx={{fontSize:"1rem"}}/>
                    </IconButton>
        )}
                     <SearchIcon
                        color="action"
                        style={{ marginRight: "8px", color: "#AEBAC6" }}
                    />

                    </SearchPanel>
                    
                </StyledHeader>
               
                <StyledChatBody ref={chatBodyRef}>
                    {recipients.length>=2 && (<Box
                        sx={{
                            display:"flex",
                            flexDirection:"row",
                            alignItems:"center",
                            paddingTop:"1em",
                        }}
                    >
                        
                        <TextField
                            label="Group Name:"
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                                marginLeft:"1em", 
                                marginRight:"2em"
                            }}
                            value = {groupName}
                            onChange = {(e)=>setGroupName(e.target.value)}
                            
                        />

                    </Box>)}
                <Box
                        sx={{
                            display:"flex",
                            flexDirection:"row",
                            alignItems:"center",
                            padding:"1em",
                            overflowBlock:"spill",
                            width:"100%",
                            position:"relative"
                        }}
                    >
                        <Typography
                            
                        >
                            To: 
                        </Typography>
                        <Recipients recipients={recipients} handleRemoveRecipients={handleRemoveRecipients}/>
                          
                    </Box>
                    <FindUserResult
                        handleAddRecipients={handleAddRecipients}
                        focus={focus}
                        query={query}
                        data={data}
                        loading={loading}
                    />
  
                </StyledChatBody>
            </StyledContainer>
            <MessageInputContainer>
                <MessageInput
                    multiline
                    value={messageInput}
                    placeholder="Enter your message here"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleInputChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {messageInput && (<StyledSendIcon onClick={()=>{
                                    if(messageInput){
                                        if(recipientIds.length == 1){
                                            handleCreateNewConvo(recipientIds);
                                            setSendClicked(true);
                                        } else{
                                            handleCreateNewConvo(recipientIds,groupName);
                                            if(groupName){
                                                setSendClicked(true);
                                            }
                                            
                                        } 
                                        
                                    }                                   
                                    }}>
                                    <SendIcon />
                                </StyledSendIcon>)}
                            </InputAdornment>
                        ),
                    }}
                />
            </MessageInputContainer>
        </StyledChatExchange>
    );
};

export default CreateConvo;
