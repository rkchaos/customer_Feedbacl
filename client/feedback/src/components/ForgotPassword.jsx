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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword({ open, handleClose }) {
    let [email, setEmail] = useState({ email: '' })
    let naviagte = useNavigate()
    const handleForgetpassword = async () => {
        try {
            let res = await axios.post("http://localhost:8080/forgetPassword", email)
            if (res.data.msg == 'Password reset email sent successfully') {
                toast.success('Password reset link send successfully please check email and login again')
            }
            else {
                toast.error('error in forgot password')
            }
        }
        catch (err) {
            console.log(err)
        }
    }
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
                        onChange={e => setEmail({ ...email, email: e.target.value })}
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