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
import NotesIcon from "@mui/icons-material/Notes";

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

function Notes() {
  // Estado para almacenar las notas y otros estados necesarios
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [open, setOpen] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [openNewNoteModal, setOpenNewNoteModal] = useState(false);

  // Función para obtener las notas de Firestore
  const fetchNotes = async () => {
    try {
      const notesCollection = await getDocs(collection(db, "notes"));
      const notesData = notesCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    } catch (error) {
      console.error("Error al obtener las notas:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Funciones para abrir y cerrar el diálogo de edición
  const handleOpenDialog = (note) => {
    setSelectedNote(note);
    setEditedNote(note.content);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Función para guardar los cambios realizados en una nota
  const handleSaveChanges = async () => {
    try {
      const noteDocRef = doc(db, "notes", selectedNote.id);
      await updateDoc(noteDocRef, { content: editedNote });
      fetchNotes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Funciones para abrir y cerrar el modal para crear una nueva nota
  const createNote = async () => {
    setOpenNewNoteModal(true);
  };

  const handleCloseNewNoteModal = () => {
    setOpenNewNoteModal(false);
  };

  // Función para guardar una nueva nota en Firestore
  const handleSaveNewNote = async () => {
    try {
      const newNote = {
        title: newNoteTitle,
        content: newNoteContent,
      };

      const docRef = await addDoc(collection(db, "notes"), newNote);
      console.log("Documento creado con ID: ", docRef.id);
      setNewNoteTitle("");
      setNewNoteContent("");
      setOpenNewNoteModal(false);
      fetchNotes();
    } catch (error) {
      console.error("Error al crear la nota:", error);
    }
  };

  // Función para eliminar una nota de Firestore
  const handleDelete = async () => {
    try {
      if (selectedNote) {
        const noteDocRef = doc(db, "notes", selectedNote.id);
        await deleteDoc(noteDocRef);
        fetchNotes();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  };

  return (
    <>
      <Button component={Link} to="/" variant="contained" color="primary">
        Ir a Home
      </Button>
      <Button
        onClick={createNote}
        variant="contained"
        color="primary"
        sx={{ margin: "10px" }}
      >
        Crear nueva nota
      </Button>
      <Grid
        gap={7}
        container
        justifyContent="start"
        alignItems="start"
        height="100vh"
        padding="50px"
      >
        {notes.map((note, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
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
              onClick={() => handleOpenDialog(note)}
            >
              <CardContent>
                <NotesIcon
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
                  {note.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="lg">
          <DialogTitle>
            <Typography variant="h6" component="div">
              {selectedNote && selectedNote.title}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              multiline
              fullWidth
              rows={20}
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              placeholder="Ingrese la nota aquí"
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
          open={openNewNoteModal}
          onClose={handleCloseNewNoteModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Nueva Nota</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Título"
              fullWidth
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="content"
              label="Contenido"
              fullWidth
              multiline
              rows={4}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewNoteModal} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSaveNewNote} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

export default Notes;
