import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AddSessionDialog = ({ open, onClose, groupId, onCreated }) => {
  const [form, setForm] = useState({
    topic: "",
    date: "",
    startTime: "",
    duration: "",
    location: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await api.post("/study-sessions", {
        ...form,
        groupId,
      });

      setForm({
        topic: "",
        date: "",
        startTime: "",
        duration: "",
        location: "",
      });

      toast.success("Study session scheduled");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add session");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Schedule Study Session</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Topic"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Start Time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            fullWidth
            placeholder="18:00"
            required
          />

          <TextField
            label="Duration (minutes)"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Location / Platform"
            name="location"
            placeholder="e.g. Library Room 204 or Discord"
            fullWidth
            sx={{ mt: 2 }}
            value={form.location}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSessionDialog;
