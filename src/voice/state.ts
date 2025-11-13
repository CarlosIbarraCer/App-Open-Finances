export type VoiceCommandState = {
  listening: boolean;
  status: 'idle' | 'listening' | 'processing' | 'error';
  transcript: string;
};

export type VoiceStateEvent =
  | { type: 'start' }
  | { type: 'processing'; transcript: string }
  | { type: 'stop' }
  | { type: 'error' }
  | { type: 'idle' };

export const initialVoiceState: VoiceCommandState = {
  listening: false,
  status: 'idle',
  transcript: '',
};

export const voiceStateReducer = (
  state: VoiceCommandState,
  event: VoiceStateEvent
): VoiceCommandState => {
  switch (event.type) {
    case 'start':
      return {
        listening: true,
        status: 'listening',
        transcript: '',
      };
    case 'processing':
      return {
        ...state,
        status: 'processing',
        transcript: event.transcript,
      };
    case 'stop':
      return {
        listening: false,
        status: 'idle',
        transcript: '',
      };
    case 'error':
      return {
        ...state,
        status: 'error',
      };
    case 'idle':
    default:
      return {
        ...state,
        status: 'idle',
      };
  }
};
