import React, { useEffect, useState } from 'react';

function UserHover() {
  
  return (
    <div>
      
    </div>
  )
}
// const mapStateToProps = useAppSelector((state:any) => state.userState.isLoggedIn);
const mapStateToProps = (state:any) => ({
  isLoggedIn: state.userState.isLoggedIn
});


export default UserHover;