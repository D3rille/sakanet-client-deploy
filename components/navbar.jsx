import React, { useEffect, useState, useContext } from "react";
import Logo from "../public/images/LOGO-FINAL.png";
import message from "../public/icons/MessagesIcon.svg";
import notif from "../public/icons/NotificationsIcon.svg";
import drop from "../public/icons/DropdownIcon.svg";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Profile from "../public/images/9fece8c293b6f0a500453f23fddd8f9b.jpg";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, Card, Button, Link } from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/auth";
import Image from "next/image";
import { GET_MY_PROFILE } from "../graphql/operations/profile";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import CartModal from "./Cart/CartModal";
import Notifications from './Notifications';
import client from "@/graphql/apollo-client";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import OrderIcon from "@mui/icons-material/Assignment";
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useSubs } from "../context/SubscriptionProvider.js";
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import {READ_ALL_NOTIF} from "../graphql/operations/notification";
import { GET_NOTIFICATIONS, DELETE_NOTIFICATION, CLEAR_NOTIFICATIONS } from "../graphql/operations/notification";
import { GET_CART_ITEMS } from "@/graphql/operations/cart";
import { SEARCH_USERS } from '../graphql/operations/search';
import SearchResult from "../components/search/searchResult";


const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Navbar = () => {
  const {newNotifCount, profile, newConvoCount} = useSubs();
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const drawerWidth = 240;
  const [activeTab, setActiveTab] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(true);
  const [getSuggestions, {loading:searchLoading, data:searchData}] = useLazyQuery(SEARCH_USERS);

  const profile_pic = profile?.profile_pic;
  const handleQueryChange=(event)=>{
    const newQuery = event.target.value;
    setQuery(newQuery);
    getSuggestions({ variables: { searchInput: query } });
  }

  //Reading all Notification
  const [readAllNotif] = useMutation(READ_ALL_NOTIF, {
    refetchQueries:[GET_NOTIFICATIONS]
  });

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
    readAllNotif();
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

const handleNotificationClick = () => {
  setNotificationOpen(!notificationOpen);
};

const markAllAsRead = () => {
  const updatedNotifications = notifications.map(notif => ({ ...notif, unread: false }));
  setNotifications(updatedNotifications);
};

  const handleCartModalOpen = () => {
    setCartModalOpen(true);
  };
  const handleCartModalClose = () => {
    setCartModalOpen(false);
  };

  const router = useRouter();

  // const isActiveTab = (path) => {
  //   return router.pathname === path;
  // };

  const isActiveTab = (paths) =>{
    const currentPath = router.pathname;
    return paths.includes(currentPath);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    // if (path) {
    //   router.push(path);
    // }
    setAnchorEl(null);
  };
  

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getResponsiveCardStyle = () => {
    if (screenWidth <= 768) {
      return {
        borderRadius: "15px",
        width: "98%",
        display: "flex",
        border: "none",
        padding: "0px",
      };
    } else if (screenWidth <= 576) {
      return {
        borderRadius: "10px",
        width: "80%",
        display: "flex",
        border: "none",
        padding: "0px",
      };
    } else {
      return {
        borderRadius: "25px",
        width: "90%",
        display: "flex",
        border: "none",
        padding: "0px",
      };
    }
  };

  const cardStyle = getResponsiveCardStyle();
  // const { loading, error, data } = useQuery(GET_MY_PROFILE);
  const [deleteNotif]= useMutation(DELETE_NOTIFICATION, {
    refetchQueries:[GET_NOTIFICATIONS]
  });
  const [clearNotifs] = useMutation(CLEAR_NOTIFICATIONS, {
    refetchQueries:[GET_NOTIFICATIONS]
  });

  const {data:getCartItemsData, loading:getCartItemsLoading} = useQuery(GET_CART_ITEMS);

  
  if (user.role=="ADMIN") return;

  // <Drawer
  //       sx={{
  //         width: drawerWidth,
  //         flexShrink: 0,
  //         "& .MuiDrawer-paper": {
  //           width: drawerWidth,
  //           boxSizing: "border-box",
  //         },
  //       }}
  //       variant="persistent"
  //       anchor="left"
  //       open={open}
  //     >
  //       <DrawerHeader>
  //         <div
  //           style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
  //         >
  //           {/* <img style={{ width: '60px' }} alt="Travis Howard" src={Logo} /> */}
  //           <Image src={Logo} alt="Logo" width={60} height={60} />
  //         </div>
  //         <IconButton onClick={handleDrawerClose}>
  //           {theme.direction === "ltr" ? (
  //             <ChevronLeftIcon />
  //           ) : (
  //             <ChevronRightIcon />
  //           )}
  //         </IconButton>
  //       </DrawerHeader>
  //       <Divider />
  //       <List>
  //         {["Home", "Products", "My Network", "Messages", "Notifications"].map(
  //           (text, index) => (
  //             <ListItem key={text} disablePadding>
  //               <ListItemButton
  //                 sx={{
  //                   "&:hover": {
  //                     backgroundColor: "#f1f1f1",
  //                     cursor: "pointer",
  //                   },
  //                 }}
  //               >
  //                 <ListItemText primary={text} />
  //               </ListItemButton>
  //             </ListItem>
  //           )
  //         )}
  //       </List>
  //       <Divider />
  //       <List>
  //         {["Edit Profile", "Change Password", "Logout"].map((text, index) => (
  //           <ListItem key={text} disablePadding>
  //             <ListItemButton onClick={text === "Logout" ? logout : null}>
  //               <ListItemText primary={text} />
  //             </ListItemButton>
  //           </ListItem>
  //         ))}
  //       </List>
  //     </Drawer>

  const productRoutes = /\/Products.*/;
  const myProductsRoutes = /\/myProducts.*/;
  return (
    <>
      <div key="element1" className={styles.header}>
        <div className={[styles.navsection]}  style={cardStyle} elevation={3}>
          <div className={styles.menu} onClick={handleDrawerOpen}>
            <MenuIcon />
          </div>
          
          <div style={{paddingInline:"1vw", paddingBlock:"2px"}}>
            <Link onClick={()=>{
              router.replace("/");
            }}>
              <Image src={Logo} alt="Logo" width={70} height={50} />
            </Link>
          </div>
            
          <div className={styles.logosearchbar}>
            <TextField
              size="small"
              type="text"
              valued ={query}
              onChange={handleQueryChange}
              onFocus={()=>{setFocus(true)}}
              onBlur={()=>{
                setFocus(false);
              }}
              className={styles.searchicon}
              fullWidth
              sx={{
                borderRadius: "30px",
                backgroundColor: "#f1f3fa",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                    borderRadius: "30px",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search "
            />
            <SearchResult data={searchData} loading={searchLoading} query={query} setQuery={setQuery} setFocus={setFocus}/>
          </div>
          <div className={styles.tabs}>
            <ul>
              <li
                style={
                  (productRoutes.test(router.pathname) || myProductsRoutes.test(router.pathname))
                    ? {
                        cursor: "pointer",
                        backgroundColor: "#2F613A",
                        color: "white",
                      }
                    : { cursor: "pointer" }
                }
                onClick={() =>{ 
                    if(user.role == "BUYER"){
                      router.push("/Products")
                    }
                    else {
                      router.push("/myProducts")
                    }
                  }
                 }
              >
                Products
              </li>
              {/* <li
                style={
                  isActiveTab(["/"])
                    ? {
                        cursor: "pointer",
                        backgroundColor: "#2F613A",
                        color: "white",
                      }
                    : { cursor: "pointer" }
                }
                onClick={() => router.push("/")}
              >
                Home
              </li> */}
              <li
                style={
                  isActiveTab(["/myNetwork"])
                    ? {
                        cursor: "pointer",
                        backgroundColor: "#2F613A",
                        color: "white",
                      }
                    : { cursor: "pointer" }
                }
                onClick={() => router.push("/myNetwork")}
              >
                My Network
              </li>
            </ul>
          </div>
          <div className={styles.components}>
            <div className={styles.username}>
              <Chip
                avatar={<Avatar src={profile_pic} />}
                onClick={() => {
                  router.push("/myProfile");
                }}
                label={user?.username ?? "user"}
                color = {router.pathname == "/myProfile" ? "success":"default"}
              />
            </div>
            <div className={styles.icons}>
             
                <IconButton
                  onClick={()=>{
                    router.push("/Chats")
                  }}
                >
                  <Badge badgeContent={newConvoCount} color="primary">
                  <Image 
                  sx={{
                    cursor: "pointer",
                    bgcolor: "transparent",
                    "& img": { width: "auto", height: "auto" },
                  }}
                   src={message} alt="Messaging" width={30} height={30} />
                   </Badge>
                </IconButton>
                
              
             
                <IconButton
                    onClick={handleNotifClick}
                  >
                  <Badge badgeContent={newNotifCount} color="primary">
                  <Image 
                  sx={{
                    cursor: "pointer",
                    bgcolor: "transparent",
                    "& img": { width: "auto", height: "auto" },
                  }}
                  src={notif} alt="Notifications" width={30} height={30} />
                   </Badge>
                </IconButton>
             
              <Popover
                  open={Boolean(notifAnchorEl)}
                  anchorEl={notifAnchorEl}
                  onClose={handleNotifClose}
                  anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
                  sx={{
                      borderRadius: '10px'
                  }}
              >
                <Notifications deleteNotif={deleteNotif} clearNotifs={clearNotifs}/>
              </Popover>
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "transparent",
                  "& img": { width: "auto", height: "auto" },
                }}
                alt="Drop"
                onClick={handleClick}
              >
                <Image src={drop} alt="Travis Howard" width={40} height={40} />
              </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  width: '200px',
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={()=>{
                handleClose();
                router.push("/Orders");
                }}>
                <ListItemIcon>
                  <OrderIcon fontSize="small" />
                </ListItemIcon>
                Orders
              </MenuItem>
              {user.role == "FARMER" && (<MenuItem onClick={()=>{
                handleClose();
                router.push("/Statistics");
                }}>
                <ListItemIcon>
                  <InsertChartIcon fontSize="small" />
                </ListItemIcon>
                  Statistics
              </MenuItem>)}
              {user.role == "BUYER" && (<MenuItem onClick={handleCartModalOpen}>
                <ListItemIcon>
                  <ShoppingCartIcon fontSize="small" />
                </ListItemIcon>
                Cart
              </MenuItem>)}
              <MenuItem onClick={() => {
                setAnchorEl(null);
                router.push("/Settings");
              }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

              <Divider style={{ marginLeft: '16px', marginRight: '16px' }} />
              <MenuItem onClick={()=>{
                logout();
                client.clearStore();
                }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>


              {notificationOpen && <Notifications markAsRead={markAllAsRead} />}
            </div>
            {getCartItemsData && (<CartModal
              open={cartModalOpen}
              handleClose={handleCartModalClose}
              getCartItemsData = {getCartItemsData}
              getCartItemsLoading = {getCartItemsLoading}
            />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
