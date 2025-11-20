"use client";

import React from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PaidIcon from "@mui/icons-material/Paid";
import ChurchIcon from "@mui/icons-material/Church";

interface ReportsListProps {
  reports: any;
  values?: any;
}

const iconBgColors = {
  Spend: "#DCE6FA",
  Impressions: "#C9F0E4",
  Views: "#E6DAFB", //
  "Professions of Faith": "#FDE3B8",
  "Cost per POF": "#D9FAED",
};

const iconColors = {
  Spend: "#5276E5",
  Impressions: "#22B07D",
  Views: "#9D7FDA",
  "Professions of Faith": "#F7A402",
  "Cost per POF": "#4BCD9D",
};

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  if (!reports || Object.keys(reports).length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 6, textAlign: "center" }}>
        No data available.
      </Typography>
    );
  }

  const metrics = [
    { label: "Spend", value: reports.spend || 0, icon: PaymentsIcon },
    {
      label: "Impressions",
      value: reports.impressions || 0,
      icon: VisibilityIcon,
    },
    {
      label: "Views",
      value: reports.sessions || 0,
      icon: PlayCircleOutlineIcon,
    },
    {
      label: "Professions of Faith",
      value: reports.pofs || 0,
      icon: ChurchIcon,
    },
    { label: "Cost per POF", value: reports.cppof || 0, icon: PaidIcon },
  ];

  const formatValue = (label: string, value: number) => {
    if (label === "Spend" || label === "Cost per POF") {
      console.log(label, value);

      const options =
        label === "Spend"
          ? { style: "currency", currency: "USD", minimumFractionDigits: 0 }
          : { style: "currency", currency: "USD", minimumFractionDigits: 2 };

      return Number(value).toLocaleString(
        "en-US",
        options as unknown as Intl.NumberFormatOptions
      );
    }
    return value.toLocaleString();
  };

  return (
    <Grid
      container
      spacing={5}
      sx={{
        mt: 5,
        px: 4,
        justifyContent: { xs: "center", md: "flex-center" },
      }}
    >
      {metrics.map(({ label, value, icon: Icon }) => (
        <Grid
          item
          key={label}
          sx={{
            width: 350,
            height: 200,
            display: "flex",
          }}
        >
          <Card
            elevation={1}
            sx={(theme) => ({
              width: "100%",
              height: "100%",
              padding: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "background.paper",
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              transition: "0.25s ease",

              // HOVER CUSTOMIZED FOR LIGHT & DARK
              "&:hover": {
                transform: "translateY(-4px)",

                // Different hover effects depending on theme mode
                ...(theme.palette.mode === "dark"
                  ? {
                      boxShadow: "0 0 12px rgba(0, 255, 200, 0.25)",
                      border: "1px solid rgba(0, 255, 200, 0.40)",
                      backgroundColor: "rgba(255,255,255,0.03)",
                    }
                  : {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(0,0,0,0.12)",
                      backgroundColor: "#ffffff",
                    }),
                cursor: "pointer",
              },
            })}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 700 }}
              >
                {label}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ lineHeight: 1.5 }}
              >
                {formatValue(label, value)}
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 3,
                backgroundColor: iconBgColors[label],
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon sx={{ color: iconColors[label], fontSize: 32 }} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportsList;
