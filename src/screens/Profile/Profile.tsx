import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { format } from 'date-fns'
import SmallLoadingSpinner from "components/helpers/SmallLoadingSpinner";
import { logOut } from "services/authenticationService";

function Profile() {
  const history = useHistory()
  const [user, setUser] = useState<any>(null)

  const logout = () => {
    logOut();
    history.push('/login');
  }

  useEffect(() => {
    axios.get('/users/me').then(res => {
      setUser(res.data)
      console.log(res.data)
    })
  }, [])

  return (
    <div className="inline-block m-2 sm:mx-auto align-bottom bg-white dark:bg-primaryDark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div className="bg-white dark:bg-primaryDark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
            <img src='https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/DCTM_Penguin_UK_DK_AL639403_k3qity.jpg' alt="Avatar" style={{ height: '32px', width: '32px' }} />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            {user ? user.username : <SmallLoadingSpinner />}
            </h3>
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <div className="mt-1 flex w-full rounded-md shadow-sm">
                    <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user ? user.real_name : <SmallLoadingSpinner />}</div>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="mt-1 flex w-full rounded-md shadow-sm">
                    <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user ? user.email : <SmallLoadingSpinner />}</div>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Joned
                  </label>
                  <div className="mt-1 flex w-full rounded-md shadow-sm">
                    <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user ? user.date_joined ? format(new Date(user.date_joined), 'p') : '' : <SmallLoadingSpinner />}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-primaryDark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        {/* <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save
        </button> */}
        <button
          onClick={() => logout()}
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Profile;