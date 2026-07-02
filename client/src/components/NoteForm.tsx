import React, { useEffect, useMemo, useState } from "react";
import { Note } from "../types/Note";

export interface NoteFormProps {
  onSubmit: (note: Note) => void;
  noteToEdit?: Note;
}

function NoteForm({ onSubmit, noteToEdit }: NoteFormProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [noteToEdit]);

  const isValid = useMemo(() => {
    return title.trim().length > 0 && content.trim().length > 0;
  }, [title, content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      id: noteToEdit?.id ?? -1,
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="card w-200 pt-30 pb-8 mt-15 mb-15">
      <form onSubmit={handleSubmit} data-testid="note-form">
        <section className="layout-row align-items-center justify-content-center mt-20 mr-20 ml-20">
          <label className="form-title-label">Title:</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            data-testid="form-input"
            className="form-input"
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>
        <section className="layout-row align-items-center justify-content-center mt-20 mr-20 ml-20">
          <label className="form-content-label">Content:</label>
          <textarea
            placeholder="Content"
            value={content}
            data-testid="form-textarea"
            className="form-textarea"
            onChange={(e) => setContent(e.target.value)}
          />
        </section>
        <section className="layout-row align-items-center justify-content-center mt-20 mr-20 ml-20">
          <button
            data-testid="form-submit-button"
            type="submit"
            disabled={!isValid}
          >
            {noteToEdit ? "Update" : "Add"}
          </button>
        </section>
      </form>
    </div>
  );
}

export default NoteForm;

