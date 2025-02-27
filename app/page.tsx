/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { fetchAppList } from "./api/getApplist";
import AppButton from "./components/AppButton";
import { getAnnouncements } from "./api/getAnnouncements";
import HtmlRenderer from "./utilities/displayHtml";
import CategoryButton from "./components/categories";
import Link from "next/link";

export default async function Home() {
  const announcements = await getAnnouncements();
  const applist = await fetchAppList();
  const categories = [...new Set(applist.split("\n").map((line) => line.split("|")[1]))];

  return (
    <div className="font-[family-name:var(--font-geist-sans)] p-3">
      <div className="p-1 rounded">
        <div className="p-1 rounded bg-gradient-to-r from-blue-700 to-zinc-900 h-[200px] flex items-center justify-center">Applications banner</div>
        <div className="p-3 rounded-md bg-[#c7053d] my-2">
          <HtmlRenderer htmlContent={announcements} />
        </div>
        <div className="p-3 font-bold">Categories</div>

        <div className="my-3 flex flex-wrap gap-3 *:rounded">
          {categories
            ?.filter((category) => category && !category.includes("/") && category !== "hidden")
            .map((category, index) => (
              <CategoryButton category={category} key={index} />
            ))}
        </div>
      </div>

      {categories
        .filter((category) => category && category !== "hidden" && !category.includes("/"))
        .map((category, index) => (
          <div key={index}>
            <div className="border-t border-zinc-700/50 my-3"></div>
            <div className="p-1 rounded ">
              <div className="flex items-center justify-between">
                <div className="p-3 font-bold">{category}</div>
                <Link href={`/viewcategory/${category}`} className="p-2 rounded bg-[#c7053d] hover:bg-red-950">
                  more
                </Link>
              </div>
              <div className="my-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-1 *:rounded">
                {applist
                  .split("\n")
                  .filter((app) => app.split("|")[1] === category && app.split("|")[0] !== "" && app.split("|")[0] !== "hidden")
                  .slice(0, 4)
                  .map((app, index) => (
                    <AppButton appname={app.split("|")[0]} key={index} />
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
