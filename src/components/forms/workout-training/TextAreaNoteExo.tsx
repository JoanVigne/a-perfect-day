import React, { useEffect } from "react";
import "./textAreaNoteExo.css";
import { handleFocus } from "./handleFocus";

interface Exercise {
  id: string;
  name: string;
}

interface TextAreaNoteExoProps {
  exercise: Exercise;
  noteExo: { [key: string]: string };
  lastPerf:
    | { [key: string]: { noteExo?: { [key: string]: string } } }
    | undefined;
  handleNoteChange: (
    id: string
  ) => (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaNoteExo: React.FC<TextAreaNoteExoProps> = ({
  exercise,
  noteExo,
  lastPerf,
  handleNoteChange,
}) => {
  const handleTextareaResize = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    textarea.style.height = "22px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textareas = document.querySelectorAll(".note-exo");
    textareas.forEach((textarea) => {
      const element = textarea as HTMLTextAreaElement;
      element.style.height = "22px";
      element.style.height = `${element.scrollHeight}px`;
    });
  }, []);

  return (
    <textarea
      className={`note-exo ${noteExo[exercise.id] ? "active" : ""}`}
      name="noteExo"
      placeholder={`Note about ${exercise.name}?`}
      value={
        lastPerf?.[exercise.id]?.noteExo?.[`exoPerso${exercise.name}`] ??
        noteExo[exercise.id] ??
        ""
      }
      onChange={handleNoteChange(exercise.id)}
      onInput={handleTextareaResize}
      onFocus={handleFocus}
    ></textarea>
  );
};

export default TextAreaNoteExo;
