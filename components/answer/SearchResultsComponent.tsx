import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}

export interface SearchResultsComponentProps {
  searchResults: SearchResult[];
}

const SearchResultsComponent = ({
  searchResults,
}: {
  searchResults: SearchResult[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedFavicons, setLoadedFavicons] = useState<boolean[]>([]);

  useEffect(() => {
    setLoadedFavicons(Array(searchResults.length).fill(false));
  }, [searchResults]);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const visibleResults = isExpanded ? searchResults : searchResults.slice(0, 3);

  const handleFaviconLoad = (index: number) => {
    setLoadedFavicons((prevLoadedFavicons) => {
      const updatedLoadedFavicons = [...prevLoadedFavicons];
      updatedLoadedFavicons[index] = true;
      return updatedLoadedFavicons;
    });
  };

  // Define the 'SearchResultsSkeleton'
  const SearchResultsSkeleton = () => (
    <>
      {Array.from({ length: isExpanded ? searchResults.length : 3 }).map(
        (_, index) => (
          <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/4">
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg h-full">
              <div className="w-5 h-5  bg-gray-400 rounded animate-pulse"></div>
              <div className="w-full h-4  bg-gray-400 rounded animate-pulse"></div>
            </div>
          </div>
        )
      )}
    </>
  );

  return (
    <div className="  shadow-lg rounded-lg p-4 mt-4 border bg-white">
      <div className="flex items-center">
        <h2 className="text-xl font-bold flex-grow  text-gray-400">Sources</h2>
      </div>
      <div className="flex flex-wrap my-2">
        {searchResults.length === 0 ? (
          <SearchResultsSkeleton />
        ) : (
          visibleResults.map((result, index) => (
            <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/4">
              <div className="flex items-center space-x-2 border   p-3 rounded-xl h-full">
                {!loadedFavicons[index] && (
                  <div className="w-5 h-5  bg-gray-400 rounded animate-pulse"></div>
                )}
                <img
                  src={result.favicon}
                  alt="favicon"
                  className={`w-5 h-5 ${loadedFavicons[index] ? "block" : "hidden"}`}
                  onLoad={() => handleFaviconLoad(index)}
                />
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold truncate text-gray-700 hover:text-black"
                >
                  {result.title}
                </a>
              </div>
            </div>
          ))
        )}
        {/* 14. Render a button to toggle the expansion of search results */}
        <Button className="rounded-full mt-3 h-10" variant="outline" size="sm">
          <div
            onClick={toggleExpansion}
            className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer h-10 justify-center"
          >
            {!isExpanded ? (
              <>
                {searchResults.slice(0, 3).map((result, index) => (
                  <img
                    key={index}
                    src={result.favicon}
                    alt="favicon"
                    className="w-4 h-4"
                  />
                ))}
                <span className="text-sm font-semibold  text-gray-700">
                  View more
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold dark:text-gray-200 text-gray-700">
                Show Less
              </span>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SearchResultsComponent;
