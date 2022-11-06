import { FieldValue } from "firebase/firestore";
export interface Post {
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  tags: string[];
  timestamp: FieldValue;
}