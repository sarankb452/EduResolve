import { useState } from "react";
import Login from "../../Components/Login";
import api from '../../api';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OrgLogin = () => {
  const navigate = useNavigate();
  const notify = (message) => toast.error(message);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const [loading,setLoading]=useState(false)
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    
      // Fetch user info using the cookie (token now stored server-side)
      const user = await api.post("/localAdmins/login", {...formData});
  
      sessionStorage.setItem("user", JSON.stringify({...user.data, token: user.headers['authorization'].split(" ")[1] }));
      navigate("/organization");
    } catch (error) {
       if(error.response && error.response.status === 401) {
        toast.warning("Account Status: " + error.response.data.message);
        return;
      }
      console.error(error);
      notify("Invalid Username or Password or Network error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Login
        user="organisation"
        data={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default OrgLogin;
