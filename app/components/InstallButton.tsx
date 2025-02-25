"use client";
import React, { useEffect, useState } from "react";
import AnsiToHtml from "ansi-to-html";

interface InstallButtonProps {
  appname: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ appname }) => {
  const [content, setContent] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const outputRef = React.useRef<HTMLDivElement>(null);  
  useEffect(() => {
    const handleOutput = (data: string) => {
      setOutput((prev) => prev + data + "\n");
      // add auto scroll TO outputRef and make it smooth 
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    };

    const handleError = (data: string) => {
      setOutput((prev) => prev + data + "\n");
    };

    const handleDone = (message: string) => {
      setOutput((prev) => prev + "\n" + message);
      if (message === "Process exited with code 0") {
        setContent("changed");
        setTimeout(() => {
            setIsModalOpen(false);
            setOutput("");
        }, 5000);
        
      }
    };

    window.electronAPI.onManageScriptOutput(handleOutput);
    window.electronAPI.onManageScriptError(handleError);
    window.electronAPI.onManageScriptDone(handleDone);
    return () => {};
  }, []);

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

  const handleInstall = () => {
    setIsModalOpen(true);
    window.electronAPI.runManageScript("install", appname);
  };

  const handleUninstall = () => {
    setIsModalOpen(true);
    window.electronAPI.runManageScript("uninstall", appname);
  };

  const ansiConverter = new AnsiToHtml();

  return (
    <>
      <div onClick={content?.trim() === "installed" ? handleUninstall : handleInstall} className="p-3 bg-zinc-800 border-2 border-zinc-950 w-full md:w-2/3 rounded-md h-fit sticky top-1 self-start cursor-pointer">
        <div className={`rounded-2xl p-3 text-center text-white ${content?.trim() === "installed" ? "bg-red-500" : "bg-green-600"}`}>{content?.trim() === "installed" ? "Uninstall" : `Install ${appname}`}</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-neutral-900 border border-gray-700 rounded-lg max-w-3xl flex flex-col justify-center w-full p-1">
            <div ref={outputRef} className="h-64 rounded-lg bg-black text-green-400 p-2 font-mono overflow-auto border border-gray-700">
              <pre dangerouslySetInnerHTML={{ __html: ansiConverter.toHtml(output) }} />
            </div>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 p-3 mx-auto bg-red-600 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;
