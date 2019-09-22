import React from 'react';
import {ListItem, Icon} from "react-native-elements";
import {View} from "react-native";
import {DrawerActions} from "react-navigation-drawer";

const updateNav = (props, target) => {
  console.log(props)
  props.screenProps.updateFunc(target)
  if(target !== 'Login'){
    props.navigation.dispatch(DrawerActions.toggleDrawer())
  }
}

export const NavigatorUtil = props => (
  <View>
    <ListItem leftAvatar={
      <Icon name='close' onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}/>
    } onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())} bottomDivide />
    <ListItem title="Dashboard" leftAvatar={
      <Icon name='home' onPress={() => updateNav(props, 'Dashboard')} />
    } onPress={() => updateNav(props, 'Dashboard')} />
    <ListItem title="Courses" leftAvatar={
      <Icon name='list' onPress={() => updateNav(props, 'Courses')} />
    } onPress={() => updateNav(props, 'Courses')} />
    <ListItem title="Tasks" leftAvatar={
      <Icon name='check-box' onPress={() => updateNav(props, 'Tasks')} />
    } onPress={() => updateNav(props, 'Tasks')} />
  </View>
)
