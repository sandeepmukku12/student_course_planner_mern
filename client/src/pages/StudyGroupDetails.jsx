import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Avatar,
  Paper,
  Stack,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api/axios";
import GroupHeader from "../components/GroupHeader";
import GroupMeta from "../components/GroupMeta";
import StudySessionList from "../components/StudySessionList";
import { useAuth } from "../context/AuthContext";

const StudyGroupDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchGroup = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/study-groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      toast.error("Failed to load group");
      navigate("/study-groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchGroup();
  }, [id, user, authLoading]);

  const isMember = useMemo(() => {
    return group?.members?.some((m) => String(m._id) === String(user?._id));
  }, [group, user]);

  const isHost = useMemo(() => {
    return group && user && String(group.creator) === String(user._id);
  }, [group, user]);

  useEffect(() => {
    if (group && user?._id && !isMember) {
      toast.info("You must join this group to view details");
      navigate("/study-groups");
    }
  }, [group, user, navigate, isMember]);

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/study-groups/${id}`);
      toast.success("Study group deleted successfully");
      navigate("/study-groups");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete group");
    }
  };

  if (authLoading || loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (!group) return <Typography sx={{ p: 4 }}>Group not found</Typography>;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 6 },
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/study-groups")}
        sx={{ mb: 3, fontWeight: "bold", color: "text.secondary" }}
      >
        Back to Study Groups
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          mb: 5,
        }}
      >
        <GroupHeader
          group={group}
          isMember={isMember}
          isHost={isHost}
          onJoin={fetchGroup}
          onLeave={() => navigate("/study-groups")}
          onDeleteClick={() => setDeleteDialogOpen(true)}
        />
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <Stack spacing={{ xs: 6, md: 10 }}>
            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }}>
                Group Overview
              </Typography>
              <GroupMeta group={group} />
            </Box>
            <Divider sx={{ opacity: 0.6 }} />
            <Box>
              <StudySessionList groupId={group._id} isHost={isHost} />
            </Box>
          </Stack>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", lg: 320 },
            p: 3,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            position: { lg: "sticky" },
            top: 24,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Members ({group.members?.length || 0})
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {group.members?.map((member) => (
              <Box
                key={member._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.2,
                  borderRadius: 3,
                }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                  {member.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {member.name}
                  </Typography>
                  {String(member._id) === String(user?._id) && (
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight="bold"
                    >
                      {" "}
                      (You)
                    </Typography>
                  )}
                </Box>
                {String(group.creator) === String(member._id) && (
                  <Chip
                    label="Host"
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontWeight: "bold" }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Delete Study Group?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{group.name}</strong>? This
            will also remove all scheduled study sessions. This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteGroup}>
            Delete Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyGroupDetails;
