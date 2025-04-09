import { IoIosSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

export default function GroupMessages() {
  const textAreaMessage = useRef<HTMLTextAreaElement>(null);
  const [messageValue, setMessageValue] = useState("");
  const CreateGroupRef = useRef<HTMLDivElement>(null);
  const [createNewGroups, setCreateNewGroups] = useState(false);

  // Participant selection states
  const participantInputRef = useRef<HTMLDivElement>(null);
  const [participantInput, setParticipantInput] = useState("");
  const [showParticipantSuggestions, setShowParticipantSuggestions] =
    useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  // Sample user data
  const [userSuggestions] = useState([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Mike Johnson" },
    { id: "4", name: "Sarah Williams" },
    { id: "5", name: "Alex Brown" },
  ]);

  // Message and group handlers
  const handleMessageSend = () => {
    alert("Message Sent: " + messageValue);
    setMessageValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedNames = userSuggestions
      .filter((user) => selectedParticipants.includes(user.id))
      .map((user) => user.name);

    if (selectedNames.length === 0) {
      alert("Please select at least one participant");
      return;
    }

    alert(`Selected Participants:\n${selectedNames.join("\n")}`);

    // Optional: Close the modal after submission
    // setCreateNewGroups(false);

    // Optional: Reset the form
    // setSelectedParticipants([]);
  };

  const handleCreateGroup = () => {
    setCreateNewGroups(true);
  };

  // Participant selection handlers
  const handleParticipantSelect = (id: string) => {
    setSelectedParticipants(
      (prev) =>
        prev.includes(id)
          ? prev.filter((pid) => pid !== id) // Remove if already selected
          : [...prev, id] // Add if not selected
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === userSuggestions.length) {
      setSelectedParticipants([]); // Deselect all
    } else {
      setSelectedParticipants(userSuggestions.map((user) => user.id)); // Select all
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        CreateGroupRef.current &&
        !CreateGroupRef.current.contains(event.target as Node)
      ) {
        setCreateNewGroups(false);
      }
      if (
        participantInputRef.current &&
        !participantInputRef.current.contains(event.target as Node)
      ) {
        setShowParticipantSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createNewGroups]);

  return (
    <div className="h-full flex flex-row flex-1">
      {/* Left sidebar */}
      <div className="flex flex-col h-full w-1/4 overflow-hidden shadow-2xl rounded-4xl">
        {/* Search header */}
        <div className="flex-shrink-0 p-4">
          <div
            onClick={handleCreateGroup}
            className="flex flex-row justify-center items-center bg-gray-300 p-2 rounded-4xl cursor-pointer hover:bg-white ease-in-out duration-400"
          >
            <IoIosAddCircle className="flex justify-center items-center" />
            <h3 className="ml-2">Create Group</h3>
          </div>
          <h3 className="mt-3 mb-3">My Groups</h3>
        </div>

        {/* Contact list */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="py-2">
              Name image {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Right chat area */}
      <div className="w-full flex flex-col shadow-2xl rounded-4xl">
        <div className="my-2 p-2 border-b-3">Image Username</div>

        {/* Messages */}
        <div className="no-scrollbar flex flex-col flex-[4] rounded-2xl p-4 overflow-y-scroll">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`flex my-2 ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={
                  i % 2 === 0
                    ? "bg-pink-300 rounded-2xl p-2 max-w-[40%] break-words"
                    : "bg-blue-300 rounded-2xl p-2 max-w-[40%] break-words"
                }
              >
                Message {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="w-full flex-[1] flex flex-row space-x-6 p-4 relative">
          <div className="flex-[4] relative">
            <textarea
              ref={textAreaMessage}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="w-full h-full p-2 border-2 border-solid border-amber-600 rounded-lg resize-none"
              placeholder="Type a message..."
            />
          </div>
          <div
            onClick={handleMessageSend}
            className="grid place-items-center h-12 w-12 bg-blue-500 rounded-2xl cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <IoIosSend className="text-2xl text-white" />
          </div>
        </div>
      </div>

      {createNewGroups && (
        <>
          <div
            className="fixed inset-0 bg-gray-400/50 backdrop-blur-xl z-40"
            onClick={() => setCreateNewGroups(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              ref={CreateGroupRef}
              className="h-[70%] w-1/3 bg-white shadow-xl rounded-lg p-6 overflow-y-auto"
            >
              <h2 className="text-center p-4 text-xl font-bold">
                Create New Group
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Group Name Input */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium">Group Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter group name"
                  />
                </div>

                {/* Participant Selection */}
                <div
                  className="flex flex-col space-y-2"
                  ref={participantInputRef}
                >
                  <label className="font-medium">Add Participants</label>
                  <input
                    type="text"
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    onClick={() => setShowParticipantSuggestions(true)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Search participants..."
                  />

                  {/* Suggestions Dropdown with Checkboxes */}
                  {showParticipantSuggestions && (
                    <div className="border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {/* Select All option */}
                      <div className="flex items-center p-3 border-b border-gray-100">
                        <input
                          type="checkbox"
                          checked={
                            selectedParticipants.length ===
                            userSuggestions.length
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 font-medium">Select All</label>
                      </div>

                      {userSuggestions
                        .filter((user) =>
                          user.name
                            .toLowerCase()
                            .includes(participantInput.toLowerCase())
                        )
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center p-3 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              id={`user-${user.id}`}
                              checked={selectedParticipants.includes(user.id)}
                              onChange={() => handleParticipantSelect(user.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="ml-2 cursor-pointer"
                            >
                              {user.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Selected Participants Display */}
                {selectedParticipants.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">
                      Selected Participants ({selectedParticipants.length}):
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userSuggestions
                        .filter((user) =>
                          selectedParticipants.includes(user.id)
                        )
                        .map((user) => (
                          <span
                            key={user.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {user.name}
                            <button
                              onClick={() => handleParticipantSelect(user.id)}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setCreateNewGroups(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
