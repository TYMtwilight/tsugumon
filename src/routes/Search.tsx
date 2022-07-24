import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";

interface PostData {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date;
  uid: string;
  username: string;
}

const Search: React.VFC = () => {
  const tags: string[] = ["トマト", "米"];
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("tag");
  const posts: PostData[] = useSearch(filter);

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
      {posts.length > 0 &&
        posts.map((post: PostData) => {
          return <img key={post.id} src={post.imageURL} alt={post.caption} />;
        })}
    </div>
  );
};

export default Search;
