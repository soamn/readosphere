"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";

export default function Editor({
  onChange,
  initialHTML,
}: {
  onChange: (val: string) => void;
  initialHTML?: string;
}) {
  const editor = useCreateBlockNote();
  const [hasInitialized, setHasInitialized] = useState(false);

  const darkTheme = {
    colors: {
      editor: {
        text: "black",
        background: "white",
      },
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

  const getImageNameFromURL = (src: string) => {
    try {
      const url = new URL(src);
      const filename = url.pathname.split("/").pop();
      const nameWithoutExt = filename?.split(".")[0]?.replace(/[-_]/g, " ");
      const cleanName =
        (nameWithoutExt ?? "").charAt(0).toUpperCase() +
        (nameWithoutExt ?? "").slice(1);
      return cleanName || "Image";
    } catch {
      return "Image";
    }
  };

  const updateHTML = async () => {
    const rawHTML = await editor.blocksToHTMLLossy(editor.document);

    const htmlWithAlt = rawHTML.replace(
      /<img([^>]*?)src="(.*?)"([^>]*?)>/g,
      (_match, p1, src, p2) => {
        const altTitle = getImageNameFromURL(src);
        return `<img${p1}src="${src}" alt="${altTitle}" title="${altTitle}"${p2} width="auto" height="auto">`;
      }
    );

    onChange(htmlWithAlt.replace(/<p>\s*<\/p>/g, "<br>"));
  };

  useEffect(() => {
    const loadInitialHTML = async () => {
      if (!hasInitialized && initialHTML) {
        const parsedBlocks = await editor.tryParseHTMLToBlocks(initialHTML);
        const allBlockIds = editor.document.map((block) => block.id);
        editor.replaceBlocks(allBlockIds, parsedBlocks);
        setHasInitialized(true);
      }
    };

    loadInitialHTML();
  }, [initialHTML, editor, hasInitialized]);

  return (
    <BlockNoteView
      editor={editor}
      onChange={updateHTML}
      theme={darkTheme}
      className="py-7"
    />
  );
}
