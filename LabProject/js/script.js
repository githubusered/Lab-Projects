// ***************************** Javascript for registration ****************************//

let students = {
  id: 0,
  name: '',
  email: '',
  username: '',
  password: '',
  passwordconfirm: '',
}

function registration() {
  let name = document.getElementById("firstname").value;
  let email = document.getElementById("email").value;
  let uname = document.getElementById("username").value;
  let pwd = document.getElementById("password").value;
  let cpwd = document.getElementById("passwordconfirm").value;
  students.name = name;
  students.email = email;
  students.username = uname;
  students.password = pwd;
  students.passwordconfirm = cpwd;
  //email id expression code
  let pwd_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  let letters = /^[A-Za-z]+$/;
  let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (name == '') {
    alert('Please enter your name');
    return;
  } else if (!letters.test(name)) {
    alert('Name field required only alphabet characters');
    return;
  } else if (email == '') {
    alert('Please enter your Admin email id');
    return;
  } else if (!filter.test(email)) {
    alert('Invalid email');
    return;
  } else if (uname == '') {
    alert('Please enter the user name.');
    return;
  } else if (!letters.test(uname)) {
    alert('User name field required only alphabet characters');
    return;
  } else if (pwd == '') {
    alert('Please enter Password');
    return;
  } else if (cpwd == '') {
    alert('Enter Confirm Password');
    return;
  } else if (!pwd_expression.test(pwd)) {
    alert('Upper case, Lower case, Special character and Numeric letter are required in Password filed');
    return;
  } else if (pwd != cpwd) {
    alert('Password not Matched');
    return;
  } else if (document.getElementById("passwordconfirm").value.length < 6) {
    alert('Password minimum length is 6');
    return;
  } else if (document.getElementById("passwordconfirm").value.length > 12) {
    alert('Password max length is 12');
    return;
  }
  let arr = [];
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes("student")) {
      let studentsRecords = JSON.parse(localStorage.getItem(`${localStorage.key(i)}`));
      arr.push(studentsRecords)
    }
  }
  let st = arr.find(student => student.email == email)
  if (st) {
    alert('Admin alredy exist');
    return;
  }

  if (students.name && students.email && students.username && students.password && students.passwordconfirm) {
    if (localStorage.getItem("last_id")){
      students.id = +localStorage.getItem("last_id") + 1;
      
    }else {
      
      students.id = 0;
    }
    localStorage.setItem(`admin_${students.id}`, JSON.stringify(students));
    localStorage.setItem("last_id", students.id.toString());
    location.href === "../log.html"
  }

}

function clearRegForm() {
  document.getElementById("firstname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("passwordconfirm").value = "";
}



// ***************************** Javascript for login  ****************************//

function login() {
  let emailVal = document.getElementById('logemail').value;
  let passwordVal = document.getElementById('logpassword').value;

  let arr = [];
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes('student')) {
      let studentsRecords = JSON.parse(localStorage.getItem(`${localStorage.key(i)}`));
      arr.push(studentsRecords)
    }
  }
  for (let i = 0; i < arr.length; i++) {
    for (const k in arr[i]) {
      if (k === "email" && emailVal === arr[i].email && passwordVal === arr[i].password) {

        const tasksPage = document.createElement("a");
        tasksPage.href = "tasks.html"
        tasksPage.click()
        tasksPage.remove();
      }

    }

  }

}

function clearLogForm() {
  document.getElementById("logemail").value = "";
  document.getElementById("logpassword").value = "";
}

// ***************************** Javascript for tasks  ****************************//

// On app load, get all tasks from localStorage
window.onload = loadTasks;

// On form submit add task
document.querySelector("#fform").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // check if localStorage has any tasks
  // if not then return
  if (localStorage.getItem("tasks") == null) return;

  // Get the tasks from localStorage and convert it to an array
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  //Condition If location is for admin , to show trash else not
  // Loop through the tasks and add them to the list 
  if (location.href == "http://127.0.0.1:5500/tasks.html" || location.href == "../tasks.html") {
    tasks.forEach(task => {
      const list = document.querySelector("ul");
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
        <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
        <i class="fa fa-trash" onclick="removeTask(this)">&#128465</i>`;
      if (list)
        list.insertBefore(li, list.children[0]);
    });
  } else {
    tasks.forEach(task => {
      const list = document.querySelector("ul");
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
        <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
        `;
      if (list)
        list.insertBefore(li, list.children[0]);
    });
  }
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  // return if task is empty
  if (task.value === "") {
    alert("Please add some task!");
    return false;
  }
  // check is task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }

  // add task to local storage
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false }]));

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
  <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
  <i class="fa fa-trash" onclick="removeTask(this)">&#128465</i>`;
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
  currentTask = event.value;
}

// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // check if task is empty
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // task already exist
  tasks.forEach(task => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = currentTask;
      return;
    }
  });
  // update task
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addDone() {
  let tasksRecords = JSON.parse(localStorage.getItem(`tasks`));
  const list = document.querySelector("#doneUl");
  const li = document.createElement("li");
  for (let i = 0; i < tasksRecords.length; i++) {
    if (tasksRecords[i].completed === true) {
      li.innerHTML = `<input type="text" value="${tasksRecords[i].task}" class="task ${tasksRecords[i].completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">`;
      list.insertBefore(li, list.children[0]);
    }
  }

}
// *********************   Javascript for Studentmain.html     ****************//

function vfCodeSet() {
  const verificationCode = document.getElementById('vfCode').value;
  if (verificationCode == "") {
    alert('write some code');
  } else {
    localStorage.setItem('verificationCode', verificationCode);
  }

}
function checkVFCode() {
  const vfcodeRecord = localStorage.getItem('verificationCode');
  const chkverification = document.getElementById("chkverification").value;
  if (chkverification == vfcodeRecord) {
    const studentmain = document.createElement("a");
    studentmain.href = "studentmain.html"
    studentmain.click()
    studentmain.remove();
  } else {
    chkverification = ""
  }

}