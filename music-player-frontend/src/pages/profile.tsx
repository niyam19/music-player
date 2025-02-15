import { useState } from "react";
import ProfilePlaceholder from "../assets/icons/profile-icon.png";

const ProfilePage = () => {
  const storedUserData = localStorage.getItem("userData");
  const user = storedUserData ? JSON.parse(storedUserData) : { username: "Guest", email: "guest@example.com" };

  const [username, setUsername] = useState(user?.username);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(ProfilePlaceholder);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const saveUsername = async() => {
    setIsEditing(false);
    const updatedUserData = { ...user, username};
    try{
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/update-profile', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({username}),
      });

      if(response.ok){
        console.log("Profile updated successfully");
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      } else{
        console.error("Failed to update profile:", await response.json());
      }
    } catch(error){
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = async() => {
        if (fileReader.result) {
          setProfileImage(fileReader.result.toString());
          await saveUsername();
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-800 text-white">
      <div className="bg-gray-700 p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-gray-600">
        
        {/* Profile Image with Hover Effect */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <label htmlFor="profile-upload" className="cursor-pointer group">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto border-4 object-cover border-gray-500 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm">Update Picture</span>
            </div>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Editable Username */}
        <div className="mt-2 truncate">
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onBlur={saveUsername}
              className="bg-gray-700 text-white text-center p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              autoFocus
            />
          ) : (
            <h2
              className="text-2xl font-semibold mt-2 cursor-pointer hover:underline"
              onClick={() => setIsEditing(true)}
            >
              {username}
            </h2>
          )}
        </div>

        {/* Email */}
        <p className="text-gray-400 text-lg mt-2">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
