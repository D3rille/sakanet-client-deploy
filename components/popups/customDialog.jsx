import {useState} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
// 'message' needs to be a component
export default function CustomDialog({openDialog, setOpenDialog, title, message, btnDisplay, callback}) {
    const buttonDisplay = [
        ["Yes", "No"],
        ["Save", "Cancel"],
        ["Confirm", "Cancel"],
        ["Agree", "Disagree"]
    ];

    // const [open, setOpen] = useState(openDialog);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
    <div>
        {openDialog && <BootstrapDialog
        fullWidth
        maxWidth={"xs"}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {title}
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            }}
        >
            <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            {message}
        </DialogContent>
        <DialogActions>
            {callback ? (
                <>
                    <Button autoFocus onClick={()=>{callback(); handleClose();}} variant="contained" color="success">
                        {buttonDisplay[btnDisplay][0]}
                    </Button>
                    <Button autoFocus onClick={handleClose} variant="outlined" color="error">
                        {buttonDisplay[btnDisplay][1]}
                    </Button>
                </>
                       
            ):(
                <Button autoFocus onClick={handleClose} variant="outlined" color="error">
                    Close
                </Button>
            )}

        </DialogActions>
        </BootstrapDialog>}
    </div>
    );
}
