"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { BsSearch } from "react-icons/bs";
import { CiMaximize2 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5";
import { MdOutlineMinimize } from "react-icons/md";

export const CustomTitleBar: React.FC = () => {
  const { back, push, forward } = useRouter();
  const minimizeWindow = () => window.electronAPI.minimizeWindow();
  const maximizeWindow = () => window.electronAPI.maximizeWindow();
  const closeWindow = () => window.electronAPI.closeWindow();

  return (
    <div className="flex justify-between items-center p-1 fixed inset-x-0 top-0 bg-neutral-800 z-[9999] border-b border-neutral-950" style={{ WebkitAppRegion: "drag" }}>
      <div className="title-font flex items-center gap-1" style={{ WebkitAppRegion: "no-drag" }}>
        <Link href="/" className="title-font flex justify-center items-center gap-2 px-2 text-neutral-500 hover:text-white font-black border-r-2 border-neutral-600">
          <img src="https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/icons/logo-128.png" className="size-6" alt="Pi-Apps Logo" />
          <span className="hidden md:block">Pi-Apps</span>
        </Link>
        <button className="ml-2 p-2 bg-neutral-700 hover:bg-neutral-950 rounded-lg rounded-r-sm" onClick={() => push("/all")}>
          <BsSearch />
        </button>
        <button className="p-2 bg-neutral-700 hover:bg-neutral-950 rounded-sm" onClick={back}>
          <IoCaretBackOutline />
        </button>
        <button className="p-2 bg-neutral-700 hover:bg-neutral-950 rounded-lg rounded-l-sm" onClick={forward}>
          <IoCaretForwardOutline />
        </button>
      </div>

      <div className="flex gap-3 items-center" style={{ WebkitAppRegion: "no-drag" }}>
        <button className="hover:bg-neutral-600 p-2 size-8 flex items-center justify-center rounded-sm" onClick={minimizeWindow}>
          <MdOutlineMinimize />
        </button>
        <button className="hover:bg-neutral-600 p-2 size-8 flex items-center justify-center rounded-sm" onClick={maximizeWindow}>
          <CiMaximize2 />
        </button>
        <button className="hover:bg-neutral-600 p-2 size-8 flex items-center justify-center rounded-sm hover:text-red-600 transition" onClick={closeWindow}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};
