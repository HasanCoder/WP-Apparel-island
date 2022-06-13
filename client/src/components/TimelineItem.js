import SVG from "react-inlinesvg";
import check from "../assets/icons/check.svg";

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props) => {
   return (
      <div >  
         <button
            className={`flex group items-center w-full px-6 py-2 cursor-pointer gap-x-4 hover:bg-white focus:ring-2 ring-white focus:outline-none ${
               props.active ? "bg-white" : "text-white"
            }`}
            onClick={props.setPhase}
            onDoubleClick={props.completePhase}
         >
            <div
               className={`flex flex-none items-center justify-center h-12 w-12 z-10 rounded-full ${
                  props.state === "completed"
                     ? "bg-green-400"
                     : props.state === "active"
                     ? "bg-white h-14 w-14 -ml-1 border-4 border-indigo-400 shadow-xl"
                     : props.state === "under_review" 
                     ? "bg-yellow-500" 
                     : "bg-gray-600"
               }`}
            >
               <div
                  className={`z-20 flex items-center justify-center w-8 h-8 ${
                     props.state === "active"
                        ? "bg-indigo-500"
                        : props.active
                        ? "bg-white"
                        : "bg-gray-700 group-hover:bg-white"
                  } rounded-full`}
               >
                  <SVG
                     src={check}
                     className={`fill-current h-4 w-4 ${
                        props.state === "completed"
                           ? "text-green-400"
                           : props.state === "active"
                           ? "text-indigo-500"
                           : props.state === "under_review"
                           ? "text-yellow-500"
                           : "text-gray-600"
                     }`}
                  />
               </div>
            </div>
            <div className="items-center hidden font-semibold sm:flex group-hover:text-black">
               {props.title}
            </div>
         </button>
         {!props.last && (
            <div className="relative ml-10 min-h-16">
               <div
                  className={`absolute left-0 w-4 -mt-3 -mb-6 flex justify-center ${
                     props.state === "completed"
                        ? "bg-green-400"
                        : props.state === "active"
                        ? "bg-indigo-400"
                        : "bg-gray-600"
                  }`}
                  style={{ height: "140%" }}
               />
               <div className="ml-8 text-white text-">
                  {props.nested &&
                     props.nested.map((phase, index) => (
                        <button
                           className="flex items-center gap-x-2 hover:text-green-400 focus:outline-none focus:text-green-400"
                           onDoubleClick={_ => {
                              props.completeNestedPhase(index);
                           }}
                        >
                           <SVG
                              src={check}
                              className={`fill-current h-4 w-4 ${
                                 props.state === "completed" ||
                                 phase.state === "completed"
                                    ? "text-green-400"
                                    : "text-gray-600"
                              }`}
                           />
                           {phase.title}
                        </button>
                     ))}
               </div>
            </div>
         )}
      </div>
   );
};
