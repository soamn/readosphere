"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, darkDefaultTheme, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";

export default function Editor({
  onChange,
}: {
  onChange: (val: string) => void;
}) {
  const [html, setHTML] = useState<string>("");
  const darkTheme = {
    colors: {
      editor: {
        text: "white",
        background: "black",
      },
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: [
          "Start writing your blog here... ✍️",
          {
            type: "text",
            text: "Bold text example.",
            styles: {
              bold: true,
            },
          },
        ],
      },
    ],
  });

  const updateHTML = async () => {
    let html = await editor.blocksToHTMLLossy(editor.document);

    html = html.replace(/\n/g, "<br>");

    setHTML(html);
    onChange(html);
  };

  useEffect(() => {
    updateHTML();
  }, []);

  return (
    <BlockNoteView
      editor={editor}
      onChange={updateHTML}
      theme={darkTheme}
      className="py-7"
    />
  );
}
