import * as firebase from "react-native-firebase"
import AuthenticationService from "./FirebaseUtils";
import {UtilsService} from "./UtilsService";

const userDetails = () => {
  return AuthenticationService.userDetails()
}

export default class FirestoreService {

  classes = []
  courses = []
  classInfo = {}


  fetchCourseList() {
    let ret = firebase.firestore().collection('users').doc(userDetails().uid).collection('courses').get()
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

  async fetchTaskInfo(courseCode) {
    let tasks = []
    if(!userDetails())
      return tasks;
    await firebase.firestore().collection('users').doc(userDetails().uid).collection('courses').doc(courseCode).collection('tasks').get()
      .then(tsk => {
        tsk.docs.forEach(doc => {
          let data = doc.data()
          data.id = doc.id
          let date = data.dueDate
          data.dueDate = new Date(date)
          tasks.push(data)
        })
      })
    return tasks
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

  async fetchAllTasks() {
    let courses = this.fetchCourseList()
    let courseDocs = await courses.then(res => {
      return res.docs
    })
    let docs = []
    courseDocs.forEach(doc => {
      docs.push(doc.data())
    })

    let tasks = []
    for(let course of docs) {
      let task = await this.fetchTaskInfo(course.code).then(res => {
        return res
      })
      let date = task.dueDate
      task.dueDate = new Date(date)
      tasks = tasks.concat(task)
    }
    return tasks
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

  addTask(data) {
    let col = firebase.firestore().collection('users').doc(userDetails().uid).collection('courses').doc(data.code).collection('tasks')
    let dueDate = data.dueDate
    data.dueDate = dueDate.toString()
    return col.add(data)
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

  fetchTasksToday() {
    return this.fetchAllTasks().then(tasks => {
      let today = []
      let todayDate = new Date(Date.now())
      tasks.forEach(task => {
        let taskDate = new Date(task.dueDate)
        if(taskDate.getDate() === todayDate.getDate()
        && taskDate.getMonth() === todayDate.getMonth()
        && taskDate.getFullYear() === todayDate.getFullYear()){
          task.dueDate = new Date(task.dueDate)
          today.push(task)
        }
      })
      return today
    })
  }

  fetchTasksLater() {
    return this.fetchAllTasks().then(tasks => {
      let later = []
      let todayDate = new Date(Date.now())
      tasks.forEach(task => {
        let taskDate = new Date(task.dueDate)
        if(taskDate.getFullYear() > todayDate.getFullYear()){
          later.push(task)
        } else if(task.getFullYear() === todayDate.getFullYear()){
          if(taskDate.getMonth() > todayDate.getMonth()){
            later.push(task)
          } else if(taskDate.getMonth() === todayDate.getMonth()){
            if(taskDate.getDate() > todayDate.getDate()){
              later.push(task)
            }
          }
        }
      })
      return later
    })
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

  deleteTask(task) {
    return firebase.firestore().collection('users').doc(userDetails().uid).collection('courses')
      .doc(task.code).collection('tasks').doc(task.id).delete()
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

  editTask(tsk) {
    let dueDate = new Date(tsk.dueDate)
    let editedTask = {...tsk}
    editedTask.dueDate = editedTask.dueDate.toString()
    return firebase.firestore().collection('users').doc(userDetails().uid).collection('courses')
      .doc(tsk.code).collection('tasks').doc(tsk.id).set(editedTask).then(res => {
        return true
      }, err => {
        return false
      })
  }
}
