import { Box, Button, Typography } from "@mui/material";

const GroupHeader = ({ group, isMember, onJoin, onLeave }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          {group.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {group.course?.name}
        </Typography>
      </Box>

      {isMember ? (
        <Button
          variant="outlined"
          onClick={onLeave}
          sx={{ color: "#fff", borderColor: "#fff" }}
        >
          Leave Group
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onJoin}
          sx={{
            bgcolor: "#fff",
            color: "#2575fc",
            fontWeight: "bold",
          }}
        >
          Join Group
        </Button>
      )}
    </Box>
  );
};

export default GroupHeader;
