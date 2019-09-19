import React, { useState } from 'react';
import FirestoreService from "../utils/FirestoreService"
import { View, Text, ActivityIndicator, ListRenderItem } from 'react-native'
import {Icon, ListItem} from "react-native-elements";

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

    const firestore = props.screenProps.storage;

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
    console.log('done')
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  renderCourses() {
    if(!this.state.courses || this.state.courses < 1) {
      return (
        <View style={{marginTop: '55%', marginLeft: 'auto', marginRight: 'auto'}}>
          <Text>It doesn't look like there are any courses here.{'\n'}</Text>
          <Text style={{textAlign: 'center'}}>Feel free to
            <Text style={{color: 'darkcyan'}} onPress={() => console.log("new course")}>
              {' '}add a new course.
            </Text>
          </Text>
        </View>
      )
    } else {
      return (
        <React.Fragment>
          {this.state.courses.map((course, key) => {
            return (
              <ListItem key={key} title={course.code} subtitle={course.details}  bottomDivider >
                {/*<Text>*/}
                {/*  <Text id={'code'}>{course.code}{'  '}<Text id={'details'} style={{textAlign: 'auto'}}>{course.details}</Text></Text>*/}
                  <Icon name='edit' onPress={() => console.log('edit')} />
                  <Icon name='delete' onPress={() => console.log('delete')} />
                {/*</Text>*/}
              </ListItem>
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
          <ActivityIndicator style={{marginTop: '65%'}} />
          :
          this.renderCourses()
        }
      </View>
    )
  }
}

export default Courses;
