export interface LikeUser {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}
