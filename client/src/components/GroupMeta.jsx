import { Grid, Paper, Typography } from "@mui/material";

const MetaItem = ({ label, value }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      borderRadius: 2,
      textAlign: "center",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight="bold">{value}</Typography>
  </Paper>
);

const GroupMeta = ({ group }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={3}>
        <MetaItem label="Language" value={group.language} />
      </Grid>
      <Grid item xs={6} md={3}>
        <MetaItem label="Skill Level" value={group.skillLevel} />
      </Grid>
      <Grid item xs={6} md={3}>
        <MetaItem label="Members" value={group.members.length} />
      </Grid>
      <Grid item xs={6} md={3}>
        <MetaItem label="Course Code" value={group.course?.code} />
      </Grid>
    </Grid>
  );
};

export default GroupMeta;
