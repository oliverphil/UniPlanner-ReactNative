import React from 'react'
import {StyleSheet, Platform, Image, Text, View, ScrollView, SafeAreaView} from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { NavigatorUtil } from './sources/utils/NavigatorUtil'

// import the different screens
import Loading from './sources/utils/Loading'
import Register from './sources/authentication/Register'
import Login from './sources/authentication/Login'
import Dashboard from './sources/Dashboard'

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <NavigatorUtil {...props} />
    </SafeAreaView>
  </ScrollView>
);

// create our app's navigation stack
const App = createDrawerNavigator(
  {
    Loading: Loading,
    Register: Register,
    Login: Login,
    Dashboard: Dashboard
  },
  {
    initialRouteName: 'Login',
    drawerType: 'slide',
    contentComponent: CustomDrawerContentComponent
  }
)
export default createAppContainer(App)
