/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { MenuBar } from '../menu-bar';

interface CustomRichTextEditorProps {
  field: any;
}

const CustomRichTextEditor = ({
  field,
}: CustomRichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
    ],
    editorProps: {
      attributes: {
        class:
          'prose focus:outline-none min-h-[300px] p-4 max-w-none dark:prose-invert',
        style:
          'ol, ul { margin-top: 0 !important; margin-bottom: 0 !important; } li { margin-bottom: 0px !important; }',
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(
        JSON.stringify(editor.getJSON())
      );
    },
    content: field.value
      ? JSON.parse(field.value)
      : '',
    immediatelyRender: false,
  });

  // Update editor content when form value changes externally
  useEffect(() => {
    if (
      editor &&
      field.value &&
      editor.getHTML() !== field.value
    ) {
      editor.commands.setContent(
        JSON.parse(field.value)
      );
    }
  }, [editor, field.value]);

  return (
    <div className='w-full'>
      <div className='border rounded-lg overflow-hidden bg-card'>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default CustomRichTextEditor;
