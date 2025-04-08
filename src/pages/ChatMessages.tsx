import { FaSearch } from "react-icons/fa";
export default function ChatMessages() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-1/3 p-4 bg-green-500">
        {/* Search Bar */}
        <div className="flex flex-row space-x-2">
          <label
            className="flex flex-col justify-center"
            htmlFor="userSearchBar"
          >
            <FaSearch />
          </label>
          <input
            name="userSearchBar"
            id="userSearchBar"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
             focus:ring-blue-500"
            placeholder="Search for users..."
          />
        </div>
        {/* inbox */}
        <div className="flex flex-col overflow-hidden">
          <h4 className="mb-2">Inbox</h4>
          <div className="flex flex-col overflow-y-auto w-full">
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
            <div>pic name</div>
          </div>
        </div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
}
