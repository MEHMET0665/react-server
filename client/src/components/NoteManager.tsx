import React, { useMemo, useState } from "react";
import NoteForm from "./NoteForm";
import NoteTable from "./NoteTable";
import { Note } from "../types/Note";

function NoteManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);

  const nextId = useMemo(() => {
    const max = notes.reduce((acc, n) => Math.max(acc, n.id), 0);
    return max + 1;
  }, [notes]);

  const handleSubmit = (note: Note) => {
    if (noteToEdit) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteToEdit.id ? { ...n, title: note.title, content: note.content } : n
        )
      );
      setNoteToEdit(undefined);
      return;
    }

    setNotes((prev) => [...prev, { ...note, id: nextId }]);
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setNoteToEdit((prev) => (prev?.id === id ? undefined : prev));
  };

  const handleEdit = (note: Note) => {
    setNoteToEdit(note);
  };

  return (
    <div
      className="layout-column align-items-center justify-content-start"
      data-testid="note-manager"
    >
      <NoteForm onSubmit={handleSubmit} noteToEdit={noteToEdit} />
      <NoteTable notes={notes} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default NoteManager;

