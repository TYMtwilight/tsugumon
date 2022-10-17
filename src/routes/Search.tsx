import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import PostComponent from "../components/PostComponent";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  tags: string[];
  timestamp: Date;
  uid: string;
  username: string;
}

const Search: React.VFC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const getPosts: (tags: string) => void = async (tags) => {
    const tagsArray: string[] = tags.split(/\s+/).map((tag: string) => {
      return `${tag}`;
    });
    const postSnapArray: QuerySnapshot<DocumentData> = await getDocs(
      query(
        collection(db, "posts"),
        where("tags", "array-contains-any", tagsArray),
        orderBy("timestamp", "desc"),
        limit(50)
      )
    );
    if (postSnapArray.size > 0) {
      const postsArray: Post[] = postSnapArray.docs
        .map((postSnap: QueryDocumentSnapshot<DocumentData>) => {
          const post: Post = {
            avatarURL: postSnap.data().avatarURL,
            caption: postSnap.data().caption,
            displayName: postSnap.data().displayName,
            id: postSnap.id,
            imageURL: postSnap.data().imageURL,
            timestamp: postSnap.data().timestamp.toDate(),
            tags: postSnap.data().tags,
            uid: postSnap.data().uid,
            username: postSnap.data().username,
          };
          return post;
        })
        .sort((first: Post, second: Post) => {
          return first.timestamp.getTime() - second.timestamp.getTime();
        });
      setPosts(postsArray);
    } else {
      setPosts([]);
    }
  };

  return (
    <div className="w-screen min-h-screen h-full bg-slate-100">
      <div className="flex fixed items-center w-screen h-16 px-4 z-10 top-0 bg-slate-100">
        <button
          className="mx-4 z-20"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            const tags: string | null = searchParams.get("tag");
            if (tags) {
              getPosts(tags);
            }
          }}
        >
          <SearchRounded />
        </button>
        <input
          className="w-10/12 h-10 pl-12 rounded-lg fixed "
          type="text"
          value={searchParams.get("tag") || ""}
          onChange={(event) => {
            event.preventDefault();
            let tag = event.target.value;
            if (tag) {
              setSearchParams({ tag });
            } else {
              setSearchParams({});
            }
          }}
          onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
            event.preventDefault();
            if (event.key === "Enter") {
              const tags: string | null = searchParams.get("tag");
              if (tags) {
                getPosts(tags);
              }
            }
          }}
        />
        <button
          className="fixed right-4 z-20"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            setSearchParams({});
            getPosts("");
          }}
        >
          <CloseRounded />
        </button>
      </div>
      <div className="pt-20 bg-slate-100">
        {posts.map((post: Post) => {
          return (
            <PostComponent
              key={post.id}
              avatarURL={post.avatarURL}
              caption={post.caption}
              displayName={post.displayName}
              id={post.id}
              imageURL={post.imageURL}
              tags={post.tags}
              timestamp={post.timestamp}
              uid={post.uid}
              username={post.username}
              detail={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Search;
