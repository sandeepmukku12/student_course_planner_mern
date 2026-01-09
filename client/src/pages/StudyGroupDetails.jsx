// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Box, CircularProgress, Typography } from "@mui/material";
// import api from "../api/axios";
// import GroupHeader from "../components/GroupHeader";
// import GroupMeta from "../components/GroupMeta";
// import StudySessionList from "../components/StudySessionList";
// import { useAuth } from "../context/AuthContext";

// const StudyGroupDetails = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [group, setGroup] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const userId = user._id; // stored during login

//   const fetchGroup = async () => {
//     try {
//       const res = await api.get(`/study-groups/${id}`);
//       setGroup(res.data);

//       // Check membership
//       const isMember = res.data.members.some((m) => m._id === userId);
//       if (!isMember) {
//         toast.info("You must join this group to view details");
//         navigate("/study-groups");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load group");
//       navigate("/study-groups");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchGroup();
//   }, [id, user]);

//   const handleJoin = async () => {
//     await api.put(`/study-groups/${id}/join`);
//     fetchGroup();
//   };

//   const handleLeave = async () => {
//     await api.put(`/study-groups/${id}/leave`);
//     navigate("/study-groups");
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           height: "70vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!group) {
//     return <Typography>Group not found</Typography>;
//   }

//   const isMember = group.members.some((m) => m._id === userId);

//   return (
//     <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
//       <GroupHeader
//         group={group}
//         isMember={isMember}
//         onJoin={handleJoin}
//         onLeave={handleLeave}
//       />

//       <Box mt={4}>
//         <GroupMeta group={group} />
//         <StudySessionList groupId={group._id} />
//       </Box>
//     </Box>
//   );
// };

// export default StudyGroupDetails;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";
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

  // Fetch group
  const fetchGroup = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/study-groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load group");
      navigate("/study-groups");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    if (!authLoading && user) fetchGroup();
  }, [id, user, authLoading]);

  // Redirect non-members
  useEffect(() => {
    if (group && user?._id) {
      const isMember = group.members?.some((m) => m._id === user._id);
      if (!isMember) {
        toast.info("You must join this group to view details");
        navigate("/study-groups");
      }
    }
  }, [group, user, navigate]);

  // Join / Leave handlers
  const handleLeave = async () => {
    try {
      await api.put(`/study-groups/${id}/leave`);
      toast.success("You left the group");
      navigate("/study-groups");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to leave group");
    }
  };

  const handleJoin = async () => {
    try {
      await api.put(`/study-groups/${id}/join`);
      toast.success("Joined the group");
      fetchGroup();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to join group");
    }
  };

  // Loading states
  if (authLoading || loading) {
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

  if (!group) return <Typography>Group not found</Typography>;

  // Safe member check
  const isMember = group.members?.some((m) => m._id === user._id);

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
        <StudySessionList groupId={group._id} />
      </Box>
    </Box>
  );
};

export default StudyGroupDetails;
