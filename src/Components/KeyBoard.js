import Key from "./Key";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const KeyBoard = ({ Enterword, notInWord }) => {
  const firstrow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const secondrow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const thirdrow = ["ENTER", "z", "x", "c", "v", "b", "n", "m", "DELETE"];

  return (
    <Box sx={{ mt: 5, margin: "auto" }}>
      <Stack direction="row" justifyContent="center" alignItems="center">
        {firstrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              Enterword={Enterword}
              notInWord={notInWord}
            />
          );
        })}
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems="center">
        {secondrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              Enterword={Enterword}
              notInWord={notInWord}
            />
          );
        })}
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems="center">
        {thirdrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              Enterword={Enterword}
              notInWord={notInWord}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default KeyBoard;