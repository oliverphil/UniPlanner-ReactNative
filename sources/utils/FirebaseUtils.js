import * as firebase from "react-native-firebase";

export default class AuthenticationService {

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
    // return new Promise<any>((res) => {
    //   return create
    // })
    return create
  }

  static logout() {
    firebase.auth().signOut()
  }


  static logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
          .then(() => {
            console.log("Log Out");
            resolve();
          }).catch((error) => {
          reject();
        });
      }
    })
  }

  static userDetails() {
    return firebase.auth().currentUser;
  }

  static loginUser(value) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

}



