import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const StudyGroupsPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    language: "",
    skillLevel: "",
    course: "",
  });

  const fetchGroups = async () => {
    try {
      const res = await api.get("/study-groups", {
        params: {
          ...filters,
          page,
          limit: 6,
        },
      });

      setGroups(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to load study groups");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [filters, page]);

  const handleJoin = async (groupId) => {
    try {
      await api.put(`/study-groups/${groupId}/join`);
      toast.success("Joined study group");
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Join failed");
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await api.put(`/study-groups/${groupId}/leave`);
      toast.success("Left study group");
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Leave failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Study Groups
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <TextField
          label="Search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          fullWidth
        />

        <Select
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Languages</MenuItem>
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">Hindi</MenuItem>
        </Select>

        <Select
          value={filters.skillLevel}
          onChange={(e) =>
            setFilters({ ...filters, skillLevel: e.target.value })
          }
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Levels</MenuItem>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </Stack>

      {/* Groups */}
      {groups.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            No study groups found
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card
                onClick={() => navigate(`/study-groups/${group._id}`)}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {group.name}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} mb={2}>
                    <Chip label={group.language} size="small" />
                    <Chip label={group.skillLevel} size="small" />
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Members: {group.members.length}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoin(group._id);
                    }}
                  >
                    Join
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeave(group._id);
                    }}
                  >
                    Leave
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Stack direction="row" spacing={2} mt={4}>
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <Typography mt={1}>
            Page {pagination.page} of {pagination.totalPages}
          </Typography>
          <Button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default StudyGroupsPage;
