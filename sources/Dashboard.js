import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import {userDetails} from './utils/FirebaseUtils'
import { Header } from 'react-native-elements'
import { DrawerActions } from 'react-navigation-drawer';


export default class Dashboard extends React.Component {
  render() {
    console.log(this.props)
    const currentUser = userDetails()
    return (
      <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email}!
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
