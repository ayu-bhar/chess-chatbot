"use client";

import { Box, Paper, Typography, Avatar, useTheme, useMediaQuery } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function ChatBubble({ from, text }) {
  const isUser = from === "user";
  const { user } = useUser();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs")) || useMediaQuery(theme.breakpoints.down("sm"));

  // Clerk v4 exposes profileImageUrl; imageUrl is a common fallback
  const avatarSrc = isUser ? (user?.profileImageUrl ?? user?.imageUrl) : null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        gap: 1,
        alignItems: "flex-end",
        px: { xs: 0.5, sm: 1 },
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "transparent", width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, fontWeight: "bold" }}>
          <Image src="/chess.svg" alt="Chess Logo" layout="fill" objectFit="contain" />
        </Avatar>
      )}

      <Paper
        elevation={3}
        sx={{
          maxWidth: { xs: "85%", sm: "70%" },
          px: { xs: 1.25, sm: 2 },
          py: { xs: 0.8, sm: 1 },
          bgcolor: isUser ? "#1976d2" : "#e0e0e0",
          color: isUser ? "#ffffff" : "#000000",
          borderTopLeftRadius: isUser ? 20 : 5,
          borderTopRightRadius: isUser ? 5 : 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          fontSize: { xs: "0.92rem", sm: "1rem" },
          boxShadow: isUser ? "0 6px 18px rgba(0,120,255,0.12)" : "none",
        }}
      >
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {text}
        </Typography>
      </Paper>

      {isUser && (
        <Avatar
          src={avatarSrc}
          sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, fontWeight: "bold" }}
        >
          {!avatarSrc && "U"}
        </Avatar>
      )}
    </Box>
  );
}
