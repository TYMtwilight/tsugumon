import { FieldValue } from "firebase/firestore";
export interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  uid: string;
  // NOTE >> Firestoreに登録されているデモデータにはimageLocationがないため、
  //         imageLocation?としています
  imageLocation?: string;
  imageURL: string;
  username: string;
  tags: string[];
  timestamp: FieldValue;
}
