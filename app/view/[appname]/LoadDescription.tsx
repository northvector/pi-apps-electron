"use client";

import LinkifyText from "@/app/utilities/LinkifyText";
import React, { useEffect, useState } from "react";

interface LoadDescriptionProps {
  appname: string;
}

const LoadDescription: React.FC<LoadDescriptionProps> = ({ appname }) => {
  const [content, setContent] = useState<string | null>(null);
  useEffect(() => {
    window.electronAPI.readFile(`apps/${appname}/description`).then(setContent).catch(console.error);
  }, [appname]);

  return content ? (
    <p>
      <LinkifyText text={content} />
    </p>
  ) : (
    "Loading Please wait"
  );
};

export default LoadDescription;
