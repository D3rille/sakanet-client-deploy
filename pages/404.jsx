import Logo from "../public/images/LOGO-FINAL.png";
import Head from 'next/head';
import { Button } from "@mui/material";
import {useRouter} from "next/router";
import Image from "next/image";

export default function PageNotFound(){
    const router = useRouter(); 
    return(
        <div style={{display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center", height:"100vh"}}>
            <Head>
                <title>404: Page not Found</title>
                <meta name="description" content="Page Not Found" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{display:"flex", flexDirection:"row", width:"50%", margin:"auto",}}>
                <Image 
                src={Logo} 
                alt="Sakanet Logo" width={400} 
                height={300} style={{borderRight:"4px solid green", 
                marginRight:"3em"}}/>
                <div>
                <h1 style={{fontSize:"9rem"}}>404</h1>
                <p style={{fontSize:"2rem"}}>Page Not Found</p>
                </div>
            </div>
            <Button 
            variant="outlined" 
            style={{position:"absolute", top:40, left:40}}
            onClick={()=>router.replace("/")}
            >
                Return
            </Button>
        </div>
        
        )
}