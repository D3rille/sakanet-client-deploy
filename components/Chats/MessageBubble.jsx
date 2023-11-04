import React from 'react';
import { Box, Avatar, styled, Typography } from '@mui/material';
import { formatDate } from '../../util/dateUtils';


const StyledMessageBubble = styled(Box)(({ sender }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '12px 0',
    margin: '3px 0',
    justifyContent: sender ? 'flex-end' : 'flex-start',
}));

const StyledBubble = styled(Box)(({ sender }) => ({
    textAlign:"start",
    position: 'relative',
    padding: '1em',
    borderRadius: '12px',
    backgroundColor: sender ? '#33816A' : '#FFFEFE',
    color: sender ? '#FFFFFF' : '#000000',
    maxWidth:"30vw"
}));

const StyledAvatar = styled(Avatar)(({ sender }) => ({
    margin: '0 8px',
}));

const StyledTime = styled(Box)(({ sender }) => ({
    fontSize: '0.7rem',
    color: '#999',
    // display:"flex",
    // justifyContent:"end",
    // alignItems:"flex-end",
    // position: 'absolute',
    bottom: '-20px',
    left: sender ? 'auto' : '12px',
    right: sender ? '12px' : 'auto',
}));

const SystemMessage =  ({message}) =>{
    return(
        
        <Typography style={{fontSize:"0.7rem", color:"grey", margin:"1"}}>
            {message}
        </Typography>
        
        
    );
}

const MessageBubble = ({ msg, currentUser, isGroup }) => {
    const {createdAt, username, sender, message, profile_pic} = msg;
    var myMessage;
    if(sender==""){
        return(
            <SystemMessage message={message} />
        );
    } else{
        if(sender == currentUser){
            myMessage = "true"
        } else{
            myMessage = ""
        }
        return(
            <>
            <StyledMessageBubble sender={myMessage}>
                {!myMessage && <StyledAvatar src={profile_pic} />}
                <Box sx={{justifyContent:"end", alignItems:"center"}}>
                   {username && !myMessage && isGroup && ( <Box sx={{textAlign:Boolean(myMessage) ? "end":"start"}}>
                        <StyledTime sender={myMessage}>
                            {username}
                        </StyledTime>
                    </Box>)}
                    <Box position="relative">
                        <StyledBubble sender={myMessage}>
                            {message}
                            
                        </StyledBubble>
                    </Box>
                    <Box sx={{textAlign:Boolean(myMessage) ? "end":"start"}}>
                        <StyledTime sender={myMessage}>
                            {formatDate(createdAt, "lll")}
                        </StyledTime>
                    </Box>
                </Box>
               
                

                {myMessage && <StyledAvatar src={profile_pic} />}
               
            </StyledMessageBubble>
            
            </>
            
        );
    }

};

export default MessageBubble;
