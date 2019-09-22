import React, {Component} from 'react'
import {ActivityIndicator, Text, View} from "react-native";
import {Icon, ListItem, Overlay} from "react-native-elements";
import NewOrEditCourse from "../courses/NewOrEditCourse";
import {FloatingAction} from "react-native-floating-action";
import NewOrEditTask from "./NewOrEditTask";

export default class Tasks extends Component {

  constructor(props){
    super(props)

    this.firestore = props.screenProps.storage;

    //fetch locally stored course list
    this.state = {
      tasks: [],
      waiting: false,
      overlay: false,
      edit: false,
      task: {code: '', details: ''}
    }
    //if there is no locally stored courses, show the spinner
    if(!this.state.tasks || this.state.tasks.length < 1) {
      this.state.waiting = true
    }

    this.updateTasks.bind(this)();
  }

  updateTasks() {
    //fetch the course list from firebase
    this.firestore.fetchAllTasks().then(data => {
      console.log(data)
      // let tasks = []
      // if(!data.empty) {
      //   data.docs.forEach(task => {
      //     let taskData = task.data()
      //     tasks.push(taskData)
      //   })
      // }
      // console.log(tasks)
      this.setState({tasks: data, waiting: false})
    }).catch(err => {
      this.setState({waiting: false})
    })
  }

  renderTasks() {
    console.log(this.state.tasks);
    if(!this.state.tasks || this.state.tasks.length < 1) {
      return (
        <View style={{marginTop: '55%', marginLeft: 'auto', marginRight: 'auto'}}>
          <Text>It doesn't look like there are any tasks here.{'\n'}</Text>
          <Text style={{textAlign: 'center'}}>Feel free to
            <Text style={{color: 'darkcyan'}} onPress={() => this.setState({overlay: !this.state.overlay})}>
              {' '}add a new task.
            </Text>
          </Text>
        </View>
      )
    } else {
      return (
        <React.Fragment>
          {this.state.tasks.map((task, key) => {
            return (
              <ListItem key={key} title={task.details} subtitle={task.code} rightElement={
                <React.Fragment>
                  <Icon name='edit' onPress={() => this.setState({overlay: !this.state.overlay, task: task, edit: true})} />
                  <Text>{'  '}</Text>
                  <Icon name='delete' onPress={() => {
                    this.firestore.deleteTask(task).then(res => {
                      this.updateTasks()
                    })
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
            {this.renderTasks()}
            <Overlay isVisible={this.state.overlay} onBackdropPress={() => this.setState({overlay: !this.state.overlay})} height="auto" >
              <NewOrEditTask
                title={this.state.edit ? "Edit Task" : "Create a New Task"}
                task={this.state.edit ? this.state.task : {
                  id: '',
                  title: '',
                  details: '',
                  dueDate: new Date(Date.now()),
                  code: ''
                }}
                onSubmit={this.state.edit ?
                  task => {
                    this.firestore.editTask(task).then(res => {
                      this.updateTasks()
                    })
                    this.setState({overlay: !this.state.overlay})
                  }:
                  task => {
                    this.firestore.addTask(task).then(res => {
                      this.updateTasks()
                    })
                    this.setState({overlay: !this.state.overlay})
                  }}
                onCancel={() => this.setState({overlay: !this.state.overlay})}
                courses={this.firestore.fetchCourseListNow()}
              />
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
