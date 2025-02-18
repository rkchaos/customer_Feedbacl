import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword({ open, handleClose }) {
    let [email, setEmail] = useState('')
    // let naviagte = useNavigate()
    const handleForgetpassword = async () => {
        const auth = getAuth();
        // console.log("Auth Object:", auth); 

        if (!email.trim()) {
            toast.error("Please enter a valid email!");
            return;
        }

        sendPasswordResetEmail(auth, email.trim()) 
            .then(() => {
                toast.success("Password reset link sent to your email");
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error(error.message);
            });
    };
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleClose();
                    },
                    sx: { backgroundImage: 'none' },
                }}
            >
                <DialogTitle>Reset password</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
                >
                    <DialogContentText>
                        Enter your account&apos;s email address, and we&apos;ll send you a link to
                        reset your password.
                    </DialogContentText>
                    <OutlinedInput
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email address"
                        placeholder="Email address"
                        type="email"
                        fullWidth
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type="submit" onClick={handleForgetpassword}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer
                theme='dark'
            />
        </>
    );
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ForgotPassword;