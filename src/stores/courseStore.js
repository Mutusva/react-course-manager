// the store will emit events when the store is changed
import { EventEmitter } from 'events' // events is build in node
import Dispatcher from '../appDispatcher';
import actionTypes from '../actions/actionTypes'

const CHANGE_EVENT = "change";

let _courses = []; // private variable.

class CourseStore extends EventEmitter {
  
    /*
     this will allow React components to subscribe to our store so
     they're notified when changes occur.
    */
   addChangeListener(callback) {
     this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
      this.emit(CHANGE_EVENT);
  }

  getCourses() {
      return _courses;
  }

  getCourseBySlug(slug) {
      return _courses.find(course => course.slug === slug);
  }

}

const store = new CourseStore();

// With Flux; Every store that registered with the dispatcher is notified of every action.

Dispatcher.register(action => {
   switch(action.actionType) {
     case actionTypes.CREATE_COURSE:
         _courses.push(action.course);
         store.emitChange(); //Anytime the store changes, we need to call emitChange.
      break;

      case actionTypes.LOAD_COURSES:
         _courses = action.courses;
         store.emitChange(); 
      break;

      case actionTypes.UPDATE_COURSE:
         _courses = _courses.map(course => 
            course.id === action.course.id ? action.course : course)
         store.emitChange(); 
      break;

      case actionTypes.DELETE_COURSE:
         _courses = _courses.filter(course => course.id !== parseInt(action.id,10))
         store.emitChange(); 
      break;
      
      default: 
      // Nothing to do.
      break;
   }
});

export default store;

// we need to register our store with the dispatcher.