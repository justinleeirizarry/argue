import { IconGitHub } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 border-b h-14 shrink-0 bg-white backdrop-blur-xl ">
      <span className="inline-flex items-center home-links whitespace-nowrap ">
        <span className="block sm:inline  text-5xl font-bold text-black ">
          Kelly Needs Recipts
        </span>
      </span>
      {/* <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" asChild>
          <a
            target="_blank"
            href="https://git.new/answr"
            rel="noopener noreferrer"
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-2 px-4 rounded shadow"
          >
            <IconGitHub />
            <span className="hidden ml-2 md:flex">github</span>
          </a>
        </Button>
      </div> */}
    </header>
  );
}
