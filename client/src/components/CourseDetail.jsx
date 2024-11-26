import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const CourseDetail = () => {
  const { id } = useParams(); //extract course ID

  const [course, setCourse] = useState(null); // For course data
  const [error, setError] = useState(null); // For errors

  const { authUser } = useContext(UserContext); //auth user
  const navigate = useNavigate(); //redirection

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the JSON
        } else {
          throw new Error("Failed to fetch course details.");
        }
      })
      .then((data) => setCourse(data)) // Save the data in state
      .catch((err) => setError(err.message)); // Save error message in state
  }, [id]); // Re-run  if `id` changes

  //step 14-review
  const handleDelete = async (event) => {
    event.preventDefault();

    if (!authUser) {
      setErrors(["Authentication required. Please sign in and try again."]);
      return;
    }

    const { emailAddress, password } = authUser;
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${emailAddress}:${password}`)}`, // Auth header
        },
      });

      if (response.status === 204) {
        // Successful
        navigate("/");
      } else if (response.status === 403) {
        setErrors(["You do not have permission to delete this course."]);
      } else if (response.status === 404) {
        setErrors(["Course not found."]);
      } else {
        throw new Error("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors([error.message]);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!course) {
    return <p>Loading...</p>;
  }

  const isOwner = authUser && authUser.id === course.userId; //conditional render

  return (
    <main>
      <div className="actions--bar">
        <div className="wrap">
          {isOwner && (
            <>
              <a className="button" href={`/courses/${id}/update`}>
                Update Course
              </a>
              <a className="button" href="#" onClick={handleDelete}>
                Delete Course
              </a>
            </>
          )}
          <a className="button button-secondary" href="/">
            Return to List
          </a>
        </div>
      </div>

      <div className="wrap">
        <h2>Course Detail</h2>
        <div className="main--flex">
          <div>
            <h3 className="course--detail--title">Course</h3>
            <h4 className="course--name">{course.title}</h4>
            <p>
              By{" "}
              {course.User
                ? course.User.firstName + " " + course.User.lastName
                : "Unknown"}
            </p>
            <p>{course.description}</p>
          </div>
          <div>
            <h3 className="course--detail--title">Estimated Time</h3>
            <p>{course.estimatedTime || "N/A"}</p>
            <h3 className="course--detail--title">Materials Needed</h3>
            <ul className="course--detail--list">
              {course.materialsNeeded ? (
                course.materialsNeeded
                  .split("\n")
                  .map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No materials listed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;
