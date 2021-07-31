function Rooms() {
  
  return (
    <div className={`${isMobile ? menuOrChat ? 'hidden' : 'flex-grow' : ''}`}>
        <CreateChannelModal open={createChannelOpen} setOpen={setCreateChannelOpen} />
        <div className={`bg-white dark:bg-primaryDark border-l border-r h-auto border-gray-300 ${isMobile ? '' : 'max-w-lg'}`}>
          <div className="flex justify-between border-b border-gray-300">
            <strong className="p-2">Channels</strong>
            <div className="flex">
              <button onClick={() => setCreateChannelOpen(true)} className="px-2 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {currentRoom && isMobile && (
                <button onClick={() => setMenuOrChat(true)} className="px-2 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="border-b border-gray-300">
            {channels && channels.map((r: any) => (
              <button className="p-2 w-full text-left block hover:underline" onClick={() => selectChat(r)}>
                #{r.name}
              </button>
            ))}
          </div>
          <p className="p-2 border-b border-gray-300"><strong>DMs</strong></p>
          <div className="border-b border-gray-300">
            {dms && dms.map((u: any) => (
              <button className="p-2 w-full text-left block hover:underline" onClick={() => selectDM(u.ID)}>
                {u.username}
              </button>
            ))}
          </div>
        </div>
      </div>
  )
}

export default Rooms;