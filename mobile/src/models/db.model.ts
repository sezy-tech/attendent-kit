export namespace DBCollection {
    export interface UserModel {
      _id: number;
      name: string;
      voice: string;
      status: 0 | 1 | 2 | 3
    }
  }

export interface User {
  _id: string,
  phone : string,
  name : string,
  email : string,
  hasFaceInput: boolean,
  hasSpeechInput: boolean,
  role: number,
  deviceIds:string
};