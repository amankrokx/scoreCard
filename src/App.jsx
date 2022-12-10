import React, { useState, useRef, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import { SnackbarProvider } from "notistack"
import Snack from "./components/Snack"
import Loader from "./components/Loader"
import auth from "./firebase/auth"
import AuthContext from "./firebase/auth/AuthContext"
import { onAuthStateChanged } from "firebase/auth"
import SnackbarUtils from "./components/SnackbarUtils"
import LoaderUtils from "./components/Loader/LoaderUtils"
import LeaderBoard from "./pages/LeaderBoard"
import AddScore from "./pages/AddScore"

function App() {
    const notistackRef = useRef()
    const theme = useTheme()
    const [user, setUser] = useState(null)

    useEffect(() => {
        window.document.title = "Score Card"
        window.document.body.style.backgroundColor = theme.palette.background.default
        window.document.body.style.height = "100%"
        LoaderUtils.halt()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // console.log(user.email)
                setUser(user)
                SnackbarUtils.success("Welcome !")
                LoaderUtils.unhalt()
            } else {
                LoaderUtils.unhalt()
                // SnackbarUtils.info("Please Login to continue.")
                setUser(null)
            }
        })
    }, [])

    const authSyncSettings = {
        user: user,
        setUser: setUser,
    }

    return (
        <AuthContext.Provider value={authSyncSettings}>
            <SnackbarProvider
                dense
                preventDuplicate
                maxSnack={3}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                ref={notistackRef}
                action={key => (
                    <IconButton aria-label="Close" onClick={() => notistackRef.current.closeSnackbar(key)}>
                        <span className="material-icons" style={{ color: theme.palette.white.main }}>
                            close
                        </span>
                    </IconButton>
                )}
            >
                <div className="App">
                    <Snack></Snack>
                    <Loader></Loader>
                    {/* { emailVerify.ready && emailVerify.verified ? <VerifyEmail user={user} /> : null } */}
                    <Routes>
                        <Route exact path="/" element={<LeaderBoard />} />
                        <Route exact path="/admin" element={<AddScore />} />

                    </Routes>
                </div>
            </SnackbarProvider>
        </AuthContext.Provider>
    )
}

export default App
