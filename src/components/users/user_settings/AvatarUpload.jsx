import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const AvatarUpload = ({ avatarImageUrl, onImageUpload }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(avatarImageUrl);
  }, [avatarImageUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Avatar
        src={image}
        alt="Avatar"
        sx={{
          width: 80,
          height: 80,
          border: "2px solid white",
          boxShadow: 2,
        }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="avatar-upload"
      />
      <label htmlFor="avatar-upload">
        <Tooltip title="Upload Avatar">
          <IconButton
            component="span"
            style={{ position: "absolute", bottom: -10, right: -10 }}
          >
            <PhotoCamera fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      </label>
    </div>
  );
};

export default AvatarUpload;
