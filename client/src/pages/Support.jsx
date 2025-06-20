// src/pages/Support.jsx
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  useTheme,
  Grid,
  Link,
  Button,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Support() {
  const theme = useTheme();

  const data = [
    {
      icon: <EmailIcon />,
      title: "Email Us",
      detail: "support@eassessment.com",
      href: "mailto:support@eassessment.com",
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      detail: "+1 (800) 123-4567",
      href: "tel:+18001234567",
    },
    {
      icon: <DescriptionIcon />,
      title: "Documentation",
      detail: "eassessment.com/docs",
      href: "https://eassessment.com/docs",
    },
  ];

  return (
    <Container sx={{ py: 6, maxWidth: "md" }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mb: 4,
            background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            py: 2,
            px: 3,
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "common.white", color: theme.palette.secondary.main }}>
            <SupportAgentIcon />
          </Avatar>
          <Typography variant="h4" sx={{ color: "common.white" }}>
            Support
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {data.map((item) => (
            <Grid item xs={12} sm={4} key={item.title}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.light,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  sx={{ display: "block", mb: 2 }}
                >
                  {item.detail}
                </Link>
                <Button
                  variant="outlined"
                  size="small"
                  component="a"
                  href={item.href}
                  sx={{ textTransform: "none" }}
                >
                  Contact
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}
