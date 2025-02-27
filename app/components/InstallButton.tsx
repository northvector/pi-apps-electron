"use client";
import React, { useEffect, useState } from "react";
// import AnsiToHtml from "ansi-to-html";
import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import TerminalComponent from "./Terminal";

interface InstallButtonProps {
  appname: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ appname }) => {
  const [content, setContent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  // const ansiConverter = new AnsiToHtml();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readFile(`data/status/${appname}`);
        setContent(data);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };
    fetchData();
  }, [appname, isModalOpen]);



  const handleAction = (action: "install" | "uninstall") => {
    if (isRunning) {
      setIsModalOpen(true);
      return;
    }
    setIsModalOpen(true);
    setIsRunning(true);
    toast.success(`${action === "install" ? "Installing" : "Uninstalling"} ${appname}`);
    window.electronAPI.runManageScript(action, appname);


    const handleDone = (message: string) => {
      setIsRunning(false);
      if (message.includes("Process exited with code")) {
        const isSuccess = message.endsWith("0") || message.endsWith("null");
        if (isSuccess) {
          setContent("changed");
          setTimeout(() => {
            setIsModalOpen(false);
            toast.success(`${action === "install" ? appname + " successfully installed" : appname + " successfully uninstalled"}`);
          }, 5000);
        } else {
          toast.error("An error occurred while processing the app. Please check the logs for details");
        }
      }
    };

    // Attach listeners dynamically
    window.electronAPI.onManageScriptDone(action, handleDone);

    // Cleanup listeners when modal closes
    return () => {
      window.electronAPI.removeManageScriptDoneListener(action, handleDone);
    };
  };

  const handleCancel = () => {
    window.electronAPI.cancelManageScript(isInstalled ? "uninstall" : "install");
    // setIsModalOpen(false);
    // setIsRunning(false);
  };

  const isInstalled = content?.trim() === "installed";
  const buttonLabel = isInstalled ? "Uninstall" : `Install ${appname}`;
  const buttonColor = isInstalled ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700";

  return (
    <>
      <div onClick={() => handleAction(isInstalled ? "uninstall" : "install")} className={`rounded-lg p-3 text-center text-white ${buttonColor}`}>
        {buttonLabel}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-neutral-900 border border-gray-700 rounded-lg max-w-3xl flex flex-col justify-center w-full p-1">
            <TerminalComponent action={isInstalled ? "uninstall" : "install"} />
            <div className="flex gap-3 *:grow">
              <button onClick={() => setIsModalOpen(false)} className="mt-4 p-3 mx-auto bg-neutral-600 text-white rounded-lg">
                Hide terminal
              </button>
              <button onClick={handleCancel} className="mt-4 flex gap-2 items-center justify-center p-3 bg-red-600 text-white rounded-lg">
                <MdCancel />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;
