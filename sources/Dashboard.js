import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import {Header, ListItem} from 'react-native-elements'
import { DrawerActions } from 'react-navigation-drawer';
import AuthenticationService from "./utils/FirebaseUtils";


export default class Dashboard extends React.Component {



  renderTasks(title, tasks) {
    return (
      <View>
        <Text>Tasks due {title}</Text>
        {tasks.length > 0 ? tasks.map((task, key) => {
          return (
            <ListItem key={key} title={task.details} subtitle={task.code}
               rightElement={
                 <Text>
                   {task.dueDate.toDateString()}
                 </Text>
               }
               bottomDivider />
          )
        })
        :
        <Text>There are no tasks due {title}.</Text>}
      </View>
    )
  }

  render() {
    console.log(this.props)
    const firestore = this.props.storage
    const tasksToday = firestore.fetchTasksToday()
    const otherTasks = firestore.fetchTasksLater()
    console.log(tasksToday)
    console.log(otherTasks)
    return (
      <View style={styles.container}>
        {this.renderTasks("today", tasksToday)}
        {this.renderTasks("later", tasksToday)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center'
  }
})
