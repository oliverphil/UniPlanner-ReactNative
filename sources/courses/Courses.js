import React, { useState } from 'react';
import FirestoreService from "../utils/FirestoreService"
import { View, Text } from 'react-native'

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

  render() {
    let courses = firestore.fetchCourseList()
    console.log(courses)

    return (
      <View>
        <Text>
          Courses
        </Text>
      </View>
    )
  }
}

export default Courses;
