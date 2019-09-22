import React, { useState } from 'react';
import FirestoreService from "../utils/FirestoreService"
import { View, Text, ActivityIndicator, ListRenderItem } from 'react-native'
import {Icon, ListItem, Overlay} from "react-native-elements";
import {FloatingAction} from "react-native-floating-action";
import NewOrEditCourse from "./NewOrEditCourse";

class Courses extends React.Component {

  constructor(props){
    super(props)

    this.firestore = props.screenProps.storage;

    //fetch locally stored course list
    this.state = {
      courses: this.firestore.fetchCourseListNow(),
      waiting: false,
      overlay: false,
      edit: false,
      course: {code: '', details: ''}
    }
    //if there is no locally stored courses, show the spinner
    if(!this.state.courses || this.state.courses.length < 1) {
      this.state.waiting = true
    }

    this.updateCourses.bind(this)();
  }

  updateCourses() {
    //fetch the course list from firebase
    this.firestore.fetchCourseList().then(data => {
      let courses = []
      if(!data.empty) {
        data.docs.forEach(course => {
          let courseData = course.data()
          courses.push(courseData)
        })
      }
      this.setState({courses: courses, waiting: false})
    }).catch(err => {
      this.setState({waiting: false})
    })
  }

  renderCourses() {
    if(!this.state.courses || this.state.courses < 1) {
      return (
        <View style={{marginTop: '55%', marginLeft: 'auto', marginRight: 'auto'}}>
          <Text>It doesn't look like there are any courses here.{'\n'}</Text>
          <Text style={{textAlign: 'center'}}>Feel free to
            <Text style={{color: 'darkcyan'}} onPress={() => this.setState({overlay: !this.state.overlay})}>
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
              <ListItem key={key} title={course.code} subtitle={course.details} rightElement={
                <React.Fragment>
                  <Icon name='edit' onPress={() => this.setState({overlay: !this.state.overlay, course: course, edit: true})} />
                  <Text>{'  '}</Text>
                  <Icon name='delete' onPress={() => {
                    this.firestore.deleteCourse(course.code)
                    this.updateCourses()
                  }} />
                </React.Fragment>
              }  bottomDivider />
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
          <View style={{height: '95%'}}>
            {this.renderCourses()}
            <Overlay isVisible={this.state.overlay} onBackdropPress={() => this.setState({overlay: !this.state.overlay})} height="auto" >
              <NewOrEditCourse
                title={this.state.edit ? "Edit Course" : "Create a New Course"}
                course={this.state.edit ? this.state.course : {code: '', details: ''}}
                onSubmit={this.state.edit ?
                  course => {
                    this.firestore.editCourse(course).then(res => {
                      this.updateCourses()
                    })
                    this.setState({overlay: !this.state.overlay})
                  }:
                  course => {
                    this.firestore.addCourse(course).then(res => {
                      this.setState({courses: this.firestore.fetchCourseListNow()})
                    })
                    this.setState({overlay: !this.state.overlay})
                  }}
                onCancel={() => this.setState({overlay: !this.state.overlay})} />
            </Overlay>
            <FloatingAction
              onPressMain={() => this.setState({overlay: !this.state.overlay, edit: false})}
              floatingIcon={<Icon name='add' />}
              showBackground={false}
            />
          </View>
        }
      </View>
    )
  }
}

export default Courses;
