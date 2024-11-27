import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const CreateCourse = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);

  useEffect(() => {
    if (!authUser) {
      navigate("/signin"); // Redirect to sign-in if not signed in
    }
  }, [authUser, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId: authUser.id, // user is signed in
    };

    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${authUser.emailAddress}:${authUser.password}`)}`,
        },
        body: JSON.stringify(course),
      });

      if (response.status === 201) {
        const locationHeader = response.headers.get("Location"); // location of the new course
        if (locationHeader) {
          const createdCourseId = locationHeader.split("/").pop(); // Extract the ID from the Location
          navigate(`/courses/${createdCourseId}`); // Redirect to the new course
        } else {
          console.error("Location header missing");
          navigate("/"); // Redirect to courses if no location header
        }
      } else if (response.status === 400) {
        // Handle validation errors
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 500) {
        navigate("/error"); // Redirect on server error
      } else {
        throw new Error("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors([error.message]);
      navigate("/error"); // Redirect on unexpected errors
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    window.location.href = "/";
  };
  return (
    <main>
      <div className="wrap">
        <h2>Create Course</h2>
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
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="courseTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <p>
                By {authUser.firstName} {authUser.lastName}
              </p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={materialsNeeded}
                onChange={(e) => setMaterialsNeeded(e.target.value)}
              />
            </div>
          </div>
          <button className="button" type="submit">
            Create Course
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

export default CreateCourse;
