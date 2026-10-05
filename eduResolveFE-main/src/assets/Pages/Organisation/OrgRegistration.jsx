/* eslint-disable no-unused-vars */
import { useState } from "react";
import FormInput from "../../Components/FormInput";
import api from "../../api";
import { useNavigate } from "react-router-dom";
const formFields = [
  { label: "Name", id: "name", placeholder: "Enter name", required: true },
  {
    label: "Email",
    id: "emailId",
    placeholder: "Enter email",
    required: true,
    type: "email",
  },
  {
    label: "Date of Birth",
    id: "birthdate",
    placeholder: "Enter Date of Birth",
    required: true,
    type: "date",
  },
  {
    label: "Institution",
    id: "institution",
    placeholder: "Enter Institution",
    required: true,
  },
      {
    label: "Address",
    id: "address",
    type: "textArea",
    placeholder: "Enter Address",
    required: true,
  },
  {
    label: "Gender",
    id: "gender",
    type: "select",
    options: ["Male", "Female", "Prefer not to say"],
    required: true,
  },
  {
    label: "Designation",
    id: "designation",
    type: "select",
    options: ["Principal", "Vice Principal", "Administrator","Other"],
    required: true,
  },
  {
    label: "Phone number",
    id: "phoneNumber",
    placeholder: "Enter Phone number",
    required: true,
    pattern: "\\d{10}",
    title: "Phone number should be 10 digits",
  },
  {
    label: "Password",
    id: "password",
    placeholder: "Enter password",
    type: "password",
    required: true,
    minLength: 8,
    title: "Password must be at least 8 characters long",
  },
  {
    label: "Confirm Password",
    id: "confirmPassword",
    placeholder: "Confirm password",
    type: "password",
    required: true,
    minLength: 8,
    title: "Password must be at least 8 characters long",
  },


];

const OrgRegistration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    emailId: "",
    designation: "",
    institution: "",
    birthdate: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
 
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    if(id === "password")
    {
      console.log("password", value);
      console.log("confirmPassword", formData.confirmPassword);
      if(value !== formData.confirmPassword)
      {
        setError("*passwords do not match");
      }
      else{
        setError("");
      }
    }
  };

  const handleConfirmPasswordChange = (e) =>{
    const { id, value } = e.target;
 
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    if(value !== formData.password) {
      setError("*passwords do not match");
    }
    else{
      setError("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.password.match(/^[a-zA-Z0-9#@_$]{8,}$/) === null) {
        alert("Password must be at least 8 characters long and can contain letters, numbers, and special characters.");
        return;
      }
      if(formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      await api.put(
        "/localAdmins/register",
        {...formData, confirmPassword: undefined},
      );
      navigate("/organisationLogin")
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };


  return (
    <div className="xl:mx-auto">
      <p className="text-center mt-5 font-bold font-Montserrat text-3xl">
        Organisation Signup
      </p>
    {error && <p className="text-red-500 text-center">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="mx-10 my-2 xl:grid xl:grid-cols-2 gap-4"
      >
        {formFields.map((field, index) => (
          <FormInput
            key={field.id}
            {...field}
            value={formData[field.id]}
            onChange={handleChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
          />
        ))}
        <button
          className={`order-none text-white font-Montserrat text-xl xl:text-2xl leading-normal rounded bg-[#917A68] my-2.5 mx-auto px-10  shadow-lg w-full py-2 mt-5 hover:bg-[#282323] hover:font-bold cursor-pointer col-span-2`}
          type="submit"
          >
          Sign up
        </button>
      </form>
    </div>
  );
};
export default OrgRegistration;
