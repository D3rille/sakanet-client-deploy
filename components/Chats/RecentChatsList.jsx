import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Divider,
  Box,
  InputBase,
  Avatar,
  styled,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
} from "@mui/material";
import { darken } from "@mui/system";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ChatItems from "./ChatItems";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
// import {SEARCH_USERS} from "../../graphql/operations/search";
import { FIND_USER_TO_CHAT, GET_CONVERSATIONS, GET_UNREAD_CONVO, UPDATE_CONVOS} from "../../graphql/operations/chat";
import FindUserToConvoResult from "./FindUserToConvoResult";
import CircularLoading from "../circularLoading";
import { AuthContext } from "../../context/auth";
import {useRouter} from "next/router";
import { Waypoint } from "react-waypoint";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "1.5rem",
  marginBottom: "0.5rem",
  marginLeft: "1.5rem",
  marginRight: "1.5rem",
});

const StyledDivider = styled(Divider)({
  marginLeft: "1.5rem",
  marginRight: "1.5rem",
});

const StyledContainer = styled(Box)({
  flex: 1,
  minHeight: "90vh",
  minWidth: 0,
  overflowX: "hidden",
});

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

const ChatItem = styled(Box)(({ isActive }) => ({
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
    backgroundColor: '#e9eef2',
  },
}));

const CreateChatBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginLeft: "1.5rem",
  marginRight: "1.5rem",
  marginBottom: "0.5rem",
  marginTop: "0.5rem",
});

const ChatListContainer = styled(Box)({
  height: "58vh",
  overflowY: "auto",
  overflowX: "hidden",
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

const ModalButton = styled(Button)({
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
  marginLeft: "1.5rem",
  marginBottom: "0.5rem",
});

const SuggestedContainer = styled(Box)({
  maxHeight: "40vh",
  overflowY: "auto",
  overflowX: "hidden",
  marginRight: "1.5rem",
});

const RecentChatsList = ({...props}) => {
  const router = useRouter();
  const {user} = useContext(AuthContext);
  const {newConvo, handleStartNewConvo, handleCreateConvo, currentConvoId, readConvo} = props;
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [numPage, setNumPage] = useState(1);
 
  const [focus, setFocus]  = useState(false);
  const [query, setQuery] = useState("");

  useEffect(()=>{
    if(currentConvoId){
      setSelectedChatId(currentConvoId);
    }
  },[currentConvoId]);

  
  const {
    data:getConvosData, 
    loading:getConvosLoading, 
    subscribeToMore:subscribeToMoreConvos, 
    refetch:refetchConvos,
    fetchMore:getMoreConversations
  } = useQuery(GET_CONVERSATIONS,{
    variables:{
      limit:10,
      page:1
    },
    onError:(error)=>{
      toast.error(error);
    }
  });

  const handleGetMoreConversations = () =>{
    if(getConvosData?.getConversations?.hasNextPage){
      getMoreConversations({
        variables:{
          limit:10,
          page: numPage + 1
        },
        onCompleted:()=>{
          setNumPage(numPage + 1);
        },
        onError:(error)=>{
          toast.error(error.message);
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            getConversations: {
              ...prev.getConversations,
              hasNextPage: fetchMoreResult?.getConversations?.hasNextPage,
              conversations:[...prev?.getConversations?.conversations, ...fetchMoreResult?.getConversations?.conversations],
            }
          });
          
        },
      })
    }
  }

  const [findUser, {data:findUserData, loading:findUserLoading}] = useLazyQuery(FIND_USER_TO_CHAT);

  useEffect(()=>{
    subscribeToMoreConvos({
      document:UPDATE_CONVOS,
      variables:{receiverId:user?.id ?? ""},
      updateQuery:(prev, {subscriptionData})=>{
        if(!subscriptionData.data) return prev;
        refetchConvos({
          variables:{
            limit:10,
            page:1
          },
          onCompleted:()=>{
            setNumPage(2);
          }
        });
      }
    });
  }, []);

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
    router.replace(`/Chats?convoId=${chatId}`)
    // setCurrentConvoId(chatId);
  };

  const handleReadConvo = (conversationId) =>{
    try {
      readConvo({
        variables:{
          conversationId
        },
        refetchQueries:[GET_CONVERSATIONS, GET_UNREAD_CONVO]
      });
    } catch (error) {
      console.log(error);
    }
    
  }

  const handleFindUser = (event) =>{
    setQuery(event.target.value);
    findUser({
        variables:{
            "searchInput":query,
        }
    });
};

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <StyledContainer elevation={3}>
      <StyledBox>
        <Box marginRight={1}>
          <Image
            src="/icons/Chats.svg"
            alt="Chats Icon"
            width={48}
            height={48}
          />
        </Box>
        <Typography
          variant="h5"
          style={{ fontWeight: "bold", color: "#4A5154" }}
        >
          Chats
        </Typography>
      </StyledBox>
      <StyledDivider />

      <CreateChatBox>
        <Typography color="#4A5154">Create Chat</Typography>
        <IconButton onClick={()=>{handleStartNewConvo()}}>
          {newConvo && (<CloseIcon color="action" style={{ color: "red" }} />)}
          {!newConvo && (<AddIcon color="action" style={{ color: "#4A5154" }} />)}
        </IconButton>
      </CreateChatBox>

      <SearchPanel>
        <InputBase  
          value={query}
          onChange={handleFindUser}
          onFocus={()=>{setFocus(true)}}
          onBlur={()=>{
            if(!query){
              setFocus(false)
            }
            
          }}
          placeholder="Search"
          fullWidth
          style={{ paddingLeft: "8px", color: "#AEBAC6" }}
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

      <ChatListContainer>
        {getConvosLoading && (
          <div style={{width:"100%", display:"flex", padding:"auto"}}>
            <CircularLoading/>
          </div>
        
        )}
        {!focus && getConvosData?.getConversations?.conversations.map((chat, index) => (
          // <React.Fragment key={index}>
          <Waypoint key={index} onEnter={()=>{
            if(index==getConvosData?.getConversations?.conversations.length -1){
              handleGetMoreConversations();
            }
          }}>
            <div>
              <ChatItems 
                chat={chat} 
                selectedChatId={selectedChatId} 
                handleChatClick={handleChatClick} 
                handleReadConvo={handleReadConvo}
                currentConvoId={currentConvoId}
                />
            </div>
          </Waypoint>
          //     {index == getConvosData?.getConversations?.conversations.length-1 &&
          //     (<Waypoint onEnter={()=>{handleGetMoreConversations()}}/>)}
          // </React.Fragment>
        ))}
        {focus && (
          <FindUserToConvoResult 
            handleCreateConvo={handleCreateConvo} 
            focus={focus} query={query} 
            data={findUserData} 
            loading={findUserLoading}
          />
        )}
        
      </ChatListContainer>
    </StyledContainer>
  );
};

export default RecentChatsList;
