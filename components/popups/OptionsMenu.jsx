import {useState} from 'react';
import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function OptionsMenu({triggerComponent, itemAndFunc}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const MenuItems =({item})=>{
        const func = item.function;
        return(
            <MenuItem onClick={()=>{
                func();
                handleClose();
            }}>{item.name}</MenuItem>
        );
    }

    return (
    <div>
        {itemAndFunc.length > 0 && (triggerComponent(handleClick))}
        <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        >
        {itemAndFunc && itemAndFunc.map (item =>{
            return (<MenuItems key={item.name} item={item}/>);
        }
        )}
        </Menu>
    </div>
    );
}