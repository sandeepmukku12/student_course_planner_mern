import { Card, CardContent, Typography } from "@mui/material";

const CourseCard = ({ course }) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {course.name}
        </Typography>

        <Typography variant="caption" color="primary" fontWeight="bold">
          {course.code}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          {course.description || "No description available"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
