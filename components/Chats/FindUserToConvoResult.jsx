import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { formatWideAddress } from '../../util/addresssUtils';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/Navbar.module.css';
import Link from  '@mui/material/Link';
import { Typography } from '@mui/material';


function FindUserToConvoResult({...props}){
    const {focus, loading, data, query, handleCreateConvo } = props;//handleCreateConvo
    if(loading){
        <CircularProgress/>
    }
    if(focus && query){
        return(
            
            
            <List sx={{padding:"1rem"}}>
            {data &&
                data.findUserToChat.map((user) => (
                    <React.Fragment key={user._id}>
                    <ListItem 
                        dense 
                        sx={{
                            borderRadius:"0.5rem",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: '#e9eef2',
                            },
                        }}
                        onClick={()=>{
                            if(user.role=="GROUP"){
                                handleCreateConvo(user._id, true);
                            } else{
                                handleCreateConvo(user._id, false);
                            }
                                
                                    // handleCreateConvo HERE!!!
                        }} 
                    >
                        <ListItemAvatar>
                            <Avatar src={user.profile_pic}/>
                        </ListItemAvatar>
                        <div style={{flexDirection:"column"}}>
                            <Link className={styles.searchLink} >
                                    <h5>{user.username}</h5>
                            </Link>

                            <Typography sx={{fontSize:"0.7rem"}}>
                                {formatWideAddress(user.address)}
                            </Typography>
                            <Typography sx={{fontSize:"0.7rem"}}>
                                {user.role=="FARMER" ? "Farmer": user.role== "BUYER" ? "Buyer" :"Group"}
                            </Typography>
                        </div>
                    </ListItem>
                    </React.Fragment>
                ))}
            </List>

           
            
        );
       
    }
    
}

export default FindUserToConvoResult;