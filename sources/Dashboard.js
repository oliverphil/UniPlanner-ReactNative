import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import {userDetails} from './utils/FirebaseUtils'
import { Header } from 'react-native-elements'
import { DrawerActions } from 'react-navigation-drawer';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: userDetails()
    }

    console.log(this.state.currentUser)
  }

  render() {
    const { currentUser } = this.state
    return (
      <React.Fragment>
        <Header leftComponent={{icon: 'menu', onPress: () => {
            console.log("toggle")
            this.props.navigation.dispatch(DrawerActions.toggleDrawer())
          }}} centerComponent={{text: "Dashboard"}}/>
        <View style={styles.container}>
          <Text>
            Hi {currentUser && currentUser.email}!
          </Text>
        </View>
      </React.Fragment>
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
