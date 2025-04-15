let experiments = [];
let currentExperimentId = null;

function loadData() {
  const data = localStorage.getItem('tiny-experiments');
  if (data) {
    experiments = JSON.parse(data);
  } else {
    experiments = [];
  }
}

function saveData() {
  localStorage.setItem('tiny-experiments', JSON.stringify(experiments));
}

function renderExperimentList() {
  const list = document.getElementById('experiment-list-ul');
  list.innerHTML = '';
  experiments.forEach(exp => {
    const li = document.createElement('li');
    li.textContent = `${exp.title} (Gestartet: ${exp.startDate})`;
    li.addEventListener('click', () => showExperimentDetails(exp.id));
    list.appendChild(li);
  });
}

function showExperimentDetails(id) {
  const exp = experiments.find(e => e.id === id);
  if (!exp) return;
  currentExperimentId = id;
  document.getElementById('experiment-list').style.display = 'none';
  document.getElementById('experiment-details').style.display = 'block';
  document.getElementById('details-title').value = exp.title;
  document.getElementById('details-description').value = exp.description;
  document.getElementById('details-start-date').value = exp.startDate;
  document.getElementById('details-end-date').value = exp.endDate || '';
  renderLogs(exp.logs);
  document.getElementById('details-reflection').value = exp.reflection || '';
}

function renderLogs(logs) {
  const table = document.getElementById('logs-table');
  table.innerHTML = '<tr><th>Datum</th><th>Erledigt</th><th>Notizen</th></tr>';
  logs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${log.date}</td><td>${log.completed ? '✓' : '✗'}</td><td>${log.notes}</td>`;
    table.appendChild(tr);
  });
}

document.getElementById('add-experiment').addEventListener('click', () => {
  document.getElementById('experiment-list').style.display = 'none';
  document.getElementById('new-experiment').style.display = 'block';
});

document.getElementById('cancel-new').addEventListener('click', () => {
  document.getElementById('new-experiment').style.display = 'none';
  document.getElementById('experiment-list').style.display = 'block';
});

document.getElementById('create-experiment').addEventListener('click', () => {
  const title = document.getElementById('new-title').value;
  const description = document.getElementById('new-description').value;
  const startDate = document.getElementById('new-start-date').value;
  const endDate = document.getElementById('new-end-date').value;
  if (title && startDate) {
    const id = Date.now();
    const newExp = {
      id,
      title,
      description,
      startDate,
      endDate,
      logs: [],
      reflection: ''
    };
    experiments.push(newExp);
    saveData();
    renderExperimentList();
    document.getElementById('new-experiment').style.display = 'none';
    document.getElementById('experiment-list').style.display = 'block';
    showExperimentDetails(id);
  } else {
    alert('Bitte Titel und Startdatum eingeben.');
  }
});

document.getElementById('save-experiment').addEventListener('click', () => {
  const exp = experiments.find(e => e.id === currentExperimentId);
  if (exp) {
    exp.title = document.getElementById('details-title').value;
    exp.description = document.getElementById('details-description').value;
    exp.startDate = document.getElementById('details-start-date').value;
    exp.endDate = document.getElementById('details-end-date').value;
    exp.reflection = document.getElementById('details-reflection').value;
    saveData();
    renderExperimentList();
  }
});

document.getElementById('delete-experiment').addEventListener('click', () => {
  if (confirm('Möchtest du dieses Experiment wirklich löschen?')) {
    experiments = experiments.filter(e => e.id !== currentExperimentId);
    saveData();
    document.getElementById('experiment-details').style.display = 'none';
    document.getElementById('experiment-list').style.display = 'block';
    renderExperimentList();
  }
});

document.getElementById('back-to-list').addEventListener('click', () => {
  document.getElementById('experiment-details').style.display = 'none';
  document.getElementById('experiment-list').style.display = 'block';
});

document.getElementById('add-log').addEventListener('click', () => {
  const date = document.getElementById('log-date').value;
  const completed = document.getElementById('log-completed').checked;
  const notes = document.getElementById('log-notes').value;
  const exp = experiments.find(e => e.id === currentExperimentId);
  if (exp && date) {
    exp.logs.push({ date, completed, notes });
    saveData();
    renderLogs(exp.logs);
    document.getElementById('log-date').value = '';
    document.getElementById('log-completed').checked = false;
    document.getElementById('log-notes').value = '';
  } else {
    alert('Bitte ein Datum auswählen.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderExperimentList();
});
