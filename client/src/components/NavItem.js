import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default props => {
   return (
      <Link
         to={props.path}
         className={`flex-1 rounded-t-xl focus:outline-none focus:bg-gray-200 text-lg h-12 group flex pr-4 pl-6 justify-center items-center py-4 gap-x-2 font-semibold cursor-pointer border-gray-700 ${
            props.active
               ? "text-black border-b-2"
               : "hover:text-black hover:bg-gray-200 text-gray-700"
         }`}
         onClick={props.onClick}
      >
         <SVG src={props.src} alt="" className={"fill-current h-6 w-6"} />
         <p>{props.label}</p>
      </Link>
   );
};
