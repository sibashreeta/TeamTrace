// src/components/chat/MessageInput.tsx
import React, { useState } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <Box display="flex" gap={1}>
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <IconButton onClick={handleSend} color="primary">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
