import React, { useState, useEffect } from 'react';
// import { Prompt } from 'react-router-dom';
import CourseForm from './CourseForm';
// import * as courseApi from '../api/courseApi'
import courseStore from '../stores/courseStore'
import { toast } from 'react-toastify';
import * as courseActions from '../actions/CourseActions';
/*
     <Prompt when={true} message="Are you sure you want to leave!"/>
          { props.match.params.slug }
*/

const ManageCoursePage = props => {

    const [errors, setErrors] = useState({});
    const [courses, setCourses] = useState(courseStore.getCourses());
    // array destructuring a feature build into javascript.
    const [course, setCourse] = useState({
        id: null,
        slug: "",
        title: "",
        authorId: null,
        category: ""
    });

    useEffect(() => {
        courseStore.addChangeListener(onChange);
        const slug = props.match.params.slug; // from the path `/courses/:slug`
        if(courses.length === 0) {
            courseActions.loadCourses();
        }
        else if(slug) { 
            setCourse(courseStore.getCourseBySlug(slug));
        }
        return ()=> courseStore.removeChangeListener(onChange);
    },[courses.length, props.match.params.slug]);

    function onChange() {
        setCourses(courseStore.getCourses());
    }

    function handleTitleChange(event) {
        // do not update state directly.
        const updatedCourse = {...course, title: event.target.value }; //spread operator to create a copy of the object
        setCourse(updatedCourse);
    }

    //Single change handler for all properties
    function handleChange(event) {
        // const target = event.target; // below is same as using destructuring
        const { target } = event;

        const updatedCourse = {...course, [target.name]: target.value };
        setCourse(updatedCourse);
    }

    function formIsValid() {
        const _errors = {};

        if(!course.title) _errors.title = "Title is required";
        if(!course.authorId) _errors.authorId = "Author ID is required";
        if(!course.category) _errors.category = "Category is required";
        
        setErrors(_errors);
        // Form is valid if the errors object has no properties.
        return Object.keys(_errors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        if(!formIsValid()) return;

        courseActions.saveCourse(course).then(()=> {
            props.history.push('/courses'); //uses react router history to redirect.
            toast.success('Course has been saved successfully!');
        });
    }

    return (
        <>
          <h2> Manage Course </h2>
           <CourseForm 
           course={ course }
           onChange= { handleChange }
           onSubmit={ handleSubmit }
           errors = {errors}
           />
        </>
    );
}

export default ManageCoursePage;