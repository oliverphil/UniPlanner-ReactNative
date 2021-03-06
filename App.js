import React, {useState, Component, ReactDOM} from 'react'
import {StyleSheet, Platform, Image, Text, View, ScrollView, SafeAreaView, YellowBox} from 'react-native'
import { createAppContainer } from 'react-navigation'
import {createDrawerNavigator, DrawerActions, DrawerNavigatorItems} from 'react-navigation-drawer'
import { NavigatorUtil } from './sources/utils/NavigatorUtil'

// import the different screens
import Loading from './sources/utils/Loading'
import Register from './sources/authentication/Register'
import Login from './sources/authentication/Login'
import Dashboard from './sources/Dashboard'
import { AppView } from './sources/AppView'
import DrawerNavigator from "react-navigation-drawer/src/navigators/createDrawerNavigator";
import FirestoreService from "./sources/utils/FirestoreService";

const storage = new FirestoreService();

const CustomDrawerContentComponent = props => {
  return (
  <ScrollView>
    <SafeAreaView
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <NavigatorUtil {...props} view={this.view}/>
    </SafeAreaView>
  </ScrollView>
  )
};



// const updateView = view => {
//   this.view = view;
// }

// create our app's navigation stack
const Drawer = createAppContainer(createDrawerNavigator(
    {
      Loading: {
        screen: (props) => <Loading {...props} view={props.screenProps.view} updateFunc={props.screenProps.updateFunc} />
      },
      Register: Register,
      Login: {
        screen: (props) => <Login {...props} updateFunc={props.screenProps.updateFunc} />
      },
      Main: {
        screen: (props) => <AppView {...props} view={props.screenProps.view} updateFunc={props.screenProps.updateFunc} />
      }
    },
    {
      initialRouteName: 'Login',
      drawerType: 'slide',
      contentComponent: CustomDrawerContentComponent
    }
  )
)

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      view: 'Login'
    }

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated'
    ])
  }

  updateView(view){
    this.setState({view: view})
  }

  render() {
    return <Drawer {...this.props} updateFunc={this.updateView.bind(this)} screenProps={
      {
        updateFunc: this.updateView.bind(this),
        view: this.state.view,
        storage: storage
      }
    } />
  }
}

export default App
