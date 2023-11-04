import React, { ReactNode } from 'react';
import Navbar from './navbar';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user } = useContext(AuthContext); 

  if(user){
    return (
      <>
        <Toaster/>
        <Navbar/>
        <main>{children}</main>
      </>
    );
  } else{
    router.push('/login');
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , zIndex:"200"}}>
        <CircularProgress />
      </div>
    );
  }



}