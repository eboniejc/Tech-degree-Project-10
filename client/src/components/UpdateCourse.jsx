import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const UpdateCourse = () => {
  const { id } = useParams(); //courseid
  const navigate = useNavigate(); //navigation
  const { authUser } = useContext(UserContext);

  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!authUser) {
      navigate("/signin"); // Redirect if not authenticated
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);

        if (response.status === 404) {
          navigate("/notfound"); // Redirect if course not found
          return;
        }
        if (response.status === 500) {
          navigate("/error"); // Redirect on server error
          return;
        }
        const data = await response.json();

        // Redirect to `/forbidden` if the user isn’t the owner
        if (authUser.id !== data.userId) {
          navigate("/forbidden");
          return;
        }

        setCourse(data);
        //prefill form
        setFormData({
          title: data.title,
          description: data.description,
          estimatedTime: data.estimatedTime || "",
          materialsNeeded: data.materialsNeeded || "",
        });
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/error"); // Redirect on unexpected errors
      }
    };

    fetchCourse();
  }, [authUser, id, navigate]);
   

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData, //copies previous value
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); //wont refresh page

    if (!authUser) {
      setErrors(["Authentication required. Please sign in and try again."]);
      return;
    }

    const { emailAddress, password } = authUser;



    //send put request
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${emailAddress}:${password}`)}`, // Auth header
        },
        body: JSON.stringify(formData),
      });
        if (response.ok) {
        navigate(`/courses/${id}`); // Redirect to course details
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        navigate("/forbidden"); // Redirect if unauthorized
      } else if (response.status === 404) {
        navigate("/notfound"); // Redirect if course not found
      } else if (response.status === 500) {
        navigate("/error"); // Redirect on server error
      } else {
        throw new Error("Update failed.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      navigate("/error"); // Redirect on unexpected errors
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>
        {errors.length > 0 && (
          <div className="validation--errors">
            <h3>Validation Errors</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="title">Course Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
              />
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={formData.estimatedTime}
                onChange={handleInputChange}
              />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={formData.materialsNeeded}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="button" type="submit">
            Update Course
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
};

export default UpdateCourse;
