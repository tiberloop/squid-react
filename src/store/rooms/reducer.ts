/**
handles the appropriate responses to the actions
*/
import { MESSAGE_RECEIVED, SEND_MESSAGE_REQUEST, USER_CHANGED, SET_ROOM } from './actions';
import { IMessageToDeliver, IMessageToReceive, ISquidRoom } from 'utils/apiObjects';
import { sendMessage } from "store/rooms/actions";
import { useAppSelector } from "hooks";

interface IRoomsState {
  rooms: ISquidRoom[],
}
const INITIAL_STATE: IRoomsState = {
  rooms: []
};

function roomReducer(state = INITIAL_STATE, action: { 
                                                      username?: string,
                                                      type: string, 
                                                      message: IMessageToReceive | IMessageToDeliver,
                                                      room: ISquidRoom,
                                                    }): IRoomsState {
  switch (action.type) {

    case MESSAGE_RECEIVED:
      // how to handle a new message from a not-current user
      var roomId: string = action.message?.room;
      console.log(state.rooms.some(room => room.room_id === roomId));
      if (state.rooms.some(room => room.room_id === roomId)) {
        return {
          ...state, // copy current state
          rooms: state.rooms.map( // find the item in the array that matches the provided roomId
                                        // then copy that room and append the new message
            (room) => room.room_id === roomId ? {...room, messages: [...room?.messages, action.message]} : room
          )
        }
      }
      else {
        // create a new room
        var newRoom: ISquidRoom = {
          bucket_number: 0,
          created_by: "",
          display_name: "",
          emoji: "",
          is_dm: false,
          messages: [],
          name: "",
          room_id: action.message?.room
        };
        return {
          ...state, // copy current state
          rooms: [...state.rooms, newRoom]
        }
      }
    case SET_ROOM: // add a room to the rooms array
      return {
        ...state, // copy current state
        rooms: [...state.rooms, action.room]
      }      
    case SEND_MESSAGE_REQUEST:
      return state;
      // debugger;
      // do nothing, as this will invoke a MESSAGE RECEIVED event from the server 
      // var roomId: string = action.message?.room;
      // if (roomId in state.rooms.filter(room => room.room_id)) {
      //   return {
      //     ...state, // copy current state
      //     rooms: state.rooms.map( // find the item in the array that matches the provided roomId
      //                                   // then copy that room and append the new message
      //       (room) => room.room_id === roomId ? {...room, messages: [...room.messages, action.message]} : room
      //     )
      //   }
      // }
      // else { // this should not happen when a message is sent, but i'll keep it in case
      //   // create a new room
      //   console.log("OOPS.")
      //   return state;
        // var newRoom: ISquidRoom = {
        //   bucket_number: 0,
        //   created_by: "",
        //   display_name: "",
        //   emoji: "",
        //   is_dm: false,
        //   messages: [],
        //   name: "",
        //   room_id: action.message?.room
        // };
        // return {
        //   ...state, // copy current state
        //   rooms: [...state.rooms, newRoom]
        // }
      // }
    default:
      return state;
  }
}

export default roomReducer;