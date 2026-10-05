/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Table from "../../Components/Table";
import api from '../../api';
const OrganisationHome = () => {
  const [teachers, setTeachers] = React.useState([]);
  const { _id, token, institution } = JSON.parse(
    sessionStorage.getItem("user")
  );
  const fetchTeachersData = async () => {
    try {
      const res = await api.post(
        "/localadmins/getTeachers",
        { school: institution },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-id': _id
          }
        }
      );
      setTeachers(res.data);
    } catch (error) {
      console.error("My error", error);
    }
  };

  React.useEffect(() => {
    fetchTeachersData();
  }, []);

  return (
    <>
      <p className="border-none font-Montserrat text-xl rounded mt-12 mx-auto px-5  w-full py-2 text-slate-600 text-center">
        Teachers
      </p>
      <Table users={teachers} userType="teachers" refreshData={fetchTeachersData} />
    </>
  );
};

export default OrganisationHome;
