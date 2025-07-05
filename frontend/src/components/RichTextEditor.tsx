import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Add a comment...",
  className = ""
}) => {
  const [isActive, setIsActive] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    updateActiveStates();
    handleContentChange();
  };

  const updateActiveStates = () => {
    setIsActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
      }
    }
  };

  const handleSelectionChange = () => {
    updateActiveStates();
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={`p-2 rounded-md transition-all duration-200 hover:bg-gray-200 ${
            isActive.bold ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={`p-2 rounded-md transition-all duration-200 hover:bg-gray-200 ${
            isActive.italic ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className={`p-2 rounded-md transition-all duration-200 hover:bg-gray-200 ${
            isActive.underline ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Type className="h-3 w-3" />
          <span>Rich text</span>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        className="p-3 min-h-[60px] max-h-32 overflow-y-auto focus:outline-none text-gray-900"
        style={{ wordBreak: 'break-word' }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};