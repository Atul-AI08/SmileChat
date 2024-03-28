import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background-light dark:bg-panel-header-background-dark flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center">
      <Image src="/icon.png" height={300} width={300} />
    </div>
  );
}

export default Empty;
