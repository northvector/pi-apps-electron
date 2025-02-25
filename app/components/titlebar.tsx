"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { CiMaximize2 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5";
import { MdOutlineMinimize } from "react-icons/md";

export const CustomTitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };
  const handleMaximize = () => {
    window.electronAPI.maximizeWindow();
  };

  const handleClose = async () => {
    window.electronAPI.closeWindow();
  };
  const router = useRouter();
  function navigateBack() {
    router.back();
  }
  function navigateForward() {
    router.forward();
  }

  return (
    <>
      {/* add flex-row-reverse to move titlebar icons to left ↙️*/}
      <div className="flex justify-between items-center p-1 fixed inset-x-0 top-0 bg-neutral-800 z-[9999]" style={{ WebkitAppRegion: "drag" }}>
        <div className="title-font flex items-center gap-1" style={{ WebkitAppRegion: "no-drag" }}>
          <button className="p-2 bg-neutral-700 rounded-2xl" onClick={navigateBack}><IoCaretBackOutline />          </button>
          <button className="p-2 bg-neutral-700 rounded-2xl" onClick={navigateForward}><IoCaretForwardOutline />          </button>
        </div>
        <Link style={{ WebkitAppRegion: "no-drag" }} href="/" className="title-font flex justify-center items-center gap-2 px-2">
          <img src='https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/icons/logo-128.png' className="size-6" />
          Pi-Apps
        </Link>
        {/* add flex-row-reverse to move titlebar icons to left ↙️*/}
        <div className="flex  gap-3 items-center" style={{ WebkitAppRegion: "no-drag" }}>
          <button className="hover:bg-neutral-600 p-2 size-8 flex items-center justify-center rounded-sm" onClick={handleMinimize}>
            <MdOutlineMinimize />
          </button>
          <button className="hover:bg-neutral-600 p-2 size-8 flex items-center justify-center rounded-sm" onClick={handleMaximize}>
            <CiMaximize2 />
          </button>
          <button className="hover:bg-neutral-600 p-2 size-8 flex items-center justify-center rounded-sm hover:text-red-600 transition" onClick={handleClose}>
            <IoMdClose />
          </button>
        </div>
      </div>
    </>
  );
};
