import { Box, Paper, Typography, Grid } from "@mui/material";

const AuthLayout = ({ children, title }) => {
  return (
    <Grid
      container
      sx={{
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: "#ffffffcc", // slightly transparent white
            backdropFilter: "blur(8px)", // glassy effect
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              mb={3}
              fontWeight="bold"
              align="center"
              sx={{ color: "#333" }}
            >
              {title}
            </Typography>

            {children}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
