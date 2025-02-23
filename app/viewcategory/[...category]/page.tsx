/* eslint-disable @next/next/no-img-element */

import { fetchAppList } from "@/app/api/getApplist";
import AppButton from "@/app/components/AppButton";
import CategoryButton from "@/app/components/categories";

export default async function Home({ params }: { params: { category: string } }) {
  const { category } = params;
  let applist;
  try {
    applist = await fetchAppList();
  } catch (error) {
    console.error("Failed to fetch app list:", error);
    return <div>Error loading apps for this category.</div>;
  }

  if (!applist) {
    return <div>No apps available for this category.</div>;
  }

  const appItems = applist.split("\n").map((app, index) => {
    const appDetails = app.split("|");
    if (appDetails.length < 2) return null;

    const [appname, appCategory] = appDetails;
    if (appCategory === decodeURIComponent(category) || appCategory?.includes(category)) {
      return <AppButton appname={appname} key={index} />;
    }
    return null;
  });

  // return if subcategories are the same as the category
  const subCategories = Array.from(
    new Set(
      applist
        .split("\n")
        .map((app) => app.split("|")[1])
        .filter(
          (appCategory) =>
            appCategory?.includes("/") &&
            appCategory?.split("/")[1] !== decodeURIComponent(category) &&
            appCategory?.includes(decodeURIComponent(category))
        )
    )
  ).map((uniqueCategory, index) => <CategoryButton category={uniqueCategory.split("/")[1]} key={index} />);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] mt-10 p-3 flex flex-col gap-3">
      <div className="p-1 rounded bg-gradient-to-r from-blue-700 to-zinc-900 h-[200px] flex text-2xl font-bold items-center justify-center">{decodeURIComponent(category)}</div>
      {subCategories.length >=1 && <div className="p-3 font-bold">
        Categories:
        <div className="flex flex-col gap-2 *:rounded-md">{subCategories}</div>
      </div> }
      <div className="p-3 font-bold">
        Apps:
        <div className="grid grid-cols-1 md:grid-cols-2 *:rounded lg:grid-cols-3 xl:grid-cols-4 gap-3">{appItems}</div>
      </div>
    </div>
  );
}
