import React, { useRef, useEffect, useState, useContext } from 'react';
import { Box, styled, TextField, InputAdornment, IconButton, Tooltip, Typography, Avatar, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageBubble from './MessageBubble';
import { format } from 'date-fns';
import CircularLoading from "../circularLoading";
import {useSubs} from "../../context/SubscriptionProvider";
import { AuthContext } from '../../context/auth';
import { Waypoint } from 'react-waypoint';

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

// const StyledChatBody = styled(Box)(({ inputHeight }) => ({
//     backgroundColor: '#F9FAFC',
//     flex: 1,
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//     margin: 0,
//     paddingBottom: `calc(${inputHeight} + 10vh)`,
// }));

const StyledChatBody = styled(Box)(({ inputHeight }) => ({
    backgroundColor: '#F9FAFC',
    flex: 1,
    overflowY: "auto",
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    paddingInline:"1em",
    paddingBottom: "10vh",
    // height: `calc(100% - ${inputHeight})`, // Use height instead of passing inputHeight as a prop
}));

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

const ChatExchange = ({...props}) => {
    const { profile } = useSubs();
    const {user} = useContext(AuthContext);
    const {
        getMessagesData, 
        getMessagesLoading, 
        getMessagesError, 
        handleSendMessage,
        getMoreMessages, 
        conversationId} = props;
    const [inputHeight, setInputHeight] = useState('24px');
    const [messageInput, setMessageInput] = useState('');
    const [loadNext, setLoadNext] = useState(false);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const recipient = getMessagesData?.getMessages;
   
    const chatBodyRef = useRef(null);
    

    useEffect(() => {
        if(loadNext){
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - prevScrollHeight;
            setPrevScrollHeight(chatBodyRef.current.scrollHeight);
        }
        else if(chatBodyRef.current){
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            setPrevScrollHeight(chatBodyRef.current.scrollHeight);
        }
    }, [recipient]);

    const handleInputChange = (event) => {
        const targetValue = event.target.value;
        setMessageInput(targetValue);

        const targetValueLength = targetValue.length;
        const targetHeight = targetValueLength > 30 ? Math.min(event.target.scrollHeight, 90) : 24;
        setInputHeight(`${targetHeight}px`);
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage(conversationId, messageInput);
            setMessageInput("");
        }
    };
   return (
        <StyledChatExchange>
            <StyledContainer>
                <StyledHeader>
                    {recipient && (<Avatar 
                        // src={"https://res.cloudinary.com/sakanet/image/upload/v1692345062/palay_yoqze9.jpg"} 
                        src={recipient.recipientPic ?? ""}
                        alt={recipient.recipientUsername ?? ""}
                        sx={{
                            marginInline:"1rem"
                        }}
                    />)}
                    {recipient?.recipientUsername ? recipient.recipientUsername :"Message"}
                </StyledHeader>
                <StyledChatBody ref={chatBodyRef}>
                {getMessagesLoading && (<CircularLoading/>)}
                {!recipient?.messages && !getMessagesLoading && (<Typography sx={{display:"flex", margin:"auto"}}> Select a Conversation</Typography>)}
                {/* <Button
                onClick={(e)=>{
                    e.preventDefault();
                    getMoreMessages();
                }}
                >
                    See More
                </Button> */}
                {recipient?.messages?.map((msg, index) => (
                    <React.Fragment key={index}>
                        <MessageBubble msg = {msg} currentUser = {user.id} isGroup={recipient?.isGroup}/>
                        {index == 0 && (<Waypoint onEnter={()=>{
                            getMoreMessages();
                            setLoadNext(true);
                            }}/>)}
                    </React.Fragment>
                    // recipient.messages.length -1
                
                ))}
                </StyledChatBody>
            </StyledContainer>
            <MessageInputContainer>
                <MessageInput
                     {...(!recipient ? { disabled: true } : {})}
                    multiline
                    value={messageInput}
                    placeholder="Enter your message here"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    inputProps={{
                        style: { height: inputHeight },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {recipient && messageInput && (<StyledSendIcon onClick={()=>{
                                    handleSendMessage(conversationId, messageInput);
                                    setMessageInput("");
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

export default ChatExchange;
