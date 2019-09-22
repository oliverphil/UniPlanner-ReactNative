import * as firebase from "react-native-firebase"
import AuthenticationService from "./FirebaseUtils";
import {UtilsService} from "./UtilsService";

const userDetails = () => {
  return AuthenticationService.userDetails()
}

export default class FirestoreService {

  classes = []
  courses = [
    {
      details: "Secure Programming",
      code: "CYBR271"
    },
    {
      details: "Database Systems",
      code: "SWEN304"
    },
    {
      details: "Mobile Application Development",
      code: "SWEN325"
    }
  ] //TODO: Remove this data
  classInfo = {}


  fetchCourseList() {
    let ret = firebase.firestore().collection(`/users/${userDetails().uid}/courses/`).get()
    console.log(ret);
    ret.then(res => {
      let courses = []
      res.docs.forEach(doc => {
        courses.push(doc.data());
      })
      this.courses = courses
    }).catch(err => {
      console.log(err);
    })
    return ret
  }

  fetchCourseListNow() {
    return this.courses;
  }

  async fetchClassInfo(courseCode) {
    let classes = []
    if (!userDetails())
      return classes;
    await firebase.firestore().collection(`/users/${userDetails().uid}/courses/${courseCode}/classes`).get()
      .then(cls => {
        cls.docs.forEach(doc => {
          let data = doc.data()
          data.id = doc.id
          classes.push(data)
        })
      })
    this.classInfo[courseCode] = classes
    return classes
  }

  fetchClassInfoNow(courseCode) {
    return this.classInfo[courseCode]
  }

  async fetchAllClasses() {
    let courses = this.fetchCourseList();
    let courseDocs = await courses.then(result => {
      return result.docs
    })
    let docs = []
    courseDocs.forEach(doc => {
      docs.push(doc.data())
    })
    let classes = []
    for (let course of docs) {
      let cls = await this.fetchClassInfo(course.code).then(result => {
        return result
      })
      classes = classes.concat(cls)
    }
    this.classes = classes
    return classes
  }

  fetchAllClassesNow() {
    return this.classes
  }

  async addCourse(data) {
    console.log(data);
    let col = await firebase.firestore().collection('users').doc(userDetails().uid).collection('courses')
    let doc = await col.doc(data.code).get()
    console.log(doc)
    if (!doc.exists) {
      return await col.doc(data.code).set(data)
        .then(res => {
          this.courses.push(data)
          return true;
        }).catch(err => {
          return false;
        })
    } else {
      return false;
    }
  }

  addClass(data) {
    let col = firebase.firestore().collection(`/users/${userDetails().uid}/courses/${data.code}/classes`)
    let startTime = new Date(data.startTime)
    let endTime = new Date(data.endTime)
    data.startTime = (startTime.getHours() * 100) + startTime.getMinutes()
    data.endTime = (endTime.getHours() * 100) + endTime.getMinutes()
    col.add(data).then(res => {
      this.classes.push(data)
      this.classInfo[data.code] = data
    })
  }

  editCourse(data) {
    return firebase.firestore().collection('users').doc(userDetails().uid).collection('courses')
      .doc(data.code).set(data).then(res => {
        return true
      }, err => {
        return false
      });
  }

  async fetchClassesToday() {
    let allClasses = await this.fetchAllClasses()
    return this.whichClassesToday(allClasses)
  }

  fetchClassesTodayNow() {
    return this.whichClassesToday(this.fetchAllClassesNow())
  }

  whichClassesToday(allClasses) {
    let today = new Date(Date.now())
    let todayClasses = []
    for (let cls of allClasses) {
      if (FirestoreService.isClassOnDate(cls, today)) {
        todayClasses.push(cls)
      }
    }
    return todayClasses;
  }

  static isClassOnDate(cls, date: Date): boolean {
    let dayNum = date.getDay()
    for (let day of cls.day) {
      let thisDayNum
      switch (day) {
        case "monday":
          thisDayNum = 1;
          break;
        case "tuesday":
          thisDayNum = 2;
          break;
        case "wednesday":
          thisDayNum = 3;
          break;
        case "thursday":
          thisDayNum = 4;
          break;
        case "friday":
          thisDayNum = 5;
          break;
        case "saturday":
          thisDayNum = 6;
          break;
        default:
          thisDayNum = 0;
      }
      if (thisDayNum === dayNum)
        return true;
    }

    return false;
  }

  async deleteCourse(code) {
    console.log(code)
    this.courses = this.courses.filter(val => {
      return val.id !== code
    })
    this.classes = this.classes.filter(val => {
      return val.code !== code
    })
    delete this.classInfo[code]
    firebase.firestore().collection('users').doc(userDetails().uid).collection('courses').doc(code).delete()
  }

  async deleteClass(cls) {
    this.classes = this.classes.filter(val => {
      return val.id !== cls.id
    })
    let course = this.classInfo[cls.code]
    this.classInfo[cls.code] = course.filter(val => {
      return val.id !== cls.id
    })
    firebase.firestore().doc(`/users/${userDetails().uid}/courses/${cls.code}/classes/${cls.id}`).delete()
  }

  editClass(cls) {
    let startTime = new Date(cls.startTime)
    let endTime = new Date(cls.endTime)
    let editedClass = {...cls}
    editedClass.startTime = Number((startTime.getHours() * 100) + startTime.getMinutes())
    editedClass.endTime = Number((endTime.getHours() * 100) + endTime.getMinutes())
    this.classes = this.classes.filter(val => {
      return val.id !== cls.id
    })
    this.classes.push(editedClass)
    this.classInfo[cls.code] = this.classInfo[cls.code].filter(val => {
      return val.id !== cls.id
    })
    this.classInfo[cls.code].push(editedClass)
    return firebase.firestore().collection(`/users/${userDetails().uid}/courses/${cls.code}/classes/`)
      .doc(cls.id).set(editedClass).then(res => {
        return true
      }, err => {
        return false
      })
  }
}
