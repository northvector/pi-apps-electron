"use client";
import React from "react";
import DOMPurify from "dompurify";

const HtmlRenderer = ({ htmlContent }) => {
  const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);

  const transformHtml = (html) => {
    return html
      .replace(/<img /g, '<img loading="lazy" class="rounded-lg my-2" ')
      .replace(/<a /g, '<a target="_blank" class="text-sky-500 inline-flex justify-center pt-1 items-center gap-1 font-bold" rel="noopener noreferrer" ')
      .replace(/<a([^>]*)>(.*?)<\/a>/g, (match, attributes, text) => {
        return `<a${attributes}>${text} <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path><path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path></svg></a>`;
      })
      .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-2xl font-bold my-3 pb-3">$1</h2>')
      .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl font-bold my-3 pb-3">$1</h3>')
      .replace(/<p>/g, '<p class="light">')
      .replace(/<blockquote>/g, '<blockquote class="border-r-4 bg-sky-500/30 border-sky-500 dark:text-white rounded px-2 my-2 w-fit">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside">')
      .replace(/<code>/g, '<code class="bg-neutral-200 dark:bg-neutral-700 p-1 rounded break-all">')
      .replace(/<hr>/g, '<hr class="opacity-20" />');
  };

  return <div dangerouslySetInnerHTML={{ __html: transformHtml(sanitizedHtmlContent) }} />;
};

export default HtmlRenderer;
