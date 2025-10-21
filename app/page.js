"use client";

import { Typography, Box, Paper } from "@mui/material";
import ChatBox from "../components/CahtBox";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 3,
          mb: 3,
          width: "100%",
          maxWidth: 600,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        <Typography variant="h3" gutterBottom color="primary">
          ChessMate
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Ask your chess questions and learn from the AI Chess expert!
        </Typography>
      </Paper>

      <ChatBox />
    </Box>
  );
}
