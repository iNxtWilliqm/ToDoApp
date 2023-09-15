Vue.component("app-navigation", {
  template: `
    <nav>
      <ul class="nav-links">
        <li>
          <router-link to="/tasks" exact active-class="active-link"><i class="fa-solid fa-list"></i>Tasks</router-link>
        </li>
        <li>
          <router-link to="/statistics" exact active-class="active-link"><i class="fa-solid fa-chart-line"></i>Statistics</router-link>
        </li>
        <li>
          <router-link to="/achievements" exact active-class="active-link"><i class="fa-solid fa-award"></i>Achievements</router-link>
        </li>
        <li>
          <router-link to="/settings" exact active-class="active-link"><i class="fa-solid fa-gear"></i>Settings</router-link>
        </li>
      </ul>
    </nav>
  `,
});

const TasksComponent = {
  template: `
  <section id="tasks">
    <div class="user">
      Hello,
      <div class="name">
        <span class="editable" @click="toggleNameEditing">{{ editingName ? '' : username }}</span>
        <input
          class="name-input"
          v-if="editingName"
          v-model="editedName"
          @blur="saveEditedName"
          @keyup.enter="saveEditedName"
        />
      </div>
    </div>
    <div class="progress">
      TASKS PROGRESS
      <div class="bar-container">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <div class="input">
      Task Name
      <div>
        <input
          class="task-add"
          type="text"
          v-model="newTask"
          placeholder="Add a task..."
          maxlength="25"
        />
        <button class="btn-add" @click="addTask">Add</button>
      </div>
    </div>
    <div class="task-list">
      Your Tasks:
      <div class="task-item" v-for="(task, index) in tasks" :key="index">
        <span :class="{ completed: task.completed }">{{ task.name }}</span>
        <div class="task-settings">
          <button
            class="btn-done"
            @click="completeTask(index)"
            :disabled="task.completed"
          >
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="btn-delete" @click="deleteTask(index)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
  `,
  data() {
    const tasksCreated = parseInt(localStorage.getItem('tasksCreated'));
    const tasksCompleted = parseInt(localStorage.getItem('tasksCompleted'));
    const tasksDeleted = parseInt(localStorage.getItem('tasksDeleted'));
    return {
      username: "CLICK ME",
      editingName: false,
      editedName: "",
      tasks: [],
      totalTasks: 0,
      completedTasks: 0,
      tasksCreated: !isNaN(tasksCreated) ? tasksCreated : 0,
      tasksCompleted: !isNaN(tasksCompleted) ? tasksCompleted : 0,
      tasksDeleted: !isNaN(tasksDeleted) ? tasksDeleted : 0,
      points: parseInt(localStorage.getItem("points")) || 0,
      firstTaskCreated: localStorage.getItem('firstTaskCreated') === 'true',
    };
  },
  computed: {
    progress() {
      if (this.totalTasks === 0) {
        return 100;
      }
      return (this.completedTasks / this.totalTasks) * 100;
    },
  },
  methods: {
    toggleNameEditing() {
      this.editingName = !this.editingName;
      if (this.editingName) {
        this.editedName = this.username;
        this.$nextTick(() => {
          this.$refs.nameInput.focus();
        });
      }
    },
    saveEditedName() {
      if (this.editedName.trim() === "") {
        return;
      }
      this.username = this.editedName;
      this.editingName = false;
      localStorage.setItem("username", this.username);
    },
    addTask() {
      if (this.newTask.trim() === "") {
        alert("Please enter a task name.");
        return;
      }
      if (!this.firstTaskCreated) {
        localStorage.setItem('firstTaskCreated', 'true');
      }
      this.tasks.push({ name: this.newTask });
      this.newTask = "";
      this.totalTasks++;
      this.tasksCreated++;
      localStorage.setItem("tasksCreated", this.tasksCreated.toString());
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    completeTask(index) {
      if (!this.tasks[index].completed) {
        this.tasks[index].completed = true;
        this.points++;
      }
      this.completedTasks++;
      this.tasksCompleted++;
      localStorage.setItem("points", this.points.toString());
      localStorage.setItem("tasksCompleted", this.tasksCompleted.toString());
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    deleteTask(index) {
      if (this.tasks[index].completed) {
        this.completedTasks--;
      }
      this.tasks.splice(index, 1);
      this.totalTasks--;
      this.tasksDeleted++;
      localStorage.setItem("tasksDeleted", this.tasksDeleted.toString());
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    loadTasksFromLocalStorage() {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
        this.totalTasks = this.tasks.length;
        this.completedTasks = this.tasks.filter(task => task.completed).length;
      }
    },
  },
  mounted() {
    this.loadTasksFromLocalStorage();
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      this.username = savedUsername;
    }
    const firstTaskCreated = localStorage.getItem('firstTaskCreated');
    if (firstTaskCreated === 'true') {
      this.firstTaskCreated = true;
    }
  },
};

const StatisticsComponent = {
  template: `
    <div>
      <section id="statistics">
        <div class="stats">
          <h2>Statistics</h2>
          <div class="stat-item">
            Total Tasks Created: {{ tasksCreated }}
          </div>
          <div class="stat-item">
            Total Tasks Completed: {{ tasksCompleted }}
          </div>
          <div class="stat-item">
            Total Tasks Deleted: {{ tasksDeleted }}
          </div>
        </div>
      </section>
    </div>
  `,
  data() {
    return {
      tasksCreated: 0,
      tasksCompleted: 0,
      tasksDeleted: 0,
    };
  },
  mounted() {
    this.tasksCreated = parseInt(localStorage.getItem("tasksCreated")) || 0;
    this.tasksCompleted = parseInt(localStorage.getItem("tasksCompleted")) || 0;
    this.tasksDeleted = parseInt(localStorage.getItem("tasksDeleted")) || 0;
  },
};

const AchievementsComponent = {
  template: `
    <div>
      <section id="achievements">
        <fieldset class="points">
          <legend>Points</legend>
          <div class="value">{{ points }}</div>
        </fieldset>
        <fieldset class="badges">
          <legend>Badges</legend>
          <div class="wrapper">
            <div class="box" v-if="firstTaskCreated">
              <span class="badge"><i class="fa-solid fa-hand-fist"></i></span>
              <p class="badge-desc">{{ firstTaskMessage }}</p>
            </div>
            <div class="box">
              <span class="badge"><i class="fa-solid fa-question"></i></span>
              <p class="badge-desc"></p>
            </div>
            <div class="box">
              <span class="badge"><i class="fa-solid fa-question"></i></span>
              <p class="badge-desc"></p>
            </div>
            <div class="box">
              <span class="badge"><i class="fa-solid fa-question"></i></span>
              <p class="badge-desc"></p>
            </div>
            <div class="box">
              <span class="badge"><i class="fa-solid fa-question"></i></span>
              <p class="badge-desc"></p>
            </div>
            <div class="box">
              <span class="badge"><i class="fa-solid fa-question"></i></span>
              <p class="badge-desc"></p>
            </div>
          </div>
        </fieldset>
      </section>
    </div>
  `,
  data() {
    return {
      points: parseInt(localStorage.getItem("points")) || 0,
      firstTaskCreated: localStorage.getItem('firstTaskCreated'),
      firstTaskMessage: "Getting Started",
    };
  },
};

const SettingsComponent = {
  template: `
    <div>
      <section id="settings">
        <div class="preference">Preference</div>
        <div class="option">
          Themes
          <div class="themes">
            <input type="radio" name="theme" id="light" value="light" v-model="selectedTheme" @change="saveTheme" checked/>
            <input type="radio" name="theme" id="dark" value="dark" v-model="selectedTheme" @change="saveTheme" />
            <input type="radio" name="theme" id="brown" value="brown" v-model="selectedTheme" @change="saveTheme" />
            <input type="radio" name="theme" id="purple" value="purple" v-model="selectedTheme" @change="saveTheme" />
          </div>
        </div>
        <div class="option">
          Notification
          <div class="notifications">
            <input type="checkbox" name="notification" id="app" />App
            <input type="checkbox" name="notification" id="email" />Email
          </div>
        </div>
        <button id="clear-storage" @click="clearLocalStorage">Clear Local Storage</button>
      </section>
    </div>
  `,
  data() {
    return {
      selectedTheme: "",
    };
  },
  methods: {
    saveTheme() {
      localStorage.setItem("selectedTheme", this.selectedTheme);
    },
    clearLocalStorage() {
      localStorage.clear();
      alert("Local storage has been cleared.");
    },
  },
  mounted() {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      this.selectedTheme = savedTheme;
    }
  },
};

const router = new VueRouter({
  routes: [
    { path: "/tasks", component: TasksComponent },
    { path: "/statistics", component: StatisticsComponent },
    { path: "/achievements", component: AchievementsComponent },
    { path: "/settings", component: SettingsComponent },
  ],
});

new Vue({
  el: "#app",
  router,
});
