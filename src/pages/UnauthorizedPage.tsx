import React from "react";
import { Typography, Container } from "@mui/material";

const UnauthorizedPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" mt={5} color="error">Unauthorized Access</Typography>
    </Container>
  );
};

export default UnauthorizedPage;
