import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {ListItem} from 'react-native-elements'


export default class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {tasksToday: [], tasksLater: []}

    this.updateTasks.bind(this)()
  }

  /**
   * Update the state task list with data from firestore.
   */
  updateTasks() {
    const firestore = this.props.screenProps.storage
    firestore.fetchTasksToday().then(tasksToday => {
      this.setState({tasksToday})
    })
    firestore.fetchTasksLater().then(tasksLater => {
      this.setState({tasksLater})
    })
  }

  /**
   * Render the tasks for the dashboard
   * @param title - the title for Today or Later.
   * @param tasks - the list of tasks.
   * @returns {*} - React components to render.
   */
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
        {this.renderTasks("today", this.state.tasksToday)}
        {this.renderTasks("later", this.state.tasksLater)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
