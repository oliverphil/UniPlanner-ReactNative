import React, { Component } from 'react';
import {ListItem, Text} from "react-native-elements";
import {View} from "react-native";

export class NavigatorUtil extends Component {

  render() {
    console.log(this.props)

    return (
      <View>
        <ListItem title="Dashboard" onPress={() => this.props.navigation.navigate('Dashboard')} />
        <ListItem title="Login" onPress={() => this.props.navigation.navigate('Login')}/>
      </View>
    );

    // return (
    //   <View>
    //     <ListItem title="Dashboard" onPress={this.props.navigation.navigate('Dashboard')} />
    //     <ListItem title="Login" onPress={this.props.navigation.navigate('Login')}/>
    //     <Text>Test</Text>
    //   </View>
    // )
  }
}
