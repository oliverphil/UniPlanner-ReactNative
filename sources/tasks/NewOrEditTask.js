import React, { Component } from 'react'
import {Text, View, Picker} from "react-native";
import {Input, Button} from "react-native-elements";
import DatePicker from "react-native-date-picker";
import RNPickerSelect from 'react-native-picker-select'


class NewOrEditCourse extends Component {

  constructor(props) {
    super(props);
    this.state = { ...props.task }
  }

  /**
   * Fetch the list of courses to add to the picker.
   * @returns {[]} - list of courses created by the user.
   */
  getPickerItems(){
    let items = []
    this.props.courses.forEach(course => {
      items.push({label: course.code, value: course.code})
    })
    return items
  }

  render() {
    return (
      <View>
        <Text class='header'>
          {this.props.title}
        </Text>

        <Input placeholder="Task Title" value={this.state.title} onChangeText={text => this.setState({title: text})}
               disabled={this.props.task.id !== ''}
        />
        <Input placeholder="Task Details" value={this.state.details} onChangeText={text => this.setState({details: text})} />
        <Text>Course:</Text>
        <RNPickerSelect
          onValueChange={code => this.setState({code})}
          items={this.getPickerItems()}
          value={this.state.code}
          />
        <Text>Due Date:</Text>
        <DatePicker minuteInterval={10}  minimumDate={new Date(Date.now())} onDateChange={date => this.setState({dueDate: date})} date={this.state.dueDate} />

        <Button title="Cancel" type="outline" onPress={() => this.props.onCancel()} />
        <Button title="Confirm" onPress={() => this.props.onSubmit({
          code: this.state.code,
          details: this.state.details,
          id: this.state.id,
          title: this.state.title,
          dueDate: this.state.dueDate
        })} />
      </View>
    )
  }
}

export default NewOrEditCourse;
