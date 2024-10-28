// import React, { useContext, useState } from "react";
// // import { FlowerStore } from "../store/flower-list-store"; // Adjust store import as per your structure
// import { PrayerStore } from "../store/post-list-store";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/authContext";

// const AddPrayer = () => {
//   const { currentUser } = useContext(AuthContext);
//   const { addPrayer } = useContext(PrayerStore); // Adjust according to your context structure
//   const [formData, setFormData] = useState({
//     prayerText: "",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // console.log(currentUser);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append("prayerText", formData.prayerText);

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/prayers",
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser?.data.accessToken}`,
//           },
//         }
//       );

//       console.log(response);
//       alert("Prayer Created Successfully");

//       // Navigate to another route if necessary
//       // navigate("/flowers"); // Example route
//     } catch (error) {
//       console.error("Error during flower creation:", error.response?.data);
//       alert("Error creating flower, please try again.");
//     }

//     // Call addFlower to update your context/store if needed
//     addPrayer(formData.name, formData.prayerText);
//   };

//   return (
//     <div className="create__flower">
//       <form className="form create_flower__form" onSubmit={handleSubmit}>
//         <h1 className="text-center bg-transparent">Add Prayer</h1>

//         <div className="mb-3">
//           <label htmlFor="name" className="form-label">
//             Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="name"
//             name="name"
//             defaultValue={currentUser.data.user.fullName}
//             onChange={handleChange}
//             placeholder="Enter your name"
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="prayerText" className="form-label">
//             Prayer
//           </label>
//           <textarea
//             type="text"
//             className="form-control"
//             id="prayerText"
//             name="prayerText"
//             value={formData.prayerText}
//             onChange={handleChange}
//             placeholder="Enter your prayer"
//           />
//         </div>

//         <button type="submit" className="btn btn-secondary">
//           Add Prayer
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddPrayer;

import React, { useContext, useState } from "react";
// import { FlowerStore } from "../store/flower-list-store"; // Keep this commented if not needed
import { PrayerStore } from "../store/post-list-store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const AddPrayer = () => {
  const { currentUser } = useContext(AuthContext);
  const { addPrayer } = useContext(PrayerStore); // Ensure this context is set up correctly
  const [formData, setFormData] = useState({
    prayerText: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("prayerText", formData.prayerText);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/prayers",
        data,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`,
          },
        }
      );

      console.log(response);
      alert("Prayer Created Successfully");

      // Call addPrayer to update your context/store if needed
      addPrayer(response.data); // Adjust this to match your data structure

      // Navigate to another route if necessary
      navigate("/prayers"); // Update to the correct route if needed
    } catch (error) {
      console.error("Error during prayer creation:", error.response?.data);
      alert("Error creating prayer, please try again."); // Corrected message
    }
  };

  return (
    <div className="create__prayer">
      <form className="form create_prayer__form" onSubmit={handleSubmit}>
        <h1 className="text-center bg-transparent">Add Prayer</h1>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            defaultValue={currentUser?.data?.user?.fullName} // Optional chaining for safety
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="prayerText" className="form-label">
            Prayer
          </label>
          <textarea
            className="form-control"
            id="prayerText"
            name="prayerText"
            value={formData.prayerText}
            onChange={handleChange}
            placeholder="Enter your prayer"
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Add Prayer
        </button>
      </form>
    </div>
  );
};

export default AddPrayer;
