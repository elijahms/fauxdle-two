import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import KeyBoard from "./KeyBoard";
import Typography from "@mui/material/Typography";
import Cell from "./Cell";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { WORDS } from "../Constants/wordlist";
import { useCookies } from "react-cookie";
import Dialog from "./DialogS";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { ConstructionOutlined } from "@mui/icons-material";

function Content() {
  const [cookies, setCookie] = useCookies(["word"]);
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [notInWord, setNotInWord] = useState([]);
  const [snackMessage, setSnackMessage] = useState("Not in Word List");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const [falseWord, setFalseWord] = useState(false);
  const [answer, setAnswer] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [winningText, setWinningText] = useState("");

  // const [guessObj, setGuessObj] = useState({
  //   boxes: [],
  //   guesses: [],
  //   currentRow: 0,
  //   notInWord: [],
  //   word: "",
  // });

  localStorage.setItem("guess", JSON.stringify([]));
  localStorage.setItem("boxes", JSON.stringify([]));
  localStorage.setItem("word", JSON.stringify(""));
  localStorage.setItem("currentRow", JSON.stringify(0));
  localStorage.setItem("notInWord", JSON.stringify([]));

  useEffect(() => {
    if (word !== "" || currentRow !== 0) {
      localStorage.setItem("guess", JSON.stringify(guess));
      localStorage.setItem("boxes", JSON.stringify(boxes));
      localStorage.setItem("word", JSON.stringify(word));
      localStorage.setItem("currentRow", JSON.stringify(currentRow));
      localStorage.setItem("notInWord", JSON.stringify(notInWord));
    }
  }, [word, currentRow]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const dayOfYear = (date) =>
    Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );

  useEffect(() => {
    if (!cookies.word) {
      localStorage.clear();
      let expiration = new Date();
      expiration.setHours(23, 59, 59, 999);
      let syncedAnswer = dayOfYear(new Date());
      syncedAnswer =
        WORDS[Math.floor(((syncedAnswer + 8) / 365) * WORDS.length)];
      console.log(syncedAnswer);
      //let todaysAnswer = WORDS[Math.floor(Math.random() * WORDS.length)];
      setCookie("word", syncedAnswer, {
        path: "/",
        expires: expiration,
        secure: true,
        sameSite: "strict",
      });
      setAnswer(syncedAnswer);
    } else {
      setAnswer(cookies.word);
      let savedGuess = localStorage.getItem("guess");
      let savedBoxes = localStorage.getItem("boxes");
      let savedWord = localStorage.getItem("word");
      let savedCurrentRow = localStorage.getItem("currentRow");
      let savedNotInWord = localStorage.getItem("notInWord");
      setGuess(JSON.parse(savedGuess));
      setBoxes(JSON.parse(savedBoxes));
      setWord(JSON.parse(savedWord));
      setNotInWord(JSON.parse(savedNotInWord));
      setCurrentRow(JSON.parse(savedCurrentRow));
    }
  }, []);

  function Enterword(e) {
    if (e.target.value === "⬅") {
      if (word.length > 0) {
        setWord(() => word.slice(0, -1));
        //setGuessObj({ ...guessObj, word: word.slice(0, -1) });
      }
    } else if (e.target.value === "⏎") {
      if (word.length === 5) {
        checkAnswer();
      } else {
        setSnackMessage("Not Long Enough");
        setOpenSnackBar(true);
      }
    } else {
      if (word.length <= 4 && word.length >= 0) {
        setWord(() => word + e.target.value);
        //setGuessObj({ ...guessObj, word: word + e.target.value });
      }
    }
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const gameWon = () => {
    console.log(boxes);
    setWonGame(true);
    let shareabletext = [
      boxes.flat().map((c, i) => {
        if (c === "green") {
          return "🟩";
        } else if (c === "orange") {
          return "🟧";
        } else {
          return "⬛";
        }
      }),
      "🟩",
      "🟩",
      "🟩",
      "🟩",
      "🟩",
    ];
    console.log(boxes);
    shareabletext = shareabletext
      .flat()
      .map((m, i) => (i % 5 === 0 ? "\n" + m : m))
      .join("");
    console.log(shareabletext);
    setWinningText(shareabletext);
    handleClickOpenDialog();
  };

  const gameLost = () => {
    setNotInWord([...notInWord, ["⏎", "⬅"]]);
    handleClickOpenDialog();
  };

  const checkAnswer = () => {
    setFalseWord(false);
    if (WORDS.includes(word)) {
      setCurrentRow(currentRow + 1);
      setGuess([...guess, word]);
      if (word === answer) {
        setSnackMessage("You Won!");
        let currentBoxes = [];
        word.split("").map(() => currentBoxes.push("green"));
        setBoxes([...boxes, currentBoxes]);
        setWord("");
        gameWon();
      } else {
        let currentBoxes = [];
        let letnotinword = [];
        word.split("").map((letter, index) => {
          if (answer.includes(letter)) {
            if (answer[index] === letter) {
              return currentBoxes.push("green");
            } else {
              return currentBoxes.push("orange");
            }
          } else {
            return currentBoxes.push("gray"), letnotinword.push(letter);
          }
        });
        setBoxes([...boxes, currentBoxes]);
        setNotInWord([...notInWord, letnotinword]);
        let checkrow = parseInt(currentRow) + 1;
        console.log(checkrow);
        if (checkrow >= 6) {
          gameLost();
        } else {
          setWord("");
        }
      }
    } else {
      setSnackMessage("Not in Word List");
      setOpenSnackBar(true);
      setFalseWord(true);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginBottom: 2,
        height: "100vh",
      }}
    >
      <Stack
        direction="row"
        spacing={7}
        sx={{ mt: 1 }}
        justifyContent="center"
        alignItems="center"
      >
        <HelpOutlineRoundedIcon />
        <Typography variant="h4">FAUXDLE</Typography>
        <QueryStatsIcon />
      </Stack>
      <Box sx={{ pt: 1, pb: 1 }}>
        {[...Array(6)].map((stack, s) => {
          return (
            <Stack
              sx={{ mb: 0.5, justifyContent: "center" }}
              key={s}
              direction="row"
              spacing={1}
            >
              {[...Array(5)].map((cell, c) => {
                let row = Math.floor((c + 5 * s) / 5);
                return (
                  <Cell
                    key={c}
                    row={row}
                    guess={guess[row]}
                    placement={c}
                    currentRow={currentRow}
                    word={word}
                    boxes={boxes[row]}
                  />
                );
              })}
            </Stack>
          );
        })}
      </Box>
      {!wonGame && <KeyBoard Enterword={Enterword} notInWord={notInWord} />}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={1500}
        onClose={handleClose}
        message={snackMessage}
      />
      <Dialog
        dialogTitle={"You Got It!"}
        dialogContent={"winner winner winner"}
        handleClickOpenDialog={handleClickOpenDialog}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        winningText={winningText}
        wonGame={wonGame}
      />
    </Container>
  );
}

export default Content;
