export interface Room {
  senderUID: string;
  senderAvatar: string;
  senderName: string;
  senderDisplayName: string;
  receiverUID: string;
  receiverAvatar: string;
  receiverName: string;
  receiverDisplayName: string;
  timestamp: Date;
}
