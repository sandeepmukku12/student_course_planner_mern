import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Paper,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [relatedGroups, setRelatedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const [newGroup, setNewGroup] = useState({
    name: "",
    language: "English",
    skillLevel: "Beginner",
    description: "",
  });

  const isEnrolled = useMemo(() => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.some((c) => String(c._id || c) === String(id));
  }, [user, id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);

      if (isEnrolled) {
        const groupsRes = await api.get("/study-groups", {
          params: { course: id },
        });
        setRelatedGroups(groupsRes.data?.data || []);
      }
    } catch (err) {
      toast.error("Failed to load course details");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchCourse();
  }, [id, authLoading, isEnrolled]);

  const handleEnroll = async () => {
    try {
      await api.put(`/courses/${id}/enroll`);
      const updatedEnrolled = [...(user.enrolledCourses || []), id];
      updateUser({ enrolledCourses: updatedEnrolled });
      toast.success("Successfully enrolled!");
    } catch (err) {
      toast.error("Enrollment failed");
    }
  };

  const handleUnenroll = async () => {
    try {
      await api.put(`/courses/${id}/unenroll`);
      const updatedEnrolled = user.enrolledCourses.filter(
        (c) => String(c._id || c) !== String(id)
      );
      updateUser({ enrolledCourses: updatedEnrolled });
      setConfirmOpen(false);
      toast.success("Unenrolled from course");
      navigate("/courses");
    } catch {
      toast.error("Failed to unenroll");
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name) return toast.error("Group name is required");
    try {
      await api.post("/study-groups", { ...newGroup, course: id });
      toast.success("Study group created!");
      setCreateGroupOpen(false);
      setNewGroup({
        name: "",
        language: "English",
        skillLevel: "Beginner",
        description: "",
      });
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create group");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await api.put(`/study-groups/${groupId}/join`);
      toast.success("Joined group!");
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to join");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await api.put(`/study-groups/${groupId}/leave`);
      toast.success("Left group");
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to leave");
    }
  };

  if (authLoading || loading) {
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
  }

  return (
    <Box
      sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: "1200px", margin: "0 auto" }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/courses")}
        sx={{ mb: 4, fontWeight: "bold", color: "text.secondary" }}
      >
        Back to Courses
      </Button>

      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          mb: 6,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Left Side: Course Info */}
          <Grid item xs={12} md={9}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Chip
                label={course?.code}
                color="primary"
                sx={{ fontWeight: "bold", borderRadius: 1.5 }}
              />
              {isEnrolled && (
                <Chip
                  label="Member"
                  color="success"
                  size="small"
                  sx={{ color: "white", fontWeight: "bold" }}
                />
              )}
            </Stack>
            <Typography
              variant="h3"
              fontWeight="800"
              sx={{ mb: 2, fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              {course?.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "90%" }}
            >
              {course?.description ||
                "Connect with peers through active study groups."}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              justifyContent: { md: "space-between" },
              textAlign: { md: "right" },
            }}
          >
            {!isEnrolled ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleEnroll}
                sx={{
                  borderRadius: 3,
                  py: 2,
                  px: 4,
                  fontWeight: "bold",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Enroll Now
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={() => setConfirmOpen(true)}
                sx={{
                  borderRadius: 3,
                  py: 1.8,
                  px: 4,
                  fontWeight: "bold",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Unenroll
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Study Groups Section Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <PeopleIcon color="primary" fontSize="large" /> Active Study Groups
        </Typography>

        {isEnrolled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateGroupOpen(true)}
            sx={{ borderRadius: 2, fontWeight: "bold" }}
          >
            Create Group
          </Button>
        )}
      </Box>

      {/* Groups Grid */}
      {!isEnrolled ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            bgcolor: "action.hover",
            border: "2px dashed",
            borderColor: "divider",
          }}
          elevation={0}
        >
          <Typography variant="h6" color="text.secondary">
            Enroll to participate in study groups.
          </Typography>
        </Paper>
      ) : relatedGroups.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            bgcolor: "action.hover",
          }}
          elevation={0}
        >
          <Typography variant="h6" color="text.secondary">
            No groups yet. Start one!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {relatedGroups.map((group) => {
            const isMember = group.members?.some(
              (m) => String(m._id || m) === String(user._id)
            );
            return (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <Card
                  onClick={() => {
                    if (isMember) {
                      navigate(`/study-groups/${group._id}`);
                    } else {
                      toast.info("Join group to view the details");
                    }
                  }}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": { boxShadow: 4 },
                    cursor: "pointer",
                  }}
                  elevation={0}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      noWrap
                      sx={{ mb: 1 }}
                    >
                      {group.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={group.language}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={group.skillLevel}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {group.members.length} members
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      {isMember ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeaveGroup(group._id);
                          }}
                          sx={{ borderRadius: 2.5, fontWeight: "bold" }}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group._id);
                          }}
                          sx={{ borderRadius: 2.5, fontWeight: "bold" }}
                        >
                          Join
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* CREATE GROUP DIALOG */}
      <Dialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>New Study Group</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Group Name"
              fullWidth
              value={newGroup.name}
              onChange={(e) =>
                setNewGroup({ ...newGroup, name: e.target.value })
              }
            />
            <TextField
              select
              label="Language"
              fullWidth
              value={newGroup.language}
              onChange={(e) =>
                setNewGroup({ ...newGroup, language: e.target.value })
              }
            >
              {["English", "Spanish", "French", "German", "Chinese"].map(
                (l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              select
              label="Skill Level"
              fullWidth
              value={newGroup.skillLevel}
              onChange={(e) =>
                setNewGroup({ ...newGroup, skillLevel: e.target.value })
              }
            >
              {["Beginner", "Intermediate", "Advanced"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateGroupOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* UNENROLL CONFIRMATION DIALOG */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
          Unenroll from Course?
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            You will be removed from this course and all associated study
            groups. Your progress and access to group discussions will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleUnenroll}
            sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
          >
            Confirm Unenroll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetailsPage;
