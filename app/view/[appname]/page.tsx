/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAppCredits, getAppLogoUrl } from "@/app/api/getAppdetails";
import LoadDescription from "./LoadDescription";
import InstallButton from "@/app/components/InstallButton";

// GET appname from URL
export default async function Home({ params }: { params: { appname: string } }) {
  try {
    const { appname } = await params;
    if (!appname) throw new Error("App name is missing from URL parameters.");
    const appname_decoded = decodeURIComponent(appname);

    const logo = await getAppLogoUrl(appname_decoded);
    const credits = await getAppCredits(appname_decoded);
    if (!logo && !credits) throw new Error("Failed to fetch app details.");

    return (

      <div className="font-[family-name:var(--font-geist-sans)] p-3 flex flex-col gap-1  relative">
        {/* rortate image */}
        <div className="bg-neutral-800 px-3 pt-0 rounded-md">
          <div className="flex flex-wrap items-center justify-center gap-1 py-2.5 bg-neutral-950 rounded-b-2xl">
            <img src={logo} className="size-12 rounded" alt={`${appname_decoded} logo`} />
            <h1 className="font-bold text-2xl">{appname_decoded}</h1>
          </div>
          <div className="text-xs text-center p-3 mt-3">{credits}</div>
        </div>
        <div className="flex flex-wrap-reverse md:flex-nowrap gap-1">
          <div className="bg-gradient-to-b from-neutral-800 to-neutral-950 p-3 rounded-md text-left leading-7 min-h-[400px] whitespace-pre-wrap w-full">
            <LoadDescription appname={appname_decoded} />
          </div>
          <InstallButton appname={appname_decoded} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading app details:", error);
    return (
      <div className="font-[family-name:var(--font-geist-sans)] mt-10 p-3 text-center">
        <div className="bg-red-700 p-5 rounded-md text-white">{error instanceof Error ? error.message : "An unexpected error occurred."}</div>
      </div>
    );
  }
}
