import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import AuthenticationService from "../utils/FirebaseUtils";

export default class SignUp extends React.Component {

  state = {
    email: '',
    password: '',
    validate: '',
    errorMessage: null
  }

  handleSignUp = () => {
    console.log(AuthenticationService)
    AuthenticationService.registerUser(this.state).then(res => {
      this.props.navigation.navigate('Login')
    }).catch(err => {
      console.log(err)
    })
  }

  validatePassword = () => {
    return this.state.password === this.state.validate;
  }

  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <Text>Sign Up</Text>
          {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <TextInput
            secureTextEntry
            placeholder="Confirm Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({validate: password})}
            value={this.state.validate} />
        </View>
        <View>
          <Button title="Sign Up" onPress={this.handleSignUp} disabled={this.state.email == '' || this.state.password == '' || !this.validatePassword()}/>
          <Button
            title="Already have an account? Login"
            onPress={() => this.props.navigation.navigate('Login')}
          />
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
    marginTop: 8
  }
})
