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
  messages: any,
  name: string,
  room_id: string
}