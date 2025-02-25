import React, { JSX } from "react";

/**
 * Takes a string and turns any URLs into clickable links.
 * @param {{text: string}} props
 * @returns {JSX.Element}
 */
const LinkifyText = ({ text }: { text: string }): JSX.Element => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  if (!text) return <></>;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          const href = part.startsWith("http") ? part : `https://${part}`;
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
};

export default LinkifyText;
