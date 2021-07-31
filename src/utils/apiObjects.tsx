export interface ISquidUser {
  ID: string,
  avatar: string,
  email: string,
  previous_avatars: string[],
  real_name: string,
  username: string
}

export interface ISquidRoom {
  bucket_number: number,
  created_by: string,
  display_name: string,
  emoji: string,
  is_dm: boolean,
  messages: any[],
  name: string,
  room_id: string
}

export interface IMessageToReceive {
  username: string,
  room: any,
  message: string,
  include_image: boolean,
  image_id: string | null,
  time_sent: any,
  avatar_id: any
}
export interface IMessageToDeliver { 
  username: string,
  room: string,
  text: string,
  image_id?: string
}

export interface ISquidMessage {
  image_id: string,
  text: string
  time_sent: number
  user_id: string
  username: string
}