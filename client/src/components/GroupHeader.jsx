import { Box, Button, Typography, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const GroupHeader = ({
  group,
  isMember,
  isHost,
  onJoin,
  onLeave,
  onDeleteClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
        width: "100%",
      }}
    >
      <Box>
        <Typography
          variant="h3"
          fontWeight="800"
          sx={{ mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}
        >
          {group.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="500">
          {group.course?.name || "General Study Group"}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        {isHost && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDeleteClick}
            sx={{ borderRadius: 3, fontWeight: "bold" }}
          >
            Delete Group
          </Button>
        )}

        {isMember ? (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={onLeave}
            sx={{ borderRadius: 3, fontWeight: "bold" }}
          >
            Leave Group
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={onJoin}
            sx={{ borderRadius: 3, fontWeight: "bold", px: 4 }}
          >
            Join Group
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default GroupHeader;
