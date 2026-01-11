import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Search,
  School,
  Translate,
  TrendingUp,
  Explore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [featuredGroups, setFeaturedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // 1. Fetch all courses
        const coursesRes = await api.get("/courses");
        setCourses(coursesRes.data || []);

        // 2. Fetch top study groups (limit 4 for the "Featured" section)
        const groupsRes = await api.get(
          "/study-groups?limit=4&sortBy=members&order=desc"
        );
        setFeaturedGroups(groupsRes.data.data || []);
      } catch (err) {
        console.error("Resource fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Resource Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover study groups, course materials, and learning communities.
        </Typography>
      </Box>

      {/* Global Search Bar */}
      <TextField
        fullWidth
        placeholder="Search for a course code or study topic..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 6, bgcolor: "white", borderRadius: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={5}>
        {/* LEFT COLUMN: Course Directory (70%) */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Featured Groups Section */}
            <Box>
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <TrendingUp color="primary" /> Trending Study Groups
              </Typography>
              <Grid container spacing={2}>
                {featuredGroups.map((group) => (
                  <Grid item xs={12} sm={6} key={group._id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        transition: "0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "primary.50",
                        },
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {group.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 1.5 }}
                      >
                        {group.course?.code} • {group.members?.length} Members
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/study-groups/${group._id}`)}
                        sx={{ borderRadius: 1.5, textTransform: "none" }}
                      >
                        Join Discussion
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Full Course Directory */}
            <Box>
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Explore color="primary" /> Browse All Courses
              </Typography>
              <Grid container spacing={2}>
                {courses
                  .filter(
                    (c) =>
                      c.code.toLowerCase().includes(search.toLowerCase()) ||
                      c.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((course) => (
                    <Grid item xs={6} sm={4} md={3} key={course._id}>
                      <Paper
                        onClick={() => navigate(`/courses/${course._id}`)}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 3,
                          cursor: "pointer",
                          border: "1px solid transparent",
                          bgcolor: "background.paper",
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-3px)",
                          },
                          transition: "all 0.2s",
                        }}
                        elevation={1}
                      >
                        <School color="primary" sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" fontWeight="900">
                          {course.code}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          display="block"
                        >
                          {course.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: QUICK FILTERS (30%) */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Browse by Level
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1.5 }}
              >
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <Chip
                    key={level}
                    label={level}
                    onClick={() =>
                      navigate(`/study-groups?skillLevel=${level}`)
                    }
                    sx={{ fontWeight: "bold", borderRadius: 1.5 }}
                  />
                ))}
              </Stack>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Browse by Language
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1.5 }}
              >
                {["English", "Spanish", "French", "Hindi"].map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    icon={<Translate sx={{ fontSize: "14px !important" }} />}
                    onClick={() => navigate(`/study-groups?language=${lang}`)}
                    sx={{ fontWeight: "bold", borderRadius: 1.5 }}
                  />
                ))}
              </Stack>
            </Paper>

            {/* Help/Support Box */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "primary.main",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Need Help?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1, mb: 3 }}>
                Can't find a group for your specific course?
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/study-groups")}
              >
                Create a Group
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourcesPage;
