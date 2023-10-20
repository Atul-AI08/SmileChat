import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { BiFilter, BiSearchAlt2 } from "react-icons/bi";

export default function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BiFilter className="text-panel-header-icon cursor-pointer text-xl " />
      </div>
    </div>
  );
}
