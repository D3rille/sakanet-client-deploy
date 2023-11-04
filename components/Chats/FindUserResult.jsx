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


function FindUserResult({...props}){
    const {focus, loading, data, query, handleAddRecipients} = props;
    if(loading){
        <CircularProgress/>
    }
    
   
    if(focus && query){
 
        return(
            
            <>
                <div>
                <Paper elevation={3} sx={{overflow:"scroll", 
                maxHeight:"200px", width:"20vw", position:"absolute", 
                zIndex:"1", marginInline:"1rem"}}>
                    <List>
                    {data &&
                        data.findUsers.map((user) => (
                            <React.Fragment key={user._id}>
                            <ListItem onClick={()=>{
                                        handleAddRecipients(user)
                                    }} >
                                <ListItemAvatar>
                                    <Avatar src={user.profile_pic}/>
                                </ListItemAvatar>
                                <ListItemText 
                                primary={
                                    <Link className={styles.searchLink} >
                                        <h3>{user.username}</h3>
                                    </Link>
                                } 
                                secondary={
                                    <>
                                        <Typography sx={{fontSize:"0.7rem"}}>
                                            {formatWideAddress(user.address)}
                                        </Typography>
                                        <Typography sx={{fontSize:"0.7rem"}}>
                                            {user.role=="FARMER" ? "Farmer": "Buyer"}
                                        </Typography>
                                    </>
                                   
                                    } />
                            </ListItem>
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
                </div>
            </>
            
        );
       
    }
    
}

export default FindUserResult;