import { Link, useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { Favorite } from "@mui/icons-material";

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
          return (
            <div key={post.id}>
              <div>
                <p id="displayName">{post.displayName}</p>
                {/* <p id="timestamp">{post.timestamp}</p> */}
                <Link to={`/${post.username}`}>
                  <img id="avatarURL" src={post.avatarURL} alt="アバター画像" />
                </Link>
              </div>
              <div>
                <Link to={`/${post.username}/${post.id}`}>
                  <img src={post.imageURL} alt={post.caption} />
                </Link>
                <div>
                  <Favorite />
                  <p id="likeCounts">0</p>
                </div>
              </div>
              <div>
                <p id="caption">{post.caption}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Search;
