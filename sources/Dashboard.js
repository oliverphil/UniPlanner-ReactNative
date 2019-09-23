import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import {Header, ListItem} from 'react-native-elements'
import { DrawerActions } from 'react-navigation-drawer';
import AuthenticationService from "./utils/FirebaseUtils";


export default class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {tasksToday: [], tasksLater: []}

    this.updateTasks.bind(this)()
  }

  updateTasks() {
    const firestore = this.props.screenProps.storage
    firestore.fetchTasksToday().then(tasksToday => {
      this.setState({tasksToday})
    })
    firestore.fetchTasksLater().then(tasksLater => {
      this.setState({tasksLater})
    })
  }

  renderTasks(title, tasks) {
    return (
      <View>
        <Text>Tasks due {title}:{'\n'}</Text>
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
        <Text style={{textAlign: 'center'}}>There are no tasks due {title}.</Text>}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTasks("today", this.state.tasksToday)}{'\n'}
        {this.renderTasks("later", this.state.tasksLater)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  }
})
