import { Grid, Box, Typography } from "@mui/material";

const MetaItem = ({ label, value }) => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "90px",
      height: "100%",
      boxSizing: "border-box",
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography variant="h6" fontWeight="700" sx={{ lineHeight: 1.2 }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

const GroupMeta = ({ group }) => {
  return (
    <Grid container spacing={2} rowSpacing={{ xs: 3, sm: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <MetaItem label="Language" value={group.language} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetaItem label="Skill Level" value={group.skillLevel} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetaItem label="Members" value={group.members?.length} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetaItem label="Course Code" value={group.course?.code} />
      </Grid>
    </Grid>
  );
};

export default GroupMeta;
