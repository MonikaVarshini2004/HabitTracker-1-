const habitList = document.getElementById('habitList');
const addHabitBtn = document.getElementById('addHabitBtn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const themeToggle = document.getElementById('themeToggle');

let editIndex = null;
let habits = [];

// Load habits from localStorage (optional persistence)
if (localStorage.getItem('habits')) {
  habits = JSON.parse(localStorage.getItem('habits'));
  renderHabits();
}

// 🌗 Dark/Light Mode Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// ➕ Open Modal
addHabitBtn.addEventListener('click', () => {
  document.getElementById('habitTitle').value = '';
  document.getElementById('habitDesc').value = '';
  document.getElementById('habitAim').value = '';
  document.getElementById('habitDate').value = '';
  document.getElementById('habitFreq').value = 'daily';
  document.getElementById('modalTitle').innerText = 'Add New Habit';
  editIndex = null;
  modal.classList.add('flex');
});

// ❌ Cancel Modal
cancelBtn.addEventListener('click', () => {
  modal.classList.remove('flex');
});

// 💾 Save or Update Habit
saveBtn.addEventListener('click', () => {
  const title = document.getElementById('habitTitle').value.trim();
  const desc = document.getElementById('habitDesc').value.trim();
  const aim = document.getElementById('habitAim').value.trim();
  const date = document.getElementById('habitDate').value;
  const freq = document.getElementById('habitFreq').value;

  if (!title || !desc || !aim || !date) {
    alert('Please fill in all fields!');
    return;
  }

  const habit = { title, desc, aim, date, freq, status: 'pending' };

  if (editIndex !== null) {
    habits[editIndex] = habit;
  } else {
    habits.push(habit);
  }

  renderHabits();
  modal.classList.remove('flex');
  saveToLocal();
});

// 🧩 Render Habit Cards
function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const card = document.createElement('li');
    card.className = 'habit-card';
    card.innerHTML = `
      <h3>${habit.title}</h3>
      <p>${habit.desc}</p>
      <p><strong>Aim:</strong> ${habit.aim}</p>
      <p><strong>Date:</strong> ${habit.date}</p>
      <p><strong>Frequency:</strong> ${habit.freq}</p>
      <p><strong>Status:</strong> <span class="status">${habit.status}</span></p>
      <div class="habit-actions">
        <div class="left-btns">
          <button onclick="updateStatus(${index}, 'done')" class="done-btn">Done</button>
          <button onclick="updateStatus(${index}, 'skipped')" class="skip-btn">Skipped</button>
          <button onclick="updateStatus(${index}, 'missed')" class="miss-btn">Missed</button>
        </div>
        <div class="right-btns">
          <button onclick="editHabit(${index})" class="edit-btn">Edit</button>
          <button onclick="deleteHabit(${index})" class="delete-btn">Delete</button>
        </div>
      </div>
    `;
    habitList.appendChild(card);
  });
}

// ✅ Update Status
window.updateStatus = function (index, status) {
  habits[index].status = status;
  renderHabits();
  saveToLocal();
};

// ✏️ Edit Habit
window.editHabit = function (index) {
  const habit = habits[index];
  document.getElementById('habitTitle').value = habit.title;
  document.getElementById('habitDesc').value = habit.desc;
  document.getElementById('habitAim').value = habit.aim;
  document.getElementById('habitDate').value = habit.date;
  document.getElementById('habitFreq').value = habit.freq;
  document.getElementById('modalTitle').innerText = 'Edit Habit';
  editIndex = index;
  modal.classList.add('flex');
};

// 🗑️ Delete Habit
window.deleteHabit = function (index) {
  if (confirm('Are you sure you want to delete this habit?')) {
    habits.splice(index, 1);
    renderHabits();
    saveToLocal();
  }
};

// 💾 Save habits to localStorage
function saveToLocal() {
  localStorage.setItem('habits', JSON.stringify(habits));
}
