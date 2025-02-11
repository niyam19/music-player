import React from "react";

const ProfilePage = () => {
  // Sample user data (Replace this with real user data)
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: "https://via.placeholder.com/150", // Replace with actual image URL
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-96">
        {/* Profile Image */}
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300"
        />

        {/* User Name */}
        <h2 className="text-xl font-semibold text-gray-800 mt-4">{user.name}</h2>

        {/* Email */}
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
