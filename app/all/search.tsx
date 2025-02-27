"use client";
import React, { useState } from "react";
import AppButton from "../components/AppButton";

interface SearchProps {
  applist: string;
}

const Search: React.FC<SearchProps> = ({ applist }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] p-3 flex flex-col gap-3">
      <div className="p-3 font-bold">
        <div className="flex justify-center my-2 mb-5">
          <input type="text" value={searchTerm} onChange={handleSearch} className="rounded-md p-3 w-full bg-neutral-700" placeholder="Search" />
        </div>
        {searchTerm ? `Results for "${searchTerm}"` : "All Apps"}:
        <div className="grid grid-cols-1 md:grid-cols-2 *:rounded lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {applist
            .split("\n")
            .filter((app) => {
              const appDetails = app.split("|");
              if (appDetails.length < 2) return false;
                const appName = appDetails[0];
                const appCategory = appDetails[1];
              return appName.toLowerCase().includes(searchTerm.toLowerCase()) || appCategory.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((app, index) => {
              const appDetails = app.split("|");
              if (appDetails.length < 2) return null;
              const appName = appDetails[0];
              const appCategory = appDetails[1];
              return <AppButton key={index} appname={appName} category={appCategory} />;
            })}
        </div>
      </div>
    </div>
  );
};
export default Search;
