import React, { useState, useContext, useEffect } from "react";
import {
    Grid, Typography, Divider, Box, Tabs, Tab, Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';
import PendingOrders from "../../components/Orders/PendingOrders";
import AcceptedOrders from "../../components/Orders/AcceptedOrders";
import ForCompletionOrders from "../../components/Orders/ForCompletionOrders";
import CompletedOrders from "../../components/Orders/CompletedOrders";
import { useQuery, useMutation} from "@apollo/client";
import Head from 'next/head';
import {
   GET_ORDERS, 
   UPDATE_STATUS, 
   CANCEL_ORDER, 
   DECLINE_ORDER, 
   SEND_SELLER_PAYMENT_CHANNELS,
   RETURN_STOCK
  } from "../../graphql/operations/order";
import { GET_MY_PRODUCTS } from "../../graphql/operations/product";
import { AuthContext } from '@/context/auth';
import CircularLoading from  "../../components/circularLoading";
import toast from 'react-hot-toast';
import { useRouter } from "next/router";

const StyledGrid = styled(Grid)({
    background: '#F4F4F4',
});

const StyledPaper = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#F9F8F8',
    textAlign: 'center',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '6.5rem',
    borderRadius: '20px',
    overflow: 'hidden',
    minHeight: '100vh'
});

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role == 'ADMIN') {
      router.push('/404');
    }
  }, [user]);

  return user.role != 'ADMIN' ? <Orders /> : null;
}

function Orders() {
    const { user } = useContext(AuthContext);
    const [tabValue, setTabValue] = useState(0);

    const tabEquivalents = ["Pending", "Accepted", "For Completion", "Completed"];

    const {data, loading, error, fetchMore:fetchMoreOrders} = useQuery(GET_ORDERS,{
        variables:{
            status:tabEquivalents[tabValue],
            limit: 10,
            cursor:null
        },
        onError:(error)=>{
            console.log(error);
        }
    });

    const handleGetMoreOrders = () =>{
      if(data?.getOrders?.hasNextPage){
        fetchMoreOrders({
          variables:{
            status:tabEquivalents[tabValue],
            limit:10,
            cursor:data?.getOrders?.endCursor
          },
          onError:(error)=>{
            toast.error(error.message)
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              getOrders: {
                ...prev.getOrders,
                endCursor:fetchMoreResult?.getOrders?.endCursor,
                hasNextPage: fetchMoreResult?.getOrders?.hasNextPage,
                orders:[...prev?.getOrders?.orders, ...fetchMoreResult?.getOrders?.orders],
              }
            });
            
          },
        })
      }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [updateStatus] = useMutation(UPDATE_STATUS, {
        onError:(error)=>{
            toast.error(error.message);
            console.log(error);
        }
    });

    const [sendSellerPaymentChannels] = useMutation(SEND_SELLER_PAYMENT_CHANNELS);

    const handleUpdateStatus = async (orderId, currentStatus, nextStatus, buyerId, modeOfPayment) => {
        try {
          await updateStatus({
            variables: {orderId},
            onCompleted:()=>{
              if(tabEquivalents[tabValue] == "Accepted" && modeOfPayment == "Online"){
                sendSellerPaymentChannels({
                  variables:{
                      buyerId
                  }
                });
              }
            },
            refetchQueries:[
            {
              query:GET_ORDERS,
              variables:{
                status:currentStatus,
                limit:10,
                cursor:null
              }
            },
            {
              query:GET_ORDERS,
              variables:{
                status:nextStatus,
                limit:10,
                cursor:null
              }
            }
          ],
          });
        } catch (error) {
          console.error('Error updating status:', error);
        }
      };
    
    const [cancelOrder, {error:cancelOrderError}] = useMutation(CANCEL_ORDER, {
        onError:(cancelOrderError)=>{
            toast.error(cancelOrderError.message);
            console.error(cancelOrderError);
        }
    });

    const handleCancelOrder = async (orderId) => {
        try {
          await cancelOrder({
            variables: { orderId },
            update: (cache) => {
              // Check if the query result exists in the cache
              const existingData = cache.readQuery({ query: GET_ORDERS});
              if (!existingData || !existingData.getOrders) {
                return;
              }
      
              // Fetch the existing data from the cache
              const { getOrders } = existingData;
      
              // Remove the canceled order from the cache
              const updatedOrders = getOrders.orders.filter((order) => order?._id !== orderId);
      
              // Write the updated data back to the cache
              cache.writeQuery({
                query: GET_ORDERS,
                data: {
                  getOrders: {
                    ...getOrders,
                    orders:updatedOrders
                  },
                },
              });
            },
          });
        } catch (error) {
          // Handle any errors
          console.log(error);
        }
    };

    const [declineOrder, {error:declineOrderError}] = useMutation(DECLINE_ORDER, {
        refetchQueries:[GET_ORDERS],
        onError:(declineOrderError)=>{
            toast.error(declineOrderError.message);
            console.error(declineOrderError);
        }
    });

    const handleDeclineOrder = async (orderId, reason) => {
        try {
          await declineOrder({
            variables: { orderId, reason },
            update: (cache) => {
              // Check if the query result exists in the cache
              const existingData = cache.readQuery({ query: GET_ORDERS});
              if (!existingData || !existingData.getOrders) {
                return;
              }
      
              // Fetch the existing data from the cache
              const { getOrders } = existingData;
      
              // Remove the canceled order from the cache
              const updatedOrders = getOrders.orders.filter((order) => order?._id !== orderId);
      
              // Write the updated data back to the cache
              cache.writeQuery({
                query: GET_ORDERS,
                data: {
                  getOrders: {
                    ...getOrders,
                    orders:updatedOrders
                  },
                },
              });
            },
          });
        } catch (error) {
          // Handle any errors
          console.log(error);
        }
    };

    const [returnStock] = useMutation(RETURN_STOCK);
    const handleReturnStock = (orderId, productId) => {
      returnStock({
        variables:{
          orderId,
          productId
        },
        refetchQueries:[GET_ORDERS, GET_MY_PRODUCTS],
        onCompleted:(data)=>{
          toast.success(data?.returnStock);
        },
        onError:(error)=>{
          toast.error(error.message);
        }
      })
    }
    
    if(loading){return(
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <CircularLoading/>
      </div>
    )};
    if(data){
        const ordersArr = data?.getOrders?.orders;
        return (
        <StyledGrid container>
          <Head>
            <title>Orders</title>
            <meta name="description" content="Orders page" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
            <Grid item xs={12}>
                <StyledPaper elevation={3}>
                    <Box sx={{ textAlign: 'left', mt: 6, marginLeft: '5rem', marginRight: 'auto' }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bolder', color: '#494948' }}>
                            Order Transactions
                        </Typography>
                        <Divider sx={{ width: '30%', mt: 1, mb: 2, height: '3px', backgroundColor: '#2E603A' }} />
                    </Box>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            centered 
                            textColor="inherit"
                            TabIndicatorProps={{style: {backgroundColor:"#2E613B"}}}
                        >
                            <Tab label="Pending" sx={{ color: tabValue === 0 ? '#2E613B' : "inherit" }} />
                            <Tab label="Accepted" sx={{ marginLeft:'8rem',color: tabValue === 1 ? '#2E613B' : "inherit" }} />
                            <Tab label="For Completion" sx={{ marginLeft:'8rem', color: tabValue === 2 ? '#2E613B' : "inherit" }} />
                            <Tab label="Completed" sx={{ marginLeft:'8rem', color: tabValue === 3 ? '#2E613B' : "inherit" }} />
                        </Tabs>
                    </Box>
                    {loading && <CircularLoading/>}
                    {tabValue===0 && 
                      <PendingOrders 
                        role={user.role} 
                        orders={ordersArr} 
                        handleUpdateStatus={handleUpdateStatus} 
                        handleCancelOrder={handleCancelOrder} 
                        handleDeclineOrder={handleDeclineOrder}
                        handleGetMoreOrders={handleGetMoreOrders}
                      />
                    }
                    {tabValue === 1 && 
                      <AcceptedOrders  
                        role={user.role} 
                        orders={ordersArr} 
                        handleUpdateStatus={handleUpdateStatus} 
                        handleGetMoreOrders={handleGetMoreOrders}
                      />
                    }
                    {tabValue === 2 && 
                      <ForCompletionOrders  
                        role={user.role} 
                        orders={ordersArr} 
                        handleUpdateStatus={handleUpdateStatus} 
                        handleGetMoreOrders={handleGetMoreOrders}
                        handleReturnStock={handleReturnStock}
                      />
                    }
                    {tabValue === 3 && 
                      <CompletedOrders  
                        role={user.role} 
                        orders={ordersArr} 
                        updateStatus={updateStatus} 
                        handleGetMoreOrders={handleGetMoreOrders}
                      />
                    }
                </StyledPaper>
            </Grid>
        </StyledGrid>
    );
    }
    
}
