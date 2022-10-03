export interface Room {
  senderUID: string;
  senderAvatar: string;
  senderName: string;
  receiverUID: string;
  receiverAvatar: string;
  receiverName: string;
  timestamp: Date;
}
