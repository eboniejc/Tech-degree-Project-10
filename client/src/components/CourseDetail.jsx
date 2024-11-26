import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
    const { id } = useParams(); //extract course ID

    const [course, setCourse] = useState(null); // For course data
    const [error, setError] = useState(null);   // For errors

    useEffect(() => {
        fetch(`http://localhost:5000/api/courses/${id}`)
          .then((response) => {
            if (response.ok) {
              return response.json(); // Parse the JSON 
            } else {
              throw new Error('Failed to fetch course details.'); 
            }
          })
          .then((data) => setCourse(data)) // Save the data in state
          .catch((err) => setError(err.message)); // Save error message in state
      }, [id]); // Re-run  if `id` changes


      if (error) {
        return <p>Error: {error}</p>;
      }
      
      if (!course) {
        return <p>Loading...</p>;
      }

      return (
        <main>
          <div className="actions--bar">
            <div className="wrap">
              <a className="button" href={`/courses/${id}/update`}>Update Course</a>
              <a className="button" href="#">Delete Course</a>
              <a className="button button-secondary" href="/">Return to List</a>
            </div>
          </div>
          
          <div className="wrap">
            <h2>Course Detail</h2>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">Course</h3>
                <h4 className="course--name">{course.title}</h4>
                <p>By {course.User ? course.User.firstName + ' ' + course.User.lastName : 'Unknown'}</p>
                <p>{course.description}</p>
              </div>
              <div>
                <h3 className="course--detail--title">Estimated Time</h3>
                <p>{course.estimatedTime || 'N/A'}</p>
                <h3 className="course--detail--title">Materials Needed</h3>
                <ul className="course--detail--list">
                  {course.materialsNeeded
                    ? course.materialsNeeded.split('\n').map((item, index) => <li key={index}>{item}</li>)
                    : <li>No materials listed.</li>}
                </ul>
              </div>
            </div>
          </div>
        </main>
      );
    };
    
    export default CourseDetail;