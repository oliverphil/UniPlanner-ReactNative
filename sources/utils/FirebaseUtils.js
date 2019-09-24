import * as firebase from "react-native-firebase";

export default class AuthenticationService {

  /**
   * Register a user in firebase authentication.
   * @param value - {email, password}
   * @returns {Promise<boolean>}
   */
  static async registerUser(value) {
    let {email, password} = value

    let create = await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((newUserCredentials) => {
        firebase.firestore()
          .doc('users').collection(newUserCredentials.user.uid)
          .set({email})
        return true
      })
      .catch(err => {
        return false;
      })
    return create
  }

  /**
   * Logout a user.
   */
  static logout() {
    firebase.auth().signOut()
  }

  /**
   * Fetch the user details.
   * @returns {OrNull<User>}
   */
  static userDetails() {
    return firebase.auth().currentUser;
  }

  /**
   * Login a user.
   * @param value - {email, password}
   * @returns {Promise<R>}
   */
  static loginUser(value) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

}



