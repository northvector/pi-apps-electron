"use client";
import { useEffect, useState } from "react";
import { BiCheck, BiUserCheck } from "react-icons/bi";

export default function SystemAndUserInfo({ appname }: { appname: string }) {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [systemInformation, setSystemInformation] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user count
    window.electronAPI.runApiScript("usercount", appname);
    const handleUserCountOutput = (data: unknown) => {
      setUserCount(Number(data));
    };
    window.electronAPI.onApiScriptOutput("usercount", handleUserCountOutput);

    // Fetch system information
    window.electronAPI.runApiScript("get_device_info", "");
    const handleSystemInfoOutput = (data: unknown) => {
      if (typeof data === "string" && data.startsWith("Device model: ")) {
        setSystemInformation(data);
      }
    };
    window.electronAPI.onApiScriptOutput("get_device_info", handleSystemInfoOutput);

    // Cleanup listeners on unmount
    return () => {
      window.electronAPI.removeApiScriptOutputListener("usercount", handleUserCountOutput);
      window.electronAPI.removeApiScriptOutputListener("get_device_info", handleSystemInfoOutput);
    };
  }, [appname]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BiUserCheck className="min-w-4"/>
        <p>Used by <span className="text-[#bb4164]">{userCount !== null ? userCount.toLocaleString() : "0"}</span> users</p>
      </div>
      <div className="flex items-center gap-2">
        <BiCheck className="min-w-4" />
        <p className="break-words text-xs">{systemInformation ? `Works on your ${systemInformation.replace("Device model:", "")}` : "Loading System Information ..."}</p>
      </div>
    </div>
  );
}
