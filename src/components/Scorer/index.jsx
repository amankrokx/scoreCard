import React, { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import PersonIcon from "@mui/icons-material/Person"
import SendIcon from "@mui/icons-material/Send"
import CalculateIcon from "@mui/icons-material/Calculate"
import LoaderUtils from "../Loader/LoaderUtils";
import firestore from "../../firebase/firestore";
import { addDoc, collection, doc, runTransaction, Timestamp, writeBatch } from "firebase/firestore";
import SnackbarUtils from "../SnackbarUtils";

export default function Scorer() {

    const [values, setValues] = useState({
        r: 0,
        y: 0,
        b: 0,
        g: 0,
        o: 0,
        score: 0,
        name: "",
    })
    // const [red, setRed] = useState(0)
    // const [yellow, setYellow] = useState(0)
    // const [blue, setBlue] = useState(0)
    // const [green, setGreen] = useState(0)
    // const [orange, setOrange] = useState(0)

    // const [score, setScore] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    // const name = useRef(null)

    // Calculate the score
    useEffect(() => {
        // Score calculation starts here
        let s = 0
        const { r, y, b, g, o } = values
        const totalCards = r + y + b + g + o
        if (o < 4) s = o * 7
        s += (g * 4) + (r * 3) + (y) + (b * 4) + (Math.min(r, y, g, b, o) * 10) + (Math.min(y, r) ** 2)
        const sorted = [r, y, b, g, o].sort()
        let flag = true
        sorted.map((value, index) => {
            if (value !== index) flag = false
        })
        if (totalCards === 10 && flag ) s *= 2
        if (totalCards > 13 || g > y) s = 0

        // s is the final score
        setValues({...values, score: s})
    }, [values.b, values.g, values.o, values.r, values.y])

    useEffect(() => setButtonDisabled(!(values.name.length > 0)), [values.name])

    async function uploadScore () {
        try {
            if (values.name.length === 0) throw new Error("Please enter a name")
            LoaderUtils.halt()
            const data = {...values, Timestamp: Timestamp.now()}
            await runTransaction(firestore, async (transaction) => {
                const info = await transaction.get(doc(firestore, "utils", "info"))
                let count = 1
                if (info.exists()) count = info.data().count + 1
                
                await addDoc(collection(firestore, "scores"), data)
                transaction.update(doc(firestore, "utils", "info"), {count})  
            })
            SnackbarUtils.success("Score uploaded successfully")
            setValues({
                r: 0,
                y: 0,
                b: 0,
                g: 0,
                o: 0,
                score: 0,
                name: "",
            })
        } catch (error) {
            SnackbarUtils.error(error.message || error || "Something went wrong")
            console.error(error)
        } finally {
            LoaderUtils.unhalt()
        }
    }

    return (
        <Box>
            <Typography variant="h4" color="secondary" align="center">
                Calculate Player Score <CalculateIcon></CalculateIcon>
            </Typography>
            <br></br>
            <br></br>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    alignContent: "flex-start",
                    flexWrap: "wrap",
                    flexDirection: "row",
                }}
            >
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{
                        mr: 2,
                    }}
                >
                    <PersonIcon fontSize="large" color="secondary" style={{ transform: "scale(3)", margin: "0 auto" }} />
                    <br></br>
                    <TextField label="Player Name" value={values.name} onChange={(e) => setValues({...values, name: e.target.value})} />
                    <TextField disabled label="Score" value={values.score} />
                    <Button disabled={buttonDisabled} variant="contained" color="primary" onClick={uploadScore} endIcon={<SendIcon />}>
                        Upload
                    </Button>
                </Stack>

                <Stack
                    spacing={2}
                    direction="column"
                    sx={{
                        ml: 2,
                    }}
                >
                    <div className="colors">
                        <IconButton
                            aria-label="Decrement"
                            color="red"
                            disabled={values.r <= 0}
                            onClick={() => setValues({...values, r: values.r - 1})}
                        >
                            <RemoveCircleIcon fontSize="large" />
                        </IconButton>
                        <TextField label="Red Cards" color="red" type="number" value={values.r} onChange={(e) => setValues({...values, r: e.target.value})} />
                        <IconButton
                            aria-label="Increment"
                            color="red"
                            onClick={() => setValues({...values, r: values.r + 1})}
                        >
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </div>
                    <div className="colors">
                        <IconButton
                            aria-label="Decrement"
                            color="yellow"
                            disabled={values.y <= 0}
                            onClick={() => setValues({...values, y: values.y - 1})}
                        >
                            <RemoveCircleIcon fontSize="large" />
                        </IconButton>
                        <TextField label="Yellow Cards" color="yellow" type="number" value={values.y} onChange={(e) => setValues({...values, y: e.target.value})} />
                        <IconButton
                            aria-label="Increment"
                            color="yellow"
                            onClick={() => setValues({...values, y: values.y + 1})}
                        >
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </div>
                    <div className="colors">
                        <IconButton
                            aria-label="Decrement"
                            color="blue"
                            disabled={values.b <= 0}
                            onClick={() => setValues({...values, b: values.b - 1})}
                        >
                            <RemoveCircleIcon fontSize="large" />
                        </IconButton>
                        <TextField label="Blue Cards" color="blue" type="number" value={values.b} onChange={(e) => setValues({...values, b: e.target.value})} />
                        <IconButton
                            aria-label="Increment"
                            color="blue"
                            onClick={() => setValues({...values, b: values.b + 1})}
                        >
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </div>
                    <div className="colors">
                        <IconButton
                            aria-label="Decrement"
                            color="green"
                            disabled={values.g <= 0}
                            onClick={() => setValues({...values, g: values.g - 1})}
                        >
                            <RemoveCircleIcon fontSize="large" />
                        </IconButton>
                        <TextField label="Green Cards" color="green" type="number" value={values.g} onChange={() => setValues({...values, g: e.target.value})} />
                        <IconButton
                            aria-label="Increment"
                            color="green"
                            onClick={() => setValues({...values, g: values.g + 1})}
                        >
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </div>
                    <div className="colors">
                        <IconButton
                            aria-label="Decrement"
                            color="orange"
                            disabled={values.o <= 0}
                            onClick={() => setValues({...values, o: values.o - 1})}
                        >
                            <RemoveCircleIcon fontSize="large" />
                        </IconButton>
                        <TextField label="Orange Cards" color="orange" type="number" value={values.o} onChange={(e) => setValues({...values, o: e.target.value})} />
                        <IconButton
                            aria-label="Increment"
                            color="orange"
                            onClick={() => setValues({...values, o: values.o + 1})}
                        >
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </div>
                </Stack>
            </div>
        </Box>
    )
}