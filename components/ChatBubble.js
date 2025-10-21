"use client";

import { Box, Paper, Typography, Avatar } from "@mui/material";

export default function ChatBubble({ from, text }) {
  const isUser = from === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        gap: 1,
        alignItems: "center",
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32, fontWeight: "bold" }}>
          AI
        </Avatar>
      )}

      <Paper
        elevation={3}
        sx={{
          maxWidth: "70%",
          px: 2,
          py: 1,
          bgcolor: isUser ? "#1976d2" : "#e0e0e0",
          color: isUser ? "#ffffff" : "#000000",
          borderTopLeftRadius: isUser ? 20 : 5,
          borderTopRightRadius: isUser ? 5 : 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Paper>

      {isUser && (
        <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32, fontWeight: "bold" }}>
          U
        </Avatar>
      )}
    </Box>
  );
}
