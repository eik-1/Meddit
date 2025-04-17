import Link from "next/link";
import { Home, Flame, PlusCircle } from "lucide-react"; // Example icons
import { getCommunities } from "@/server/queries";
import Image from "next/image";

export default async function Sidebar() {
  let communities = await getCommunities();

  if (!communities) {
    communities = [];
  }

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <nav className="space-y-2 mb-6">
        <Link
          href="/app"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/app"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          <Flame className="h-5 w-5" />
          <span>Popular</span>
        </Link>
      </nav>

      <div>
        <h2 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 px-2">
          Communities
        </h2>
        <Link
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 w-full mt-2"
          href="/app/create-community"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create Community</span>
        </Link>
        <div className="space-y-1">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/app/h/${community.name}`}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 group"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                <Image
                  src={community.imageUrl}
                  alt="Community logo preview"
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium truncate group-hover:underline">
                h/{community.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
