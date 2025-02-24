"use client"; // Required for Next.js App Router

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style"; // Add this
import Color from "@tiptap/extension-color"; // Add this
import { Bold as BoldIcon, Heading1, List } from "lucide-react"; // Premium-looking icons

export default function TipTapEditor({ setContent, resetContentFlag }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Heading,
      BulletList,
      OrderedList,
      TextStyle,
      Color,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // Calls setContent with updated content
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus(); // Auto-focus the editor
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(""); // Clear content
      editor.commands.focus(); // Keep cursor active after reset
    }
  }, [resetContentFlag]);

  if (!mounted || !editor) return null; // Prevent hydration issues

  return (
    <div style={styles.editorContainer}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} style={styles.editorContent} />
    </div>
  );
}

const styles = {
  editorContainer: {
    padding: "10px",
    border: "1px solid #E0E0E0",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  editorContent: {
    padding: "0px 10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },
};

function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div style={styles2.toolbar}>
      {/* Bold Button */}
      <ToolButton
        icon={<BoldIcon size={18} />}
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      {/* Heading 1 Button */}
      <ToolButton
        icon={<Heading1 size={18} />}
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />

      {/* Bullet List Button */}
      <ToolButton
        icon={<List size={18} />}
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      {/* Color Picker */}
      <input
        type="color"
        onChange={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        style={{
          height: "45px",
          width: "45px",
          marginLeft: "8px",
          borderRadius: "7px",
          cursor: "pointer",
          border: "none",
          background: "transparent",
        }}
      />
    </div>
  );
}

// ✅ Premium-looking button component
function ToolButton({ icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles2.button,
        backgroundColor: isActive ? "#4A90E2" : "#F5F5F5",
        color: isActive ? "#fff" : "#333",
      }}
    >
      {icon}
    </button>
  );
}

const styles2 = {
  toolbar: {
    display: "flex",
    gap: "12px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    marginBottom: "12px",
    position: "sticky",
    top: "0",
    zIndex: "10",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};
