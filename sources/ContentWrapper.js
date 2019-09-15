import React, { Component } from 'react';
import { Header } from 'react-native-elements'
import {DrawerActions} from "react-navigation-drawer";

export default class ContentWrapper extends Component {


  render() {
    return (
      <React.Fragment>
        <Header leftComponent={{icon: 'menu', onPress: () => {
          console.log("toggle")
          this.props.navigation.dispatch(DrawerActions.toggleDrawer())
        }}} centerComponent={{text: "Dashboard"}}/>
        {this.props.component}
      </React.Fragment>
    )
  }
}
