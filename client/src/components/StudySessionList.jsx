import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../api/axios";
import StudySessionCard from "./StudySessionCard";
import AddSessionDialog from "./AddSessionDialog";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const StudySessionList = ({ groupId, isHost }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const res = await api.get(`/study-sessions/${groupId}`);
      const data = res.data?.data || res.data || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load study sessions");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleDeleteSession = async () => {
    try {
      await api.delete(`/study-sessions/${confirmDeleteId}`);
      setSessions((prev) => prev.filter((s) => s._id !== confirmDeleteId));
      toast.success("Session deleted");
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error("Could not delete session");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="800">
          Study Sessions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, fontWeight: "bold" }}
        >
          New Session
        </Button>
      </Box>

      {loading ? (
        <CircularProgress size={30} />
      ) : sessions.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            borderStyle: "dashed",
          }}
        >
          <Typography color="text.secondary">
            No sessions scheduled yet.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} key={session._id}>
              <StudySessionCard
                session={session}
                canDelete={
                  isHost || String(session.creator) === String(user?._id)
                }
                onDelete={() => setConfirmDeleteId(session._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AddSessionDialog
        open={open}
        onClose={() => setOpen(false)}
        groupId={groupId}
        onCreated={fetchSessions}
      />

      {/* Confirmation for Session Delete */}
      <Dialog
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Delete Session?</DialogTitle>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSession}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudySessionList;
