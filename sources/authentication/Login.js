import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import AuthenticationService from '../utils/FirebaseUtils'

export default class Login extends React.Component {

  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {

    AuthenticationService.loginUser(this.state).then(res => {
      this.props.screenProps.updateFunc('Dashboard')
      this.props.navigation.navigate('Main')
    }).catch(err => {
      this.setState({errorMessage: err.message})
    })
  }

  render() {
    console.log(AuthenticationService)
    return (
      <React.Fragment>
        <View style={styles.container}>

          <Text>Login</Text>
          {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        <View>
          <Button id="login" title="Login" onPress={this.handleLogin} />
          {/*<Button*/}
          {/*  title="Don't have an account? Sign Up"*/}
          {/*  onPress={() => this.props.navigation.navigate('Register')}*/}
          {/*/>*/}
          <Button id="register" title="Register" onPress={() => this.props.navigation.navigate('Register')} />
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
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    paddingLeft: '5%'
  }
})
