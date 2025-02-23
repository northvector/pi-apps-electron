/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAppCredits, getAppDescription, getAppLogoUrl } from "@/app/api/getAppdetails";
import LinkifyText from "@/app/utilities/LinkifyText";

// GET appname from URL
export default async function Home({ params }: { params: { appname: string } }) {
  try {
    const { appname } = params;
    if (!appname) throw new Error("App name is missing from URL parameters.");

    const description = await getAppDescription(appname);
    const logo = await getAppLogoUrl(appname);
    const credits = await getAppCredits(appname);

    if (!description || !logo || !credits) throw new Error("Failed to fetch app details.");

    return (
      <div className="font-[family-name:var(--font-geist-sans)] mt-10 p-3 flex flex-col gap-3">
        <div className="bg-neutral-800 p-5 rounded-md">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <img src={logo} className="size-12" alt={`${appname} logo`} />
            <h1 className="font-bold text-2xl">{decodeURIComponent(appname)}</h1>
          </div>
          <div className="text-xs text-center my-1">{credits}</div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <div className="bg-neutral-800 p-3 rounded-md text-left leading-7 whitespace-pre-wrap w-full">{<LinkifyText text={description} />}</div>
          <div className="p-3 bg-zinc-800 w-full md:w-2/3 rounded-md h-fit">
            <div className="bg-[#c7053d] rounded-2xl p-3 text-center text-white">Install</div>
          </div>
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
