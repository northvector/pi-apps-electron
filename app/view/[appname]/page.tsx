/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAppCredits, getAppLogoUrl } from "@/app/api/getAppdetails";
import LoadDescription from "./LoadDescription";
import InstallButton from "@/app/components/InstallButton";
import LoadInstallations from "./loadInstallations";

export default async function Home({ params }: { params: { appname: string } }) {
  const appname_decoded = decodeURIComponent(params.appname);
  try {
    const [logo, credits] = await Promise.all([getAppLogoUrl(appname_decoded), getAppCredits(appname_decoded)]);

    return (
      <div className="font-[family-name:var(--font-geist-sans)] p-3 flex flex-col gap-1 relative">
        <div className="bg-neutral-800 px-3 pt-0 rounded-md">
          <div className="flex flex-wrap items-center justify-center gap-1 py-2.5 bg-neutral-950 rounded-b-2xl">
            <img src={logo} className="size-12 rounded" alt={`${appname_decoded} logo`} />
            <h1 className="font-bold text-2xl">{appname_decoded}</h1>
          </div>
          <div className="text-xs text-center p-3 mt-3">{credits}</div>
        </div>
        <div className="flex flex-wrap-reverse md:flex-nowrap gap-1">
          <div className="bg-gradient-to-b from-neutral-800 to-neutral-950 p-3 rounded-md leading-7 min-h-[400px] whitespace-pre-wrap w-full">
            <LoadDescription appname={appname_decoded} />
          </div>
          <div className="p-2 bg-zinc-800 border-2 border-zinc-950 w-full md:w-2/3 rounded-md h-fit sticky top-1 self-start">
            <InstallButton appname={appname_decoded} />
            <div className="mb-2 mt-4 border-t-2 border-neutral-700"></div>
            <LoadInstallations appname={appname_decoded} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch app details:", error);
    return (
      <div className="font-[family-name:var(--font-geist-sans)] mt-10 p-3 text-center">
        <div className="bg-red-700 p-5 rounded-md text-white">Failed to fetch app details.</div>
      </div>
    );
  }
}
