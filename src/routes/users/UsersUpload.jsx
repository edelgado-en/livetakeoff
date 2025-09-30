import React, { useState } from "react";

import Loader from "../../components/loader/Loader";
import * as api from "./apiService";

import { toast } from "react-toastify";

import usersData from "./users.json";

const UsersUpload = () => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const { data } = await api.uploadUsers({ users: usersData.users });

      console.log(data);
      toast.success(`success`);
    } catch (err) {
      toast.error("There was an error uploading the users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>Upload users</div>
      <div>
        <button disabled={loading} onClick={() => handleUpload()}>
          Upload
        </button>
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default UsersUpload;
