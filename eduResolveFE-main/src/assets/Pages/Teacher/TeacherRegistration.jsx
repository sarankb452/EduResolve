import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../Components/FormInput";
import FormCheckboxGroup from "../../Components/FormCheckBoxGroup";
import api from "../../api";
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
    label: "Gender",
    id: "gender",
    type: "select",
    options: ["Male", "Female", "Prefer not to say"],
    required: true,
  },
  {
    groupLabel: "Subject Expertise",
    id: "subjectExpertise",
    type: "checkbox",
    options: [
      { label: "Telugu", value: "telugu" },
      { label: "Hindi", value: "hindi" },
      { label: "English", value: "english" },
      { label: "Maths", value: "maths" },
      { label: "Science", value: "science" },
      { label: "Social", value: "social" },
    ],
  },
  {
    label: "Qualification",
    id: "qualification",
    type: "select",
    options: [
      "B.Ed",
      "M.Ed",
      "B.Sc",
      "M.Sc",
      "B.A",
      "M.A",
      "B.Com",
      "M.Com",
      "Ph.D",
      "Other"
    ],
    required: true,
  },
  {
    label: "Institution",
    id: "institution",
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
  }
];
const TeacherRegistration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [institutions, setInstitutions] = useState([]);
  React.useEffect(() => {
    async function fetchSchools() {
      const res = await api.get("/teachers/getAllSchools");
      setInstitutions(res.data);
    }
    fetchSchools();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    gender: "",
    qualification: "",
    subjectExpertise: [],
    institution: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubjectExpertiseValid, setIsSubjectExpertiseValid] = useState(true);
  //* State to track if subject expertise validation passes

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


  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      //* Handle checkbox change
      const updatedSubjectExpertise = checked
        ? [...formData.subjectExpertise, value]
        : formData.subjectExpertise.filter((subject) => subject !== value);
      setFormData((prevState) => ({
        ...prevState,
        subjectExpertise: updatedSubjectExpertise,
      }));
      //* Validate checkbox group on change

      
    
      setIsSubjectExpertiseValid(updatedSubjectExpertise.length > 0);
    } else {
      //* Handle other input changes
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
    if(id === "password")
    {
      
      if(value !== formData.confirmPassword)
      {
        setError("*passwords do not match");
      }
      else{
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if at least one checkbox is checked

     
      if(formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

    if (!formData.subjectExpertise.length) {
      setIsSubjectExpertiseValid(false);
      return;
    }

    try {

     if(formData.password.match(/^[a-zA-Z0-9#@_$]{8,}$/) === null) {
        alert("Password must be at least 8 characters long and can contain letters, numbers, and special characters.");
        return;
      }
      const res = await api.put(
        "/teachers/register",
        { ...formData, confirmPassword: undefined },
      );
      console.log("Form Data submitted successfully", res.data);
      navigate("/teacherLogin");
    } catch (error) {
      console.log("Error submitting registration form", error);
    }
  };

  return (
    <div className="xl:mx-auto">
      <p className="text-center mt-5 font-bold font-Montserrat text-3xl">
        Teacher Signup
      </p>
    {error && <p className="text-red-500 text-center">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="mx-10 my-2 xl:grid xl:grid-cols-2  gap-4"
      >
        {formFields.map((field, index) =>
          field.id === "institution" ? (
            <div key={index} className="mt-10 xl:mt-3">
              <label
                htmlFor={field.id}
                className="text-md font-semibold xl:flex xl:gap-4 xl:items-center font-Montserrat cursor-pointer"
              >
                {field.label}
              </label>
              <select
                id={field.id}
                className="form-select border font-Montserrat border-[#D3C9C9] bg-white shadow-lg w-full mt-5 xl:py-2 py-1 px-2 text-sm xl:text-sm"
                onChange={handleChange}
                value={formData[field.id]}
                required={field.required}
              >
                <option value="">Please select...</option>
                {institutions.map((ele, index) => (
                  <option key={index} value={ele.institution}>
                    {ele.institution}
                  </option>
                ))}
              </select>
            </div>
          ) : field.type === "checkbox" ? (
            <FormCheckboxGroup
              key={index}
              {...field}
              onChange={handleChange}
              required={!isSubjectExpertiseValid}
            />
          ) : (
            <FormInput key={field.id} {...field} onChange={handleChange} onConfirmPasswordChange={handleConfirmPasswordChange} />
          )
        )}

        <button
          className="border-none text-white font-Montserrat text-xl xl:text-2xl leading-normal rounded bg-[#917A68] my-2.5 mx-auto px-10  shadow-lg w-full py-2 mt-5 hover:bg-[#282323] hover:font-bold cursor-pointer col-span-2"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default TeacherRegistration;
