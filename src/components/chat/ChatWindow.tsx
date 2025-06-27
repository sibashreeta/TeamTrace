// src/components/chat/ChatWindow.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { sendMessage, subscribeToMessages, generateChatId } from "../../services/chatService";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Props {
  currentUserId: string;
  selectedUserId: string;
  selectedUserName: string;
}

const ChatWindow: React.FC<Props> = ({ currentUserId, selectedUserId, selectedUserName }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const chatId = generateChatId(currentUserId, selectedUserId);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, setMessages);
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async (text: string) => {
    await sendMessage(chatId, currentUserId, text);
  };

  return (
    <Paper sx={{ p: 2, height: "500px", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        Chat with {selectedUserName}
      </Typography>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2, mb: 1 }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} text={msg.text} isMine={msg.senderId === currentUserId} />
        ))}
      </Box>
      <MessageInput onSend={handleSend} />
    </Paper>
  );
};

export default ChatWindow;