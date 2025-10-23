"use client";

import { Box, Paper, Typography, Avatar, useTheme, useMediaQuery, CircularProgress } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function ChatBubble({ from, text, streaming = false }) {
  const isUser = from === "user";
  const { user } = useUser();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const avatarSrc = isUser ? (user?.profileImageUrl ?? user?.imageUrl) : null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: { xs: 1.25, sm: 2 },
        gap: 1,
        alignItems: "flex-end",
        px: { xs: 0.5, sm: 1 },
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "transparent", width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>
          <Image src={"/chess.svg"} alt="AI Avatar" layout="fill" objectFit="cover" />
        </Avatar>
      )}

      <Paper
        elevation={2}
        sx={{
          maxWidth: { xs: "85%", sm: "70%" },
          px: { xs: 1.25, sm: 2 },
          py: { xs: 0.8, sm: 1 },
          bgcolor: isUser ? "#1976d2" : "#e0e0e0",
          color: isUser ? "#ffffff" : "#0b1820",
          borderTopLeftRadius: isUser ? 20 : 5,
          borderTopRightRadius: isUser ? 5 : 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          fontSize: { xs: "0.92rem", sm: "1rem" },
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {streaming && !text ? (
          // show thinking + spinner until first chunk arrives
          <>
            <CircularProgress size={16} sx={{ color: isUser ? "#fff" : "#1976d2" }} />
            <Typography variant="body1" sx={{ ml: 0.5 }}>
              Thinking...
            </Typography>
          </>
        ) : (
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {text}
          </Typography>
        )}
      </Paper>

      {isUser && (
        <Avatar src={avatarSrc} sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>
          {!avatarSrc && "U"}
        </Avatar>
      )}
    </Box>
  );
}
