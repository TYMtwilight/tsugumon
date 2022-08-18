import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import PostComponent from "../components/PostComponent";

interface Post {
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
  const searchTag = searchParams.get("tag");
  const posts: Post[] = useSearch(searchTag);
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
      {posts.map((post: Post) => {
        return (
          <PostComponent key={post.id}
            avatarURL={post.avatarURL}
            caption={post.caption}
            displayName={post.displayName}
            id={post.id}
            imageURL={post.imageURL}
            timestamp={post.timestamp}
            uid={post.uid}
            username={post.username}
            detail = {false}
          />
        );
      })}
    </div>
  );
};

export default Search;
