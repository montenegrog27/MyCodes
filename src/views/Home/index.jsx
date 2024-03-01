import React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

function Home() {
  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h2" gutterBottom>
          Selecciona una Sección
        </Typography>
        <nav>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/codigos"
            sx={{ mr: 2 }}
          >
            Códigos
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/notas"
            sx={{ mr: 2 }}
          >
            Notas
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/querys"
          >
            Querys
          </Button>
        </nav>
      </Box>
    </Container>
  );
}

export default Home;
