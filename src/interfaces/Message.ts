export interface Message {
  messageId: string;
  senderUID: string;
  message: string;
  receiverUID: string;
  timestamp: Date;
}
