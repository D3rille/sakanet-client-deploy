import React, {useState, useEffect, useContext} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useQuery, useLazyQuery } from '@apollo/client';
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import Head from 'next/head';

import { GET_TOTAL_STATS, GET_SALES_OR_ORDERS_STATS } from '../../graphql/operations/statistics';
import CircularLoading from "../../components/circularLoading";
import {AuthContext} from "../../context/auth";
import SalesOrOrdersStats from '../../components/Statistics/SalesOrOrdersStats';
import { formatToCurrency } from '../../util/currencyFormatter';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: "1em",
    color: theme.palette.text.secondary,
  }));

export default function StatisticsPage() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user.role !== 'BUYER') {
        router.push('/404');
        }
    }, [user]);

    return user.role == 'BUYER' ? <Statistics /> : null;
}

function Statistics(){
    const { user } = useContext(AuthContext); 
    const router = useRouter();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [timeInterval, setTimeInterval] = useState("daily");
    const [showStatOf, setShowStatOf] = useState("sales");

    console.log(timeInterval);

    const [getTotalStats, {data:getTotalStatsData, loading:getTotalStatsLoading}] = useLazyQuery(GET_TOTAL_STATS, {
        variables:{
            startDate: new Date(startDate)?.toISOString().split('T')[0],
            endDate:new Date(endDate)?.toISOString().split('T')[0]
        },
        onError:(error)=>{
            toast.error(error.message);
            console.error(error);
        }
    });
   
    const {data:getSalesOrdersData, loading:getSalesOrdersLoading, refetch:refetchGetSalesOrders} = useQuery(GET_SALES_OR_ORDERS_STATS, {
        variables:{
            showStatOf: showStatOf,
            timeInterval: timeInterval
        },
        onError:(error)=>{
            toast.error(error.message);
            console.error(error);
        }
    });

    // const {data:getSalesOrdersData, loading:getSalesOrdersLoading, refetch:refetchGetSalesOrders} = useQuery(GET_DAILY_SALES_STATS, {
    //     variables:{
    //         showStatOf:showStatOf
    //     },
    //     onError:(error)=>{
    //         toast.error(error.message);
    //         console.error(error);
    //     }
    // });


    useEffect(()=>{
        if(user.role != "FARMER"){
            router.replace("/");
        } 
        else if(!startDate && !endDate){
            getTotalStats({variables:{
                startDate:"",
                endDate:""
            }})
        }
        else{
            getTotalStats();
        } 

    }, [ startDate, endDate]);

    // useEffect(()=>{
    //     refetchGetSalesOrders();
    // },[showStatOf,timeInterval])


    if(user.role == "FARMER"){
        return (
        <Box sx={{
            margin:"5em",
        }}>
            <Head>
                <title>Statistics</title>
                <meta name="description" content="Statistics page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{display:"flex", flexDirection:"row", paddingBlock:"1em", width:"30%", alignItems:"center"}}>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Set Start Date"
                        sx={{
                        width: "100%",
                        }}
                        value={startDate}
                        onAccept={(newValue) => setStartDate(newValue.toISOString())} // This triggers after user selects a date                  
                    />
                </LocalizationProvider>
                <ArrowRightAltIcon/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Set End Date"
                        sx={{
                        width: "100%",
                        }}
                        value={endDate}
                        onAccept={(newValue) => setEndDate(newValue.toISOString())} // This triggers after user selects a date                  
                    />
                </LocalizationProvider>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <Item sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            {getTotalStatsLoading && (
                                <div style={{display:"flex", margin:"auto"}}>
                                    <CircularLoading/>
                                </div>
                            )}
                            {getTotalStatsData && (
                                <>
                                    <IconButton sx={{backgroundColor:"#CDFAD5", margin:"0.5em"}}>
                                        <TrendingUpIcon sx={{width:"1.5em", height:"1.5em"}}/>
                                    </IconButton>
                                    <Box>
                                        <Typography variant='overline' sx={{color:"#d5d5d5"}}>
                                            Total Sales
                                        </Typography>
                                        <Typography variant="h4">
                                            {formatToCurrency(getTotalStatsData?.getTotalStats?.totalSales)}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                            </Item>
                        
                        </Grid>
                        <Grid item xs={3}>
                            <Item sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                {getTotalStatsLoading && (
                                    <div style={{display:"flex", margin:"auto"}}>
                                        <CircularLoading/>
                                    </div>
                                )}
                               {getTotalStatsData && ( 
                                <>
                                <IconButton sx={{backgroundColor:"#CDFAD5", margin:"0.5em"}}>
                                        <InventoryOutlinedIcon sx={{width:"1.5em", height:"1.5em"}}/>
                                    </IconButton>
                                    <Box>
                                        <Typography variant='overline'sx={{color:"#d5d5d5"}}>
                                            Total Orders
                                        </Typography>
                                        <Typography variant="h4">
                                            {getTotalStatsData?.getTotalStats?.totalOrders}
                                        </Typography>
                                    </Box>
                                </>
                                )}
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                {getTotalStatsLoading && (
                                    <div style={{display:"flex", margin:"auto"}}>
                                        <CircularLoading/>
                                    </div>
                                )}
                                {getTotalStatsData && (
                                    <>
                                        <IconButton sx={{backgroundColor:"#CDFAD5", margin:"0.5em"}}>
                                            <ShoppingBasketOutlinedIcon sx={{width:"1.5em", height:"1.5em"}}/>
                                        </IconButton>
                                        <Box>
                                            <Typography variant='overline' sx={{color:"#d5d5d5"}}>
                                                Total Products
                                            </Typography>
                                            <Typography variant="h4">
                                                {getTotalStatsData?.getTotalStats?.totalProducts}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Item>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
            <Box>
                <Paper elevation={4} sx={{backgroundColor:"white", padding:"3em", marginBlock:"2em"}}>
                    <Box sx={{display:"flex",  flexDirection:"row", alignItems:"center", width:"100%"}}>
                        <Box sx={{display:"flex", flexDirection:"row", flex:1, alignItems:"center"}}>
                            <Typography variant='h4'>
                                Statistics
                            </Typography>

                            <Box sx={{marginInline:"1em"}}>
                                <Select
                                    value={showStatOf}
                                    
                                    onChange={(e)=>{
                                        setShowStatOf(e.target.value);
                                    }}
                                >
                                    <MenuItem value={"sales"}>Sales</MenuItem>
                                    <MenuItem value={"orders"}>Orders</MenuItem>
                                
                                </Select>
                            </Box>
                            
                        </Box>
                        <Box sx={{display:"flex",flex:1,  justifyContent:"end"}}>
                            <ToggleButtonGroup
                                color="success"
                                value={timeInterval}
                                exclusive
                                onChange={(event)=>{
                                    setTimeInterval(event.target.value)
                                }}
                                aria-label="Platform"
                            >
                                <ToggleButton value="daily" >Daily</ToggleButton>
                                <ToggleButton value="weekly">Weekly</ToggleButton>
                                <ToggleButton value="monthly">Monthly</ToggleButton>
                                <ToggleButton value="annual">Annual</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                    <Box>
                        {getSalesOrdersLoading && (
                            <div style={{display:"flex", margin:"auto"}}>
                                <CircularLoading/>
                            </div>
                        )}
                        {getSalesOrdersData && !getSalesOrdersLoading && (
                            <SalesOrOrdersStats data={getSalesOrdersData?.getSalesOrOrdersStats} showStatOf={showStatOf} timeInterval={timeInterval}/>
                        )}
                    </Box>
                </Paper>
                
            </Box>
        </Box>);
    }

    

}