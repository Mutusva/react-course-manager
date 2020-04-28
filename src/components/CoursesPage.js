// using hooks than class components.

import React, { useState, useEffect } from 'react';
//import { getCourses } from '../api/courseApi';
import courseStore from '../stores/courseStore';
import CourseList  from './CourseList';
import { Link } from 'react-router-dom';
import { loadCourses, deleteCourse } from '../actions/CourseActions';

function CoursesPage()  {
    
    const [courses, setCourses ] = useState(courseStore.getCourses());
    
    useEffect(() => {
        courseStore.addChangeListener(onChange);
        if(courseStore.getCourses().length === 0) loadCourses(); 
        //cleanup on unmount by return a function in useEffect
        return () => courseStore.removeChangeListener(onChange);      
    }, []);

    function onChange() {
        setCourses(courseStore.getCourses());
    }
     
    //proper for making api calls.
     /*
     componentDidMount() {
       getCourses().then(courses => {
          this.setState({ courses: courses });
       });
     }
     */
     
     // we do not need render since its implied in functional components
     // so whatever we return is rendered.
        return ( 
            <> 
                <h2>Courses</h2>
                <Link className="btn btn-primary" to="/course">
                    Add Course
                </Link>
                <br/>
                <br/>
                <CourseList 
                courses={ courses }
                deleteCourse={ deleteCourse }
                />
            </>            
         );
    }
 
export default CoursesPage;