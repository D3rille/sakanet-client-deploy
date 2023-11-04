import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_NOTIFICATIONS, NOTIF_SUB } from '../graphql/operations/notification';
import {UPDATE_CONVO_COUNT, GET_UNREAD_CONVO} from "../graphql/operations/chat";
import { GET_MY_PROFILE } from '../graphql/operations/profile';
import { AuthContext } from './auth.js';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext); 
  const { subscribeToMore, data } = useQuery(GET_NOTIFICATIONS);
  const {data:profileInfo, loading:myProfileLoading} = useQuery(GET_MY_PROFILE);
  const {data:unreadConvoData, loading:unreadConvoLoading, subscribeToMore:subscribeToNewConvo} = useQuery(GET_UNREAD_CONVO);
  // const {data:convoUpdateData, loading:convoUpdateLoading} = useSubscription(UPDATE_CONVO_COUNT, {
  //   variables:{
  //     receiverId:user?.id
  //   }
  // });
  const [newNotifCount, setNewNotifCount] = useState(0);
  const [newConvoCount, setNewConvoCount] = useState(0);

  const profile = profileInfo?.getMyProfile;
  useEffect(()=>{
    subscribeToMore({
      document:NOTIF_SUB,
      variables:{receiverId:user?.id ?? ""},
      updateQuery:(prev, {subscriptionData})=>{
        if(!subscriptionData.data) return prev;
        const newNotif = subscriptionData.data.newNotification;
        return Object.assign({}, prev, {
          getNotifications: [newNotif, ...prev.getNotifications]
        });
      }
    });
  }, []);

  useEffect(()=>{
    subscribeToNewConvo({
      document:UPDATE_CONVO_COUNT,
      variables:{receiverId:user?.id ?? ""},
      updateQuery:(prev, {subscriptionData})=>{
        if(!subscriptionData.data) return prev;
        const newConvo = subscriptionData.data.updateConversationCount;
        if(prev.getUnreadConversations.includes(newConvo.convoId)){
          return prev
        } else{
          return Object.assign({}, prev, {
            getUnreadConversations: [...prev.getUnreadConversations, newConvo.convoId]
          });
        } 
      }
    });
  }, []);

useEffect(()=>{
  if(unreadConvoData){
    var count = unreadConvoData.getUnreadConversations.length;
    setNewConvoCount(count);
  }
}, [unreadConvoData, unreadConvoLoading, subscribeToNewConvo])

if(data){
  var notifData = {
    getNotifications:[...new Set(data.getNotifications)]
  }

}

useEffect(()=>{
  setNewNotifCount(()=>{
    var count=0;
    notifData && notifData.getNotifications.map((notification)=>{
      if(notification.read == false){
        count++;
      }
    });
    return count;
  })
}, [notifData]);
  
  return (
    <SubscriptionContext.Provider value={{notifData, newNotifCount,newConvoCount, profile}}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubs = () => {
  return useContext(SubscriptionContext);
};
