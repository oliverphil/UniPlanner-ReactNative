import React, {Fragment} from 'react';
import {DrawerActions} from "react-navigation-drawer";
import {Header, Icon} from "react-native-elements";
import Dashboard from "./Dashboard";
import Courses from "./courses/Courses"
import Tasks from "./tasks/Tasks"

/**
 * Return the view to populate the main app page.
 * @param props - props from AppView
 * @returns {*} - View to render.
 */
const getView = (props) => {
  const view = props.screenProps.view
  if(view === "Dashboard") {
    return (
      <Dashboard {...props} />
    )
  } else if(view === "Courses") {
    return (
      <Courses {...props} />
    )
  } else if(view === "Tasks") {
    return (
      <Tasks {...props} />
    )
  }
}

export class AppView extends React.Component{

  render() {
    return (
      <Fragment>
        <Header leftComponent={
          <Icon name="menu" onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())} />
        } centerComponent={{text: this.props.screenProps.view}} containerStyle={{
          paddingTop: 0
        }} />
        {getView(this.props)}
      </Fragment>
    )
  }
}
