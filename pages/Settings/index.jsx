import React from 'react';
import { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Profile from "../../components/settingsComponents/Profile";
import EmailAndPassword from "../../components/settingsComponents/PasswordAndEmail";
import PaymentChannels from "../../components/settingsComponents/PaymentChannels";
import Address from "../../components/settingsComponents/Address";
import Verification from "../../components/settingsComponents/Verification";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useQuery } from '@apollo/client';
import { GET_MY_PROFILE } from '../../graphql/operations/profile';
import {useSubs} from "../../context/SubscriptionProvider";
import { AuthContext } from '../../context/auth';
import {useRouter} from "next/router";
import Head from 'next/head';


const GridContainer = styled(Grid)({
    background: '#F4F4F4',
    height: '100vh',
});

const StyledPaperContainer = styled(Paper)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#F9F8F8',
    textAlign: 'center',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '6.5rem',
    borderRadius: '20px',
    overflow: 'hidden',
});

const InnerPaperLeft = styled(Paper)({
    backgroundColor: '#FFFEFE',
    margin: '1rem',
    marginTop: '2rem',
    flexDirection: 'column',
    flex: 1, 
    textAlign: 'left',
    marginLeft: '3rem',
    height:'auto'
});

const HeaderContainer = styled('div')({
    marginTop:'0.3rem',
    marginBottom: '1rem',  
    marginLeft: '1rem'   
  });
  
const StyledDivider = styled(Divider)({
    width: '50%',
    margin: '1rem 0',
    color:'#2E603A'
  });
  

const ParentContainer = styled('div')({
    width: '95%',
    flex: 3,
});

const InnerPaperRight = styled(Paper)({
    margin: '1rem',
    marginTop: '2rem',
    flex: 3,
    flexDirection: 'column',
    marginRight: '3rem',
    borderRadius: '15px',
    textAlign: 'left',
});

const StyledTab = styled(Tab)({
    textTransform: 'none',
    textAlign: 'left',
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-start',
    '&.Mui-selected': {
      color: '#2E603A',
    },
    '& .MuiSvgIcon-root': {
      color: 'inherit',
      marginRight: '0.5rem', 
    },
});

export default function SettingsPage() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
  
    useEffect(() => {
      if (user.role == 'ADMIN') {
        router.push('/404');
      }
    }, [user]);
  
    return user.role != 'ADMIN' ? <Settings /> : null;
}

const Settings = () => {
    const {profile} = useSubs();
    const [value, setValue] = React.useState(0);
    const { loading, error, data } = useQuery(GET_MY_PROFILE);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { profile_pic, cover_photo } = data.getMyProfile.profile;


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <GridContainer container>
            <Head>
                <title>Settings</title>
                <meta name="description" content="Settings page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Grid item xs={12}>
                <StyledPaperContainer elevation={3}>
                    <InnerPaperLeft elevation={3} sx={{ borderRadius: "13px", padding: "1rem" }}>
                        
                    <HeaderContainer>
                            <Typography variant="h6" style={{fontWeight:'bolder'}}>
                                SETTINGS
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                This page allows you to customize what you have made
                            </Typography>
                            <StyledDivider />
                        </HeaderContainer>

                        <Tabs
                            orientation="vertical"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs"
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            TabIndicatorProps={{ style: { backgroundColor: '#2E603A', } }}
                        >
                            <StyledTab 
                                icon={<PersonIcon />} 
                                label={
                                    <div>
                                        Profile
                                        <div style={{ fontSize: '0.8em', color: 'grey' }}>
                                            Customize your profile.
                                        </div>
                                    </div>
                                } 
                            />
                            <StyledTab 
                                icon={<LocationOnIcon />} 
                                label={
                                    <div>
                                        Address
                                        <div style={{ fontSize: '0.8em', color: 'grey' }}>
                                            Change your business address or personal address..
                                        </div>
                                    </div>
                                } 
                            />
                            <StyledTab 
                                icon={<LockIcon />} 
                                label={
                                    <div>
                                        Password and Email
                                        <div style={{ fontSize: '0.8em', color: 'grey' }}>
                                            Change your email and your password.
                                        </div>
                                    </div>
                                } 
                            />
                            <StyledTab 
                                icon={<PaymentIcon />} 
                                label={
                                    <div>
                                        Payment Channels
                                        <div style={{ fontSize: '0.8em', color: 'grey' }}>
                                            Customize your payment channels.
                                        </div>
                                    </div>
                                } 
                            />
                            <StyledTab 
                                icon={<VerifiedIcon />} 
                                label={
                                    <div>
                                        Account Verification
                                        <div style={{ fontSize: '0.8em', color: 'grey' }}>
                                            Check your Verification Update.
                                        </div>
                                    </div>
                                } 
                            />
                        </Tabs>
                    </InnerPaperLeft>
                    <ParentContainer>
                        <InnerPaperRight elevation={3}>
                            {profile && value === 0 && <Profile profile={profile?.profile} />}
                            {profile && value === 1 && <Address address={profile?.profile?.address}/>}
                            {profile && value === 2 && <EmailAndPassword user={profile?.profile} />}
                            {profile && value === 3 && <PaymentChannels />}
                            {profile && value === 4 && <Verification profile = {profile?.profile} />}
                        </InnerPaperRight>
                    </ParentContainer>
                </StyledPaperContainer>
            </Grid>
        </GridContainer>
    );
};
