/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useStore } from '../store/reactive'
import axios from 'axios'

export default function UserCardModal(props) {
  const {open, setOpen, userId} = props
  // const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)

  const [src, setSrc] = useState('https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/DCTM_Penguin_UK_DK_AL639403_k3qity.jpg')
  const [users, setUsers] = useStore('users')

  const user = users.find(u => u.ID === userId)

  useEffect(() => {
    if (open && user.avatar) {
      axios.get(`/uploads/${user.avatar}`, { responseType: "blob" }).then(res => {
        const srcurl = URL.createObjectURL(res.data)
        setSrc(srcurl)
        console.log('image loaded')
        })
    }
  }, [user, open])



  // console.log('user', user)

  // useEffect(() => {
  //   axios.get(`/uploads/${user.avatar_id}`, { responseType: "blob" }).then(res => {
  //   const srcurl = URL.createObjectURL(res.data)
  //   setSrc(srcurl)
  //   })
  // }, [])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <img src={src} alt="Avatar" className="mx-auto object-cover flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10" />
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {user.username}
                    </Dialog.Title>
                    <div className="mt-2">
                      <div class="grid grid-cols-3 gap-6">
                        <div class="col-span-3 sm:col-span-2">
                          <label for="channel-name" class="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <div class="mt-1 flex w-full rounded-md shadow-sm">
                            <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user.real_name}</div>
                          </div>
                        </div>
                        <div class="col-span-3 sm:col-span-2">
                          <label for="channel-name" class="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div class="mt-1 flex w-full rounded-md shadow-sm">
                            <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user.email}</div>
                          </div>
                        </div>
                        <div class="col-span-3 sm:col-span-2">
                          <label for="channel-name" class="block text-sm font-medium text-gray-700">
                            Date Joined
                          </label>
                          <div class="mt-1 flex w-full rounded-md shadow-sm">
                            <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user.date_joined}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Done
                </button>
                <button
                  type="button"
                  disabled
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  ref={cancelButtonRef}
                >
                  Message
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}