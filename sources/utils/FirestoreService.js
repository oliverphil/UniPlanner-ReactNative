import * as firebase from "react-native-firebase"
import AuthenticationService from "./FirebaseUtils";

const userDetails = () => {
  return AuthenticationService.userDetails()
}

export default class FirestoreService {

  courses = []

  /**
   * Fetch the course list from firestore.
   * @returns {Promise<QuerySnapshot>}
   */
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

  /**
   * Fetch the cached course list.
   * @returns {[]} - a list of courses which has been cached locally.
   */
  fetchCourseListNow() {
    return this.courses;
  }

  /**
   * Fetch the list of tasks for a course.
   * @param courseCode - the course to fetch tasks for.
   * @returns {Promise<[]>}
   */
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

  /**
   * Fetch all the tasks for this user.
   * @returns {Promise<[]>}
   */
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

  /**
   * Add a course to firestore.
   * @param data - the course to add.
   * @returns {Promise<boolean>}
   */
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

  /**
   * Add a task to firestore.
   * @param data - the task to add.
   * @returns {Promise<DocumentReference>}
   */
  addTask(data) {
    let col = firebase.firestore().collection('users').doc(userDetails().uid).collection('courses').doc(data.code).collection('tasks')
    let dueDate = data.dueDate
    data.dueDate = dueDate.toString()
    return col.add(data)
  }

  /**
   * Edit a course.
   * @param data - the new values to update.
   * @returns {Promise<boolean>}
   */
  editCourse(data) {
    return firebase.firestore().collection('users').doc(userDetails().uid).collection('courses')
      .doc(data.code).set(data).then(res => {
        return true
      }, err => {
        return false
      });
  }

  /**
   * Fetch all the tasks due today.
   * @returns {Promise<any>|Promise<[]>}
   */
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

  /**
   * Fetch all the tasks due after today.
   * @returns {Promise<any>|Promise<[]>}
   */
  fetchTasksLater() {
    return this.fetchAllTasks().then(tasks => {
      let later = []
      let todayDate = new Date(Date.now())
      tasks.forEach(task => {
        let taskDate = new Date(task.dueDate)
        if(taskDate.getFullYear() > todayDate.getFullYear()){
          later.push(task)
        } else if(taskDate.getFullYear() === todayDate.getFullYear()){
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

  /**
   * Delete a course from firestore.
   * @param code - the course code to remove.
   * @returns {Promise<void>}
   */
  async deleteCourse(code) {
    this.courses = this.courses.filter(val => {
      return val.id !== code
    })
    firebase.firestore().collection('users').doc(userDetails().uid).collection('courses').doc(code).delete()
  }

  /**
   * Delete a course from firestore.
   * @param task - the task to remove.
   * @returns {Promise<void>}
   */
  deleteTask(task) {
    return firebase.firestore().collection('users').doc(userDetails().uid).collection('courses')
      .doc(task.code).collection('tasks').doc(task.id).delete()
  }

  /**
   * Edit a task in firestore.
   * @param tsk - the new values to update.
   * @returns {Promise<boolean>}
   */
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
