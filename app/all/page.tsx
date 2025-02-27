/* eslint-disable @next/next/no-img-element */
import { fetchAppList } from "@/app/api/getApplist";
import Search from "./search";

export default async function Home() {
  const response = await fetchAppList();
  return <Search applist={response} />;
}
