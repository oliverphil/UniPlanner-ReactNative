import React, {Fragment} from 'react';
import {DrawerActions} from "react-navigation-drawer";
import {Header, Icon} from "react-native-elements";
import Dashboard from "./Dashboard";
import Courses from "./courses/Courses"

const getView = (props) => {
  console.log(props)
  const view = props.screenProps.view
  if(view === "Dashboard") {
    console.log('Dashboard')
    return (
      <Dashboard {...props} />
    )
  } else if(view === "Courses") {
    console.log('Courses')
    return (
      <Courses {...props} />
    )
  }
  console.log(view)
}

// export const AppView = props => {
//   console.log(props);
//   return (
//     <Fragment>
//       <Header leftComponent={
//         <Icon name="menu" onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())} />
//       } centerComponent={{text: props.view}} containerStyle={{
//         paddingTop: 0
//       }} />
//       {getView(props)}
//     </Fragment>
//   )
// }

export class AppView extends React.Component{

  render() {
    console.log(this.props)
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
