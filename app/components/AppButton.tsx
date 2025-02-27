/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";

interface AppButtonProps {
  appname: string;
  category?: string;
}

const AppButton: React.FC<AppButtonProps> = React.memo(function AppButton({ appname, category }) {
  const [content, setContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.electronAPI
      .readFile(`data/status/${appname}`)
      .then((data: React.SetStateAction<string | null>) => setContent(data))
      .catch(console.error);
  }, [appname]);

  return (
    <Link href={`/view/${appname}`} className="p-1 !rounded-lg bg-zinc-800 hover:bg-zinc-950 transition-all flex items-center gap-1">
      <img src={`local:///apps/${appname}/icon-64.png`} className="min-w-12 size-12 mx-auto rounded-lg bg-neutral-700" />
      <div className="flex flex-col gap-1 p-1 w-full text-left">
        <div className="font-bold">{appname}</div>
        {category && (
          <div className="text-sm opacity-50">
            <img src={`local:///icons/categories/${category.split("/")[1] || category}-64.png`} alt={`${category} icon`} className="size-6 inline" />
            {category}
          </div>
        )}
      </div>
      {content?.trim() === "installed" && (
        <div className="text-sm text-green-500 opacity-50">
          <BiCheckCircle size={33} />
        </div>
      )}
    </Link>
  );
});

export default AppButton;
