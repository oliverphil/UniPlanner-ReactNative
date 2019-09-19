import React, { useState } from 'react';
import FirestoreService from "../utils/FirestoreService"
import { View, Text, ActivityIndicator, ListRenderItem } from 'react-native'
import {Icon} from "react-native-elements";

const firestore = new FirestoreService();

// export const Courses = props => {
//   let courses = firestore.fetchCourseList();
//   console.log(courses)
//
//   return (
//     <View>
//       <Text>
//         Courses
//       </Text>
//     </View>
//   )
// }

class Courses extends React.Component {

  constructor(props){
    super(props)

    //fetch locally stored course list
    this.state = {
      courses: firestore.fetchCourseListNow(),
      waiting: false
    }
    //if there is no locally stored courses, show the spinner
    if(!this.state.courses || this.state.courses.length < 1) {
      this.state.waiting = true
    }

    //fetch the course list from firebase
    firestore.fetchCourseList().then(data => {
      let courses = []
      if(!data.empty) {
        data.docs.forEach(course => {
          let courseData = course.data()
          courses.push(courseData)
        })
      }
      console.log(courses)
      this.setState({courses: courses, waiting: false})
    }).catch(err => {
      this.setState({waiting: false})
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  renderCourses() {
    if(this.state.courses || this.state.courses < 1) {
      return (
        <React.Fragment style={{textAlign: 'center', marginTop: '45%'}}>
          <Text>It doesn't look like there are any courses here.{'\n'}</Text>
          <Text>Feel free to
            <Text style={{color: 'cyan'}} onPress={() => console.log("new course")}>
              Add a new course.
            </Text>
          </Text>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {this.state.courses.map(course => {
            return (
              <View>
                <Text id='code'>{course.code}</Text>
                <Text id='details'>{course.details}</Text>
                <Icon name='pencil' onPress={() => console.log('edit')} />
                <Icon name='trash' onPress={() => console.log('delete')} />
              </View>
            )
          })}
        </React.Fragment>
      )
    }
  }

  render() {

    return (
      <View>
        {this.state.waiting ?
          <ActivityIndicator />
          :
          this.renderCourses()
        }
      </View>
    )
  }
}

export default Courses;
