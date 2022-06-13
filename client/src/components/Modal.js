
export default function OrderModal({ isActive, children, title, handleClose }) {



   return (

      <div
         style={{ transition: "opacity 0.25s ease",zIndex:100 }}
         className={`${
            isActive ? "" : "opacity-0 pointer-events-none"
         } fixed w-full h-full top-0 left-0 flex items-center justify-center`}
      >
         <div
            onClick={handleClose}
            className="absolute w-full h-full bg-gray-900 opacity-50"
         />
         <div style={{zIndex:101}}className="w-11/12 mx-auto bg-white rounded shadow-lg md:max-w-screen-lg">
            <div
               onClick={handleClose}
               className="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close"
            >
               <svg
                  className="text-white fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
               >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
               </svg>
               <span className="text-sm">(Esc)</span>
            </div>

            <div className="px-6 py-4 text-left modal-content">
               <div className="flex items-center justify-between pb-3">
                  <p className="text-2xl font-bold">{title}</p>
               
                  <div
                     onClick={handleClose}
                     className="z-50 cursor-pointer modal-close"
                  >
                     <svg
                        className="text-black fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                     >
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                     </svg>
                  </div>
               </div>

               {children}

               <div className="flex justify-end pt-2">
                  <button
                     onClick={handleClose}
                     className="p-3 px-4 mr-2 bg-transparent rounded-lg text-red-vivid-500 hover:bg-gray-100 hover:text-red-vivid-400"
                  >
                     Close
                  </button>
               </div>
            </div>
         </div>
      </div>
      

   );
}
