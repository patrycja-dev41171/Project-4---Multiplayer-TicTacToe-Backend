export enum Room {
  friend = "friend",
  random = "random",
}

export type RoomEntity = {
  room_id?: string;
  first_user_id: string;
  second_user_id?: string | null;
  room_type: Room;
};
