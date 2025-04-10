import { useUser } from "../context/useUser";

const ProfileSettings = () => {
  const { user } = useUser();
  return (
    <div className="w-full h-full flex flex-row gap-x-6 gap-y-2 p-4">
      <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg flex-[1]">
        <h2 className="text-lg font-semibold text-gray-800 mb-20">
          Edit Avatar
        </h2>
        <img
          className="w-36 h-36 rounded-full border-4 border-white shadow-md"
          src={user?.avatar}
          alt="Profile avatar"
        />
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Change Avatar
        </button>
      </div>
      {/* Added mb-1 */}

      <div className="flex flex-col gap-2 p-4 bg-amber-50 rounded-lg flex-[1]">
        <h2 className="text-lg font-semibold text-gray-800 mb-20">
          Edit Personal Information
        </h2>
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={user?.name}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={user?.username}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={user?.email}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button className="mt-1 px-3 py-1.5 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
          {" "}
          {/* Smaller button */}
          Save Changes
        </button>
      </div>
      {/* Edit Password */}
      <div className="flex flex-col gap-2 p-4 bg-red-50 rounded-lg flex-[1]">
        <h2 className="text-lg font-semibold text-gray-800 mb-20">
          Edit Password
        </h2>
        <div className="space-y-1">
          <label
            htmlFor="old-password"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            name="old-password"
            id="old-password"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button className="mt-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
          {" "}
          {/* Smaller button */}
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
