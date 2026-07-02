import React from "react";
import { Note } from "../types/Note";
import NoteItem from "./NoteItem";

export interface NoteTableProps {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
}

function NoteTable({ notes, onDelete, onEdit }: NoteTableProps) {
  return (
    <div className="card w-30 pt-30 pb-8 mt-2">
      <table>
        <thead>
          <tr>
            <th colSpan={4}>Notes</th>
          </tr>
        </thead>
        <tbody data-testid="notes-list">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoteTable;

