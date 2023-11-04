import React from 'react';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { useEffect } from 'react';
import { useSubs } from '../context/SubscriptionProvider.js';
import {timePassed} from "../util/dateUtils";

// const markAsRead = () => {
    
// };
// const clearAllNotifications = () => {
// }

const NotificationContainer = styled('div')({
    backgroundColor: '#FFFFFF',
    border: '1px solid #e1e1e1',
    borderRadius: '10px',
    width: '450px', 
    height: '600px', 
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
});

const NotificationHeader = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    fontWeight: 'bolder',
    color: '#323233',
    marginTop: '1rem',
    marginBottom: '1rem',
    fontSize: '17px',
    width: '100%',
});

const NotificationFooter = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'white',
    position: 'sticky',
    bottom: 0,
    fontSize: '13px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
});

const FooterAction = styled('span')({
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: '90%',
    padding: '5px 10px',
    color: '#32816B',
    fontWeight: 500
});

const VerticalDivider = styled('div')({
    width: '1px',
    height: '100%',
    backgroundColor: '#e1e1e1',
});

const NotificationItem = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    cursor: 'pointer',
});

const LeftSection = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginLeft: '13px',
    marginTop: '0.6rem',
    marginBottom: '0.6rem',
    fontSize: '14px'
});

const UserInfo = styled('div')({
    marginLeft: '10px',
});

const StyledDivider = styled('div')({
    borderTop: '1px solid #e1e1e1',
    marginLeft: '1.2rem',
    marginRight: '1.2rem',
});

const NotificationContent = styled('div')({
    flex: 1,
    overflowY: 'auto'
});

const Notifications = ({deleteNotif, clearNotifs}) => {
    const { notifData } = useSubs();

    if (!notifData || notifData == []) {
        return (<p>No Notifications<br></br></p>);
    }

    return (
        <NotificationContainer>
            <NotificationHeader>
                <NotificationsActiveIcon color="action" style={{ color: "#2F613A", marginRight: "8px" }} />
                Notifications
            </NotificationHeader>
            <StyledDivider />
            <NotificationContent>
                {notifData && notifData.getNotifications.map((notif) => (
                    <React.Fragment key={notif._id}>
                        <NotificationItem>
                            <LeftSection>
                                <Avatar />
                                <UserInfo>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>{notif.from}</span>
                                    </div>
                                    <div>{notif.message}</div>
                                </UserInfo>
                            </LeftSection>
                            <div style={{display:"flex", flexDirection:"column", justifyContent:"start", alignItems:"flex-end"}}>
                                <div >
                                <IconButton
                                    onClick={()=>{
                                        deleteNotif({variables:{notificationId:notif._id}})
                                    }}
                                    sx={{
                                    color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon sx={{fontSize:"1rem"}} />
                                </IconButton>
                                </div>
                                <div style={{justifyContent:"end", alignItems:"flex-end"}}>
                                    <span style={{
                                        fontSize: '0.77rem',
                                        fontWeight: 100,
                                        marginRight: '1.1rem',
                                        color: '#D4D4D4',
                                        margin: '0.6rem',
                                    }}>{timePassed(notif.createdAt)}</span>
                                </div>
                            </div>
 
                            
                        </NotificationItem>
                        {notifData.length !== notifData.length - 1 && <StyledDivider />}
                    </React.Fragment>
                ))}
            </NotificationContent>
            <NotificationFooter>
                <FooterAction onClick={()=>{
                    clearNotifs();
                }}>Clear all</FooterAction>
            </NotificationFooter>
        </NotificationContainer>
      
    );
};

export default Notifications;
