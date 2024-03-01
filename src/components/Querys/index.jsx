import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DataObjectIcon from "@mui/icons-material/DataObject";
import TextField from "@mui/material/TextField";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc, // Importamos la función deleteDoc
} from "firebase/firestore";

import db from "../../firebase";

function Querys() {
  const [querys, setQuerys] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [open, setOpen] = useState(false);
  const [editedQuery, setEditedQuery] = useState("");
  const [newQueryTitle, setNewQueryTitle] = useState("");
  const [newQueryCode, setNewQueryCode] = useState("");
  const [openNewQueryModal, setOpenNewQueryModal] = useState(false);

  const fetchQuerys = async () => {
    try {
      const querysCollection = await getDocs(collection(db, "querys"));
      const querysData = querysCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuerys(querysData);
    } catch (error) {
      console.error("Error al obtener las querys:", error);
    }
  };

  useEffect(() => {
    fetchQuerys();
  }, []);

  const handleOpenDialog = (query) => {
    setSelectedQuery(query);
    setEditedQuery(query.query);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      const queryDocRef = doc(db, "querys", selectedQuery.id);
      await updateDoc(queryDocRef, { query: editedQuery });
      fetchQuerys();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const createObject = async () => {
    setOpenNewQueryModal(true);
  };

  const handleCloseNewQueryModal = () => {
    setOpenNewQueryModal(false);
  };

  const handleSaveNewQuery = async () => {
    try {
      const newQuery = {
        title: newQueryTitle,
        query: newQueryCode,
      };

      const docRef = await addDoc(collection(db, "querys"), newQuery);
      console.log("Documento creado con ID: ", docRef.id);
      setNewQueryTitle("");
      setNewQueryCode("");
      setOpenNewQueryModal(false);
      fetchQuerys();
    } catch (error) {
      console.error("Error al crear la consulta:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedQuery) {
        const queryDocRef = doc(db, "querys", selectedQuery.id);
        await deleteDoc(queryDocRef);
        fetchQuerys();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error al eliminar la consulta:", error);
    }
  };

  return (
    <>
      <Button onClick={createObject} variant="contained" color="primary">
        Crear nueva Query
      </Button>
      <Grid
        gap={7}
        container
        justifyContent="start"
        alignItems="start"
        height="100vh"
        padding="50px"
      >
        {querys.map((query, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={query.id}>
            <Card
              sx={{
                cursor: "pointer",
                backgroundColor: "transparent",
                borderRadius: "8px",
                padding: "5px",
                transition: "all 0.3s ease",
                width: "250px",
                height: "100%",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => handleOpenDialog(query)}
            >
              <CardContent>
                <DataObjectIcon
                  sx={{
                    color: "#fff",
                    margin: "auto",
                    display: "block",
                    width: "65px",
                    height: "65px",
                    marginBottom: "8px",
                  }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "0.9rem",
                    lineHeight: "1.2",
                    width: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    paddingTop: "20px",
                  }}
                >
                  {query.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="lg">
          <DialogTitle>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {selectedQuery && selectedQuery.title}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              multiline
              fullWidth
              rows={20}
              value={editedQuery}
              onChange={(e) => setEditedQuery(e.target.value)}
              placeholder="Ingrese la query aquí"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} variant="contained" color="error">
              Eliminar
            </Button>
            <Button onClick={handleCloseDialog} variant="contained">
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openNewQueryModal}
          onClose={handleCloseNewQueryModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Nueva Query</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Título"
              fullWidth
              value={newQueryTitle}
              onChange={(e) => setNewQueryTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="code"
              label="Código"
              fullWidth
              multiline
              rows={4}
              value={newQueryCode}
              onChange={(e) => setNewQueryCode(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewQueryModal} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSaveNewQuery} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

export default Querys;
