import { Link, useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import PostComponent from "../components/PostComponent";
import { useEffect } from "react";

interface Doc {
  username: string;
  id: string;
  timestamp: number;
}

const Search: React.VFC = () => {
  const tags: string[] = ["トマト", "米"];
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTag = searchParams.get("tag");
  const docsArray: Doc[] = useSearch(searchTag);
  return (
    <div>
      {tags.map((tag: string) => {
        return (
          <button
            key={tag}
            value={tag}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              if (searchParams.get("tag") === tag) {
                setSearchParams({});
              } else {
                setSearchParams({ tag });
              }
            }}
            style={
              searchParams.get("tag") === tag
                ? { color: "red" }
                : { color: "white" }
            }
          >
            {tag}
          </button>
        );
      })}
      {docsArray.map((document: Doc) => {
        return (
          <PostComponent
            postId={document.id}
            detail={false}
            key={document.id}
          />
        );
      })}
    </div>
  );
};

export default Search;
