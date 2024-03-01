import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

// Importa el icono adecuado
import CodeIcon from "@mui/icons-material/Code";

// Importa funciones de Firestore según tu configuración
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import db from "../../firebase";
import { Link } from "react-router-dom";

function Codes() {
  // Estado para almacenar los códigos y otros estados necesarios
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [open, setOpen] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [newCodeTitle, setNewCodeTitle] = useState("");
  const [newCodeContent, setNewCodeContent] = useState("");
  const [openNewCodeModal, setOpenNewCodeModal] = useState(false);

  // Función para obtener los códigos de Firestore
  const fetchCodes = async () => {
    try {
      const codesCollection = await getDocs(collection(db, "codes"));
      const codesData = codesCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCodes(codesData);
    } catch (error) {
      console.error("Error al obtener los códigos:", error);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  // Funciones para abrir y cerrar el diálogo de edición
  const handleOpenDialog = (code) => {
    setSelectedCode(code);
    setEditedCode(code.content);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Función para guardar los cambios realizados en un código
  const handleSaveChanges = async () => {
    try {
      const codeDocRef = doc(db, "codes", selectedCode.id);
      await updateDoc(codeDocRef, { content: editedCode });
      fetchCodes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Funciones para abrir y cerrar el modal para crear un nuevo código
  const createCode = async () => {
    setOpenNewCodeModal(true);
  };

  const handleCloseNewCodeModal = () => {
    setOpenNewCodeModal(false);
  };

  // Función para guardar un nuevo código en Firestore
  const handleSaveNewCode = async () => {
    try {
      const newCode = {
        title: newCodeTitle,
        content: newCodeContent,
      };

      const docRef = await addDoc(collection(db, "codes"), newCode);
      console.log("Documento creado con ID: ", docRef.id);
      setNewCodeTitle("");
      setNewCodeContent("");
      setOpenNewCodeModal(false);
      fetchCodes();
    } catch (error) {
      console.error("Error al crear el código:", error);
    }
  };

  // Función para eliminar un código de Firestore
  const handleDelete = async () => {
    try {
      if (selectedCode) {
        const codeDocRef = doc(db, "codes", selectedCode.id);
        await deleteDoc(codeDocRef);
        fetchCodes();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error al eliminar el código:", error);
    }
  };

  return (
    <>
      <Button component={Link} to="/" variant="contained" color="primary">
        Ir a Home
      </Button>
      <Button
        onClick={createCode}
        variant="contained"
        color="primary"
        sx={{
          margin: "10px",
        }}
      >
        Crear nuevo código
      </Button>
      <Grid
        gap={7}
        container
        justifyContent="start"
        alignItems="start"
        height="100vh"
        padding="50px"
      >
        {codes.map((code, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={code.id}>
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
              onClick={() => handleOpenDialog(code)}
            >
              <CardContent>
                <CodeIcon
                  sx={{
                    color: "#fff",
                    margin: "auto",
                    display: "block",
                    width: "65px",
                    height: "65px",
                    marginBottom: "8px",
                  }}
                />
                <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
                  {code.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="lg">
          <DialogTitle>
            <Typography variant="h6" component="div">
              {selectedCode && selectedCode.title}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              multiline
              fullWidth
              rows={20}
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              placeholder="Ingrese el código aquí"
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
          open={openNewCodeModal}
          onClose={handleCloseNewCodeModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Nuevo Código</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Título"
              fullWidth
              value={newCodeTitle}
              onChange={(e) => setNewCodeTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="content"
              label="Contenido"
              fullWidth
              multiline
              rows={4}
              value={newCodeContent}
              onChange={(e) => setNewCodeContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewCodeModal} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSaveNewCode} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

export default Codes;
