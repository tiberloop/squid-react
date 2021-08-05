/**
File defining the necessary actions for storing environment settings kind of (hack)
*/
export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE'


export const setWindowSize = (isMobile: boolean) => {
  // debugger;
  return {
    type: SET_WINDOW_SIZE,
    isMobile
  };
};