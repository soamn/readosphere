import Editor from "@/app/components/editor";
import React from "react";

const page = () => {
  const html = `
  <h1 dir="ltr"><span style="
  white-space: pre-wrap;">Supported Markdown</span></h1><h2><br></h2><p dir="ltr"><span
  style="white-space: pre-wrap;">#</span><b><strong class="font-bold" style="white-space:
  pre-wrap;"> For H1</strong></b></p><p dir="ltr"><b><strong class="font-bold"
  style="white-space: pre-wrap;">## For h2</strong></b></p><p dir="ltr"><b><strong
   class="font-bold" style="white-space: pre-wrap;">### For h3</strong></b></p><p><b><strong
   class="font-bold" style="white-space: pre-wrap;">.</strong></b></p><p><b><strong
   class="font-bold" style="white-space: pre-wrap;">.</strong></b></p><p><b><strong
    class="font-bold" style="white-space: pre-wrap;">.</strong></b></p><p dir="ltr"><b><strong
   class="font-bold" style="white-space: pre-wrap;">###### For h6</strong></b></p><p><br></p>
   <p dir="ltr"><b><strong class="font-bold"
   style="white-space: pre-wrap;">_(something)_ generates italic text</strong></b></p><p dir="ltr"><br></p><p dir="ltr"><b><strong class="font-bold" style="white-space: pre-wrap;">&gt; BlockQuote </strong></b></p>
  <br/>
   <p>Start Typing Your Content ....</p>

  `;
  return (
    <div className="relative overflow-clip m-auto max-w-5xl">
      <Editor html={html} isUpdate={false} />
    </div>
  );
};

export default page;
