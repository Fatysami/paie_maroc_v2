
export type MessageStatus = 'sending' | 'delivered' | 'seen' | 'error';

export type MessageActionType = {
  type: 'download' | 'create' | 'navigate' | 'execute';
  label: string;
  icon?: 'download' | 'calendar' | 'file' | 'link';
  payload?: any;
};

export type ChatMessageType = {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  status: MessageStatus;
  actions?: MessageActionType[];
};

export type SimulationResultType = {
  salaireBrut: number;
  cotisationsSalariales: number;
  ir: number;
  salaireNet: number;
  coutEmployeur: number;
};

export type AIResponseType = {
  message: string;
  actions?: MessageActionType[];
};
