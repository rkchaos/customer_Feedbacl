import React, { useCallback, useEffect, useState, lazy, Suspense } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../../components/nav/Navbar"
import Button from "@mui/material/Button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CircularProgress, Container, Typography } from '@mui/material'


// Lazy load the form builder components
const ReactFormBuilder = lazy(() =>
    import("react-form-builder2").then((module) => ({ default: module.ReactFormBuilder })),
)
const ReactFormGenerator = lazy(() =>
    import("react-form-builder2").then((module) => ({ default: module.ReactFormGenerator })),
)

import "react-form-builder2/dist/app.css"
// import Alreadycreatedform from "../alreadyCreatedform/Alreadycreatedform"

// Define form items (keep the existing items array)

function App() {
    const [formData, setFormData] = useState([])
    const [isPreview, setIsPreview] = useState(false)
    const [currentid, setCurrentid] = useState("")
    const [currentuid, setCurrentuid] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [changeInput, setchangeInput] = useState({
        name: ""
    }
    )
    const navigate = useNavigate()
    const params = useParams()

    const onPost = useCallback((data) => {
        console.log("Form data:", data)
        setFormData(data.task_data)
    }, [])


    const handleWorkspaceid = () => {
        navigate("/alreadyCreated", { state: { workspaceId: params.id } })
    }
     const auth = getAuth();
    
      // Listen for auth state changes
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentuid(user.uid);
          } else {
            navigate("/sign_in");
          }
        });
        return unsubscribe;
      }, [auth, navigate]);
      console.log(currentuid)

    const fetchCurrentUser = useCallback(async () => {
        try {
          if (!currentuid) return;
          const data = { uid: currentuid };
          const res = await axios.post("https://customer-feedbacl.onrender.com/currentUser", data);
          setCurrentid(res.data.fetchuid._id);
        } catch (err) {
          console.log(err);
          toast.error("Something went wrong");
        }finally{
            setTimeout(()=>{
                setIsLoading(false)
            },2000)
        }
      }, [currentuid]);
    
      useEffect(() => {
        fetchCurrentUser();
      }, [fetchCurrentUser]);

    const handleSubmit = useCallback(async () => {
        if (isLoading || !currentid) {
            console.log("Still loading or currentid not set")
            return
        }

        if (formData.length === 0) {
            toast.error("You need to first create the form", {
                autoClose: 3000,
                position: "top-right",
            })
            return
        }
        if(changeInput.name.length == 0 ){
            toast.error("Please fill the form name", {
                autoClose: 3000,
                position: "top-right",
            })
            return
        }

        try {
            console.log("Submitting form with currentid:", currentid)
            console.log("Form data:", formData)
            console.log(changeInput.name)
            const res = await axios.post(
                `https://customer-feedbacl.onrender.com/createForm/${params.id}`,
                { currentid, data: formData ,name:changeInput.name}
            )
            if (res.data.msg === "created success") {
                toast.success("Form successfully submitted")
                navigate("/alreadyCreated", { state: { workspaceId: params.id } })
            }
            console.log("Form submitted with data:", res.data)
        } catch (err) {
            console.error("Error submitting form:", err)
            toast.error("Failed to submit form. Please try again.")
        }
    }, [currentid, formData, params.id, isLoading,changeInput.name])

    const handlePreviewToggle = useCallback(() => {
        setIsPreview((prev) => !prev)
    }, [])

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

    function handleinputChange(event) {
        setchangeInput({ ...changeInput, [event.target.name]: event.target.value })
    }
  
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm p-4 mb-8">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Form Builder</h1>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                textAlign: "center",
                            }}
                        >
                            <Box
                                component="form"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField id="outlined-basic" label="Form name*" name="name" value={changeInput.name} variant="outlined" onChange={handleinputChange} required />
                                <Button
                                    sx={{
                                        "&:focus": {
                                            outline: "none",
                                        },
                                    }}
                                    variant="outlined"
                                
                                >
                                    Submit
                                </Button>
                            </Box>
                        </div>


                        <div>
                            <Button
                                variant="contained"
                                onClick={handlePreviewToggle}
                                sx={{
                                    "&:focus": {
                                        outline: "none",
                                    },
                                }}
                            >
                                {isPreview ? "Edit" : "Preview"}
                            </Button>
                            {!isPreview && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        "&:focus": {
                                            outline: "none",
                                        },
                                        marginLeft: "20px",
                                    }}
                                    onClick={handleWorkspaceid}
                                >
                                    Already created form
                                </Button>
                            )}

                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 pb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Suspense fallback={<div>Loading...</div>}>
                            {isPreview ? (
                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Form Preview</h2>
                                    <ReactFormGenerator answer_data={{}} data={formData} hide_actions={true} read_only={false} />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            "&:focus": {
                                                outline: "none",
                                            },
                                            marginTop: "20px",
                                        }}
                                        onClick={handleSubmit}
                                        disabled={isLoading || !currentid}
                                    >
                                        Submit Form
                                    </Button>
                                </div>
                            ) : (
                                <ReactFormBuilder onPost={onPost} data={formData} />
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}

export default App

