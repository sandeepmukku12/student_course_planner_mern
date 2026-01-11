import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CoursesPage = () => {
  const { user, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState({ search: "" });
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await api.get("/courses", { params: filters });
      setCourses(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const { displayCourses, myCoursesCount } = useMemo(() => {
    if (!user) return { displayCourses: [], myCoursesCount: 0 };

    const enrolledIds = new Set(
      (user.enrolledCourses || []).map((id) => String(id._id || id))
    );

    const allWithStatus = courses.map((course) => ({
      ...course,
      enrolled: enrolledIds.has(String(course._id)),
    }));

    const mine = allWithStatus.filter((c) => c.enrolled);

    return {
      displayCourses: tab === 0 ? allWithStatus : mine,
      myCoursesCount: mine.length,
    };
  }, [courses, user, tab]);

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    try {
      await api.put(`/courses/${courseId}/enroll`);
      const updatedList = [...(user.enrolledCourses || []), courseId];
      updateUser({ enrolledCourses: updatedList });
      toast.success("Enrolled successfully");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Enrollment failed");
    }
  };

  const handleAddCourse = async () => {
    try {
      await api.post("/courses", newCourse);
      toast.success("Course added");
      setOpenDialog(false);
      setNewCourse({ name: "", code: "", description: "" });
      fetchCourses();
    } catch (err) {
      toast.error("Failed to add course");
    }
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          height: "70vh",
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
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="800" color="primary.main">
          Explore Courses
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          + Add Course
        </Button>
      </Box>

      {/* Search Field */}
      <TextField
        placeholder="Search by course name or code..."
        fullWidth
        variant="outlined"
        sx={{ mb: 4, bgcolor: "background.paper", borderRadius: 1 }}
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      {/* Tabs with spacing */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 4,
          "& .MuiTabs-flexContainer": { gap: 4 }, // Adds space between tab buttons
        }}
      >
        <Tab
          label={`All Courses (${courses.length})`}
          sx={{ fontWeight: "bold" }}
        />
        <Tab
          label={`My Courses (${myCoursesCount})`}
          sx={{ fontWeight: "bold" }}
        />
      </Tabs>

      {/* Course Grid */}
      {loadingCourses && courses.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent
                  onClick={() => navigate(`/courses/${course._id}`)}
                  sx={{ cursor: "pointer", flexGrow: 1, p: 3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={course.code}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                    {course.enrolled && (
                      <Chip
                        label="Enrolled"
                        size="small"
                        color="success"
                        sx={{ color: "white", fontWeight: "bold" }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 1, mt: 1 }}
                  >
                    {course.name}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.6,
                    }}
                  >
                    {course.description ||
                      "No description available for this course."}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  {!course.enrolled ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(e) => handleEnroll(e, course._id)}
                      sx={{ borderRadius: 2, py: 1, fontWeight: "bold" }}
                    >
                      Enroll Now
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled
                      sx={{ borderRadius: 2, py: 1 }}
                    >
                      Already Enrolled
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Course Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Create New Course</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Course Name"
              fullWidth
              required
              onChange={(e) =>
                setNewCourse({ ...newCourse, name: e.target.value })
              }
            />
            <TextField
              label="Course Code (e.g. CS101)"
              fullWidth
              required
              onChange={(e) =>
                setNewCourse({ ...newCourse, code: e.target.value })
              }
            />
            <TextField
              label="Course Description"
              fullWidth
              multiline
              rows={4}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddCourse} variant="contained" sx={{ px: 4 }}>
            Create Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursesPage;
