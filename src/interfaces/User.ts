export interface User {
  avatarURL: string;
  backgroundURL: string;
  cropsTags: string[];
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}