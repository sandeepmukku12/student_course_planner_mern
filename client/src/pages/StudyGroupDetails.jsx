import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import api from "../api/axios";
import GroupHeader from "../components/GroupHeader";
import GroupMeta from "../components/GroupMeta";

const StudyGroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // stored during login

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/study-groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleJoin = async () => {
    await api.put(`/study-groups/${id}/join`);
    fetchGroup();
  };

  const handleLeave = async () => {
    await api.put(`/study-groups/${id}/leave`);
    fetchGroup();
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return <Typography>Group not found</Typography>;
  }

  const isMember = group.members.includes(userId);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <GroupHeader
        group={group}
        isMember={isMember}
        onJoin={handleJoin}
        onLeave={handleLeave}
      />

      <Box mt={4}>
        <GroupMeta group={group} />
      </Box>
    </Box>
  );
};

export default StudyGroupDetails;
