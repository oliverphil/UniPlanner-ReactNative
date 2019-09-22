import React, { Component } from 'react'
import {Text, View} from "react-native";
import {Input, Button} from "react-native-elements";


class NewOrEditCourse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: props.course.code,
      details: props.course.details
    }
  }


  render() {
    return (
      <View>
        <Text class='header'>
          {this.props.title}
        </Text>

        <Input placeholder="Course Code" value={this.state.code} onChangeText={text => this.setState({code: text})}
               disabled={this.props.course.code !== ''}
        />
        <Input placeholder="Course Details" value={this.state.details} onChangeText={text => this.setState({details: text})} />

        <Button title="Cancel" type="outline" onPress={() => this.props.onCancel()} />
        <Button title="Confirm" onPress={() => this.props.onSubmit({code: this.state.code, details: this.state.details})} />
      </View>
    )
  }
}

export default NewOrEditCourse;
