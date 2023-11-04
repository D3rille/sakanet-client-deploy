import React, {useContext, useEffect} from "react";
import {
  Typography,
  Box,
  Avatar,
  styled,
} from "@mui/material";
import {timePassed} from "../../util/dateUtils";
import { AuthContext } from "../../context/auth";

// const ChatItem = styled(Box)(({ isActive }) => ({
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "7px",
//     backgroundColor: isActive ? "#F9FAFC" : "transparent",
//     border: isActive ? "2px solid #DBE4EC" : "none",
//     borderRadius: "8px",
//     margin: "0.5rem 1rem",
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: '#e9eef2',
//     },
//   }));

const ChatItem = styled(({ isActive, ...otherProps }) => <Box {...otherProps} />)(
    ({ isActive }) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "7px",
      backgroundColor: isActive ? "#F9FAFC" : "transparent",
      border: isActive ? "2px solid #DBE4EC" : "none",
      borderRadius: "8px",
      margin: "0.5rem 1rem",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: isActive ? "#F9FAFC" : "#e9eef2",
      },
    })
  );

  const UserInfo = styled(Box)({
    maxWidth: "65%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
    justifyContent: "flex-start",
  });

const ChatItems = ({chat, selectedChatId, handleChatClick, handleReadConvo, currentConvoId}) => {
    const {user} = useContext(AuthContext);
    const highLightonUnreadConvo = !chat.hasSeenLastMessage.includes(user.id);

    useEffect(()=>{
        if(currentConvoId == chat._id){
            handleReadConvo(chat._id);
        }
    }, []);

    return(
        <ChatItem
            // key={chat._id}
            isActive={chat._id === selectedChatId}
            onClick={() => {
                handleChatClick(chat._id);
                handleReadConvo(chat._id);
            }}
        >
        <Box display="flex" alignItems="center">
            <Avatar
            src={chat.profile_pic}
            style={{
                marginRight: "12px",
                borderColor: "#FFFEFE",
                borderWidth: 2,
                borderStyle: "solid",
            }}
            />
            <UserInfo>
            <Typography
                variant="subtitle1"
                noWrap
                sx={{ 
                    textAlign: "left",
                    fontWeight: highLightonUnreadConvo ? "Bolder":"Normal"
                 }}
            >
                {chat.name}
            </Typography>
            <Typography
                sx={{
                    width:"10ch",
                    fontWeight: highLightonUnreadConvo ? "Bolder":"Normal"
                }}
                variant="body2"
                color={highLightonUnreadConvo ? "textPrimary":"textSecondary"}
                noWrap
                style={{ textAlign: "left" }}
            >
                {chat.lastMessage.from == user.id 
                ? `You: ${chat.lastMessage.message}`
                : chat.lastMessage.message
                }
            </Typography>
            </UserInfo>
        </Box>
        <Typography variant="caption" color={highLightonUnreadConvo ? "textPrimary":"textSecondary"} sx={{fontWeight: highLightonUnreadConvo ? "Bolder":"Normal"}}>
            {chat.lastMessage.createdAt ? timePassed(chat.lastMessage.createdAt):""}
        </Typography>
        </ChatItem>
    );

}

export default ChatItems;