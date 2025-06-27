//src/components/chat/MessageBubble.tsx
import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface Props {
  text: string;
  isMine: boolean;
}

const MessageBubble: React.FC<Props> = ({ text, isMine }) => {
  return (
    <Box display="flex" justifyContent={isMine ? "flex-end" : "flex-start"} mb={1}>
      <Paper
        sx={{
          p: 1.5,
          px: 2,
          borderRadius: 3,
          bgcolor: isMine ? "primary.main" : "grey.300",
          color: isMine ? "white" : "black",
          maxWidth: "65%",
        }}
      >
        <Typography>{text}</Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble; 