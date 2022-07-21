import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";

const Search: React.VFC = () => {
  const tags: string[] = ["トマト", "米"];
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("tag");
  const usernames: string[] = useSearch(filter);

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
      {usernames.map((username: string) => {
        return <p key={username}>{username}</p>;
      })}
    </div>
  );
};

export default Search;
