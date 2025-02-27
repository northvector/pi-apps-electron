import Link from "next/link";
import React from "react";

interface AppButtonProps {
  category: string;
}

const CategoryButton: React.FC<AppButtonProps> = React.memo(({ category }) => {
  return (
    <Link href={`/viewcategory/${category}`} className="p-3 bg-zinc-800 grow hover:bg-zinc-950 transition-all flex items-center gap-2">
      <img src={`local:///icons/categories/${category}-64.png`} alt={`${category} icon`} className="size-6" />
      {category}
    </Link>
  );
});

CategoryButton.displayName = "CategoryButton";

export default CategoryButton;
