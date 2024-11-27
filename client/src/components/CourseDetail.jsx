import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import ReactMarkdown from "react-markdown";

const CourseDetail = () => {
  const { id } = useParams(); //extract course ID

  const [course, setCourse] = useState(null); // For course data
  const [error] = useState(null); // For errors

  const { authUser } = useContext(UserContext); //auth user
  const navigate = useNavigate(); //redirection

  useEffect(() => {
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
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/error"); // Catch unexpected errors
      }
    };
    fetchCourse();
  }, [id, navigate]); // Re-run  if changes

  //step 14-review
  const handleDelete = async (event) => {
    event.preventDefault();

    if (!authUser) {
      navigate("/signin");
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
        navigate("/forbidden"); // Redirect if unauthorized
      } else if (response.status === 404) {
        navigate("/notfound"); // Redirect if course not found
      } else if (response.status === 500) {
        navigate("/error"); // Redirect on server error
      } else {
        throw new Error("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/error"); // Redirect on unexpected errors

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
            <ReactMarkdown>{course.description}</ReactMarkdown>
          </div>
          <div>
            <h3 className="course--detail--title">Estimated Time</h3>
            <p>{course.estimatedTime || "N/A"}</p>
            <h3 className="course--detail--title">Materials Needed</h3>
            {course.materialsNeeded ? (
              <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
            ) : (
              <p>No materials listed.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;
