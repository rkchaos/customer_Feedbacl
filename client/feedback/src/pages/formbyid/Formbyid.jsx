import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../../components/nav/Navbar"
import { Button, CircularProgress, Typography, Box, Container, Paper } from "@mui/material"
import { ReactFormGenerator, ReactFormBuilder } from "react-form-builder2"
import "react-form-builder2/dist/app.css"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./formbyid.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Formbyid() {
    const params = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [currentid, setCurrentid] = useState("");
    const [currentuid, setCurrentuid] = useState("");
    const [formfields, setFormfields] = useState([])
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const auth = getAuth();

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentuid(user.uid);
            } 
        });
        return unsubscribe;
    }, [auth, navigate]);


    const fetchCurrentUser = useCallback(async () => {
        try {
            if (!currentuid) return;
            const data = { uid: currentuid };
            const res = await axios.post("https://customer-feedbacl.vercel.app/currentUser", data);
            setCurrentid(res.data.fetchuid._id);
        } catch (err) {
          console.log(err)
            toast.error("Something went wrong");
        }
    }, [currentuid]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        async function fetchForm() {
            // if (!currentid) return
            setIsLoading(true)
            setError(null)
            try {
                const res = await axios.post(
                    `https://customer-feedbacl.vercel.app/form/${params.id}`,
                    { currentid }
                )
                console.log(res.data)
                setFormData(res.data.findfrom)
                setIsOwner(res.data.isOwner)
                setFormfields(res.data.findfrom.fields || [])
            } catch (err) {
              console.log(err)
                setError("Failed to load form. Please try again.")
                handleAuthError(err)
            } finally {
                setTimeout(()=>{
                    setIsLoading(false)
                },2000)
            }
        }
        fetchForm()
    }, [params.id, currentid])


    const handleAuthError = (err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem("token")
            toast.error("Your session has expired. Please sign in again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            navigate("/sign_in")
        }
    }

    const handleUpdateForm = () => {
        setIsPreviewMode(true)
    }

    const handleSetReviewFalse = () => {
        setIsPreviewMode(false)
    }
    const handleformChange = async () => {
        try {
            let data = {
                formdata: formfields,
                ownerId: currentid
            }

            let res = await axios.put(`https://customer-feedbacl.vercel.app/form/update/${params.id}`, data)
                .then((res) => {
                    
                    toast.success("updated successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                })
                .catch((err) => {
                    toast.error("error whileupdation")
                    
                })
        }
        catch (err) {
            toast.error("error whileupdation")
          
        }
    }

    if (isLoading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "50vh",
                        }}
                    >
                        <CircularProgress />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading form...
                        </Typography>
                    </Box>
                </Container>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            {error}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                            Retry
                        </Button>
                    </Paper>
                </Container>
            </>
        )
    }

    if (!formData) {
        return (
            <>
                <Navbar />
                <Container maxWidth="sm">
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        No form data available.
                    </Typography>
                </Container>
            </>
        )
    }



    const handleSubmit = async (formdata) => {
        const answerValues = formdata;
        let data = {
            formValue: answerValues,
            formid: params.id
        }

        try {
            let res = await axios.post('https://customer-feedbacl.vercel.app/feedback/Store', data)
            if (res.data) {
                toast.success("Feedback submited", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }

        }
        catch (err) {
            toast.error("Feedback not submited")
        }

    }


    const handlesendid=()=>{
        navigate(`/feedback`, { state: { fromid: params.id } });

    }
    return (
        <>
            <Navbar />
            <Container maxWidth="lg" >
                <Typography variant="h4" align="center" gutterBottom>
                    {formData.name}
                    {isPreviewMode ? " - Preview" : ""}
                </Typography>
                {isPreviewMode ? (
                    <>
                        <div style={{ display: "flex", flexDirection: "row", gap: '30px' }}>
                            <Button variant="contained" color="primary" onClick={handleSetReviewFalse} sx={{ mb: 2 }}>
                                Back
                            </Button>
                            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleformChange}>
                                Update the from
                            </Button>
                        </div>
                        <ReactFormGenerator
                            submitButton={
                                <Button variant="contained" color="primary">
                                    Submit
                                </Button>
                            }
                            data={formfields}
                        />
                    </>
                ) : (
                    <>
                        {isOwner ? (
                            <>
                                <div style={{ display: "flex", flexDirection: "row", gap: '30px' }}>
                                    <Button variant="contained" color="primary" onClick={handleUpdateForm} sx={{ mb: 2 }}>
                                        Preview Form
                                    </Button>
                                    <Button   onClick={handlesendid} variant="contained" color="primary" sx={{ mb: 2 }}>
                                        Feedbacks
                                    </Button>
                                </div>
                                <ReactFormBuilder data={formfields} onChange={(newFields) => setFormfields(newFields)} />
                            </>
                        ) : (
                            <ReactFormGenerator
                                data={formfields}
                                submitButton={
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                }
                                onSubmit={handleSubmit}


                            />
                        )}
                    </>
                )}
            </Container>
            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='dark'
            />
        </>
    )
}

export default Formbyid

