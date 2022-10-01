export interface Message {
  messageId: string;
  senderUID: string;
  senderAvatarURL: string;
  message: string;
  receiverUID: string;
  timestamp: Date;
}
