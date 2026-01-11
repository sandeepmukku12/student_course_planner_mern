import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import {
  Schedule,
  CalendarMonth,
  School,
  Groups,
  ArrowForward,
  Add as AddIcon,
  Timer,
  History,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PlannerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const coursesRes = await api.get("/courses");
      setAllCourses(coursesRes.data || []);
    } catch (err) {
      console.warn("Course lookup failed");
    }

    try {
      const groupsRes = await api.get("/study-groups?type=my");
      const myGroups = groupsRes.data.data || [];

      const sessionPromises = myGroups.map((group) =>
        api.get(`/study-sessions/${group._id}`)
      );

      const allRes = await Promise.all(sessionPromises);
      const combined = allRes.flatMap((res) => res.data || []);

      // Initial sort: Chronological
      const sorted = combined.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSessions(sorted);
    } catch (err) {
      console.error("Session fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Separate sessions by date
  const { upcomingSessions, pastSessions } = useMemo(() => {
    const now = new Date();
    return {
      upcomingSessions: sessions.filter((s) => new Date(s.date) >= now),
      pastSessions: sessions.filter((s) => new Date(s.date) < now).reverse(), // Recent history first
    };
  }, [sessions]);

  const mappedCourses = useMemo(() => {
    const userCourseIds = user?.enrolledCourses || [];
    return userCourseIds.map((courseRef) => {
      if (typeof courseRef === "object" && courseRef !== null) return courseRef;
      const match = allCourses.find((c) => String(c._id) === String(courseRef));
      return (
        match || {
          _id: courseRef,
          code: "Course",
          name: `ID: ...${String(courseRef).slice(-4)}`,
        }
      );
    });
  }, [user, allCourses]);

  const totalStudyMins = useMemo(
    () => sessions.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0),
    [sessions]
  );

  // Helper component to render session list
  const SessionList = ({ sessionData, isPast }) => (
    <Stack spacing={2.5}>
      {sessionData.map((session) => (
        <Paper
          key={session._id}
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 4,
            transition: "0.3s",
            border: "1px solid",
            borderColor: "divider",
            opacity: isPast ? 0.75 : 1,
            bgcolor: isPast ? "transparent" : "background.paper",
            "&:hover": {
              borderColor: isPast ? "text.disabled" : "primary.main",
              bgcolor: isPast ? "action.hover" : "rgba(99, 102, 241, 0.02)",
              transform: "translateY(-2px)",
              opacity: 1,
            },
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={2.5}>
              <Box
                sx={{
                  textAlign: "center",
                  bgcolor: isPast ? "text.disabled" : "primary.main",
                  color: "white",
                  py: 1.5,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "900",
                    display: "block",
                    textTransform: "uppercase",
                  }}
                >
                  {new Date(session.date).toLocaleString([], {
                    month: "short",
                  })}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "900" }}>
                  {new Date(session.date).getDate()}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6.5}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 0.5 }}>
                {session.topic}
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Chip
                  icon={<Schedule sx={{ fontSize: 16 }} />}
                  label={session.startTime}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Timer sx={{ fontSize: 16 }} />}
                  label={`${session.duration}m`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Groups sx={{ fontSize: 16 }} />}
                  label={isPast ? "Completed" : "Group Study"}
                  size="small"
                  color={isPast ? "default" : "primary"}
                  sx={{ fontWeight: "bold" }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ textAlign: { sm: "right" } }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={() => navigate(`/study-groups/${session.group}`)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Details
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      <Typography
        variant="h4"
        fontWeight="900"
        sx={{ mb: 4, color: "text.primary" }}
      >
        Academic Planner
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT COLUMN: THE AGENDA STACK */}
        <Grid item xs={12} lg={8.2}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            {/* UPCOMING SECTION */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 3 }}
            >
              <CalendarMonth color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight="800">
                Upcoming Agenda
              </Typography>
            </Stack>

            {upcomingSessions.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 4,
                  mb: 6,
                }}
              >
                <Typography color="text.secondary">
                  No upcoming sessions scheduled.
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate("/study-groups")}
                  sx={{ mt: 1, fontWeight: "bold" }}
                >
                  Find a Group
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 8 }}>
                <SessionList sessionData={upcomingSessions} isPast={false} />
              </Box>
            )}

            <Divider sx={{ mb: 6 }} />

            {/* PAST SECTION */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 3 }}
            >
              <History color="action" fontSize="large" />
              <Typography variant="h5" fontWeight="800" color="text.secondary">
                Study History
              </Typography>
            </Stack>

            {pastSessions.length === 0 ? (
              <Typography
                color="text.disabled"
                sx={{ fontStyle: "italic", textAlign: "center", py: 4 }}
              >
                No completed sessions found.
              </Typography>
            ) : (
              <SessionList sessionData={pastSessions} isPast={true} />
            )}
          </Paper>
        </Grid>

        {/* RIGHT SIDEBAR */}
        <Grid item xs={12} lg={3.8}>
          <Stack spacing={4} sx={{ position: { lg: "sticky" }, top: 24 }}>
            {/* My Courses */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <School color="primary" /> My Courses
              </Typography>
              <Stack spacing={1.5}>
                {mappedCourses.length > 0 ? (
                  mappedCourses.map((course) => (
                    <Box
                      key={course._id}
                      onClick={() => navigate(`/courses/${course._id}`)}
                      sx={{
                        p: 2,
                        bgcolor: "action.hover",
                        borderRadius: 3,
                        cursor: "pointer",
                        border: "1px solid transparent",
                        transition: "0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "primary.50",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="900"
                        color="primary"
                      >
                        {course.code}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="500"
                        noWrap
                      >
                        {course.name}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    Not enrolled yet.
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/courses")}
                  sx={{ mt: 1, textTransform: "none", fontWeight: "bold" }}
                >
                  Browse Courses
                </Button>
              </Stack>
            </Paper>

            {/* Weekly Overview */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "grey.900",
                color: "white",
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Overall Stats
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Total Sessions
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {sessions.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Total Minutes
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {totalStudyMins}m
                  </Typography>
                </Box>
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.6,
                    fontStyle: "italic",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  {pastSessions.length > 5
                    ? "You're on a roll!"
                    : "Keep building that history!"}
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlannerPage;
