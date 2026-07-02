import React from "react";
import { Note } from "../types/Note";

export interface NoteItemProps {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
}

function NoteItem({ note, onDelete, onEdit }: NoteItemProps) {
  return (
    <tr>
      <td>{note.title}</td>
      <td>{note.content}</td>
      <td>
        <button className="outlined" onClick={() => onEdit(note)}>
          Edit
        </button>
      </td>
      <td>
        <button className="danger" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default NoteItem;

