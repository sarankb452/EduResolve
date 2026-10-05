/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import api from '../api'
const Modal = ({ isOpen, onClose, user, userType, refreshUsers }) => {
  if (!isOpen) return null;
  const [data, setData] = useState(null);
    useEffect(() => {
      setData(JSON.parse(sessionStorage.getItem("user")));
    }, []);

  async function acceptData() {
    try {
      const userTypeInt =
        userType === "org"
          ? "verifyLocalAdmin"
          : userType === "mentors"
            ? "verifyMentor"
            : "verifyTeacher";

      const admin =
        userTypeInt === "verifyTeacher" ? "localAdmins" : "globalAdmins";
      await api.post(
        `/${admin}/${userTypeInt}/${user._id}`,
        { token: data.token, id: data._id }
      );

      refreshUsers();
    } catch (err) {
      console.log(err);
    }
    console.log("Accepted");
  }
  async function deleteData() {
    try {
      const userTypeInt =
        userType === "org"
          ? "rejectLocalAdmin"
          : userType === "mentors"
            ? "rejectMentor"
            : "rejectTeacher";
      const admin =
        userType === "rejectTeacher" ? "localAdmins" : "globalAdmins";
      const status = await api.post(
        `/${admin}/${userTypeInt}/${user._id}`,
        { token: data.token, id: data._id }
      );
      refreshUsers();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={onClose}
    >
      
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {user.name}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">Email: {user.emailId}</p>
            {(userType === "org" || userType === "teachers") && <p className="text-sm text-gray-500">
              {`Institution: ${user.institution}`}
            </p>}
            
            {(user.qualification) && <p className="text-sm text-gray-500">
              Qualification : {user.qualification}
            </p>
            }

            {(userType === "mentors") && <p className="text-sm text-gray-500">
              Resume: <a href={user.resumeLink} className="underline text-blue-500 underline-offset-2">Resume Link</a>
              </p>
              }

            <p className="text-sm text-gray-500">
              VerificationStatus: {user.verificationStatus}
            </p>
            {(userType === "teachers" || userType === "mentors") && <p className="text-sm text-gray-500">
              {`Subjects Expertised in ${
                (userType === "mentors" || userType === "teachers") &&
                user.subjectExpertise.join(", ")
              }`}
            </p> }
            
            <p className="text-sm text-gray-500">
              phoneNumber: {user.phoneNumber}
            </p>
            <p className="text-sm text-gray-500">
              {user.designation && `Designation: ${user.designation}`}
            </p>
            { user.address && <p className="text-sm text-gray-500">
              {`Address: ${user.address}`}
            </p>}
          </div>
          <div className="items-center px-4 py-3">
            {(user.verificationStatus === "pending" ||
              user.verificationStatus === "rejected") && (
              <button
                id="ok-btn"
                className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => acceptData()}
              >
                Accept
              </button>
            )}
            {(user.verificationStatus === "pending" ||
              user.verificationStatus === "verified") && (
              <button
                id="cancel-btn"
                className="mt-3 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => deleteData()}
              >
                Reject
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
