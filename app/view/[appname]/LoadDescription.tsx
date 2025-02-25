"use client";

import LinkifyText from "@/app/utilities/LinkifyText";
import React, { useEffect, useState } from "react";

interface LoadDescriptionProps {
  appname: string;
}

const LoadDescription: React.FC<LoadDescriptionProps> = ({ appname }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readFile(`apps/${appname}/description`);
        setContent(data);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    fetchData();
  }, [appname]);

  if (!content) return null;

  return (
    <p>
      <LinkifyText text={content} />
    </p>
  );
};

export default LoadDescription;
