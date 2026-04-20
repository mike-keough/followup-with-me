/* ============================================
   RealCRM — Application Logic (app.js)
   No build tools required — vanilla JS
   ============================================ */

'use strict';

// ============================================================
// DATA LAYER — LocalStorage persistence
// ============================================================

const DB = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem('realcrm_' + key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val) {
    localStorage.setItem('realcrm_' + key, JSON.stringify(val));
  }
};

const AVATAR_COLORS = [
  '#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#ec4899','#06b6d4','#f97316','#84cc16','#6366f1'
];

function getAvatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d}d ago`;
}

function daysSince(iso) {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ============================================================
// SEED DATA
// ============================================================

const SEED_PEOPLE = [
  { id: newId(), firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@gmail.com', phone: '(555) 234-5678', stage: 'Active Buyer', source: 'Zillow', type: 'Buyer', price: '$400k - $600k', tags: ['Hot Lead', 'Pre-approved'], createdAt: new Date(Date.now() - 5*86400000).toISOString(), lastActivity: new Date(Date.now() - 1*86400000).toISOString(), notes: [], category: 'lead' },
  { id: newId(), firstName: 'Mike', lastName: 'Ramirez', email: 'mike.r@outlook.com', phone: '(555) 345-6789', stage: 'Appointment Set', source: 'Referral', type: 'Buyer', price: '$250k - $350k', tags: ['First-time Buyer'], createdAt: new Date(Date.now() - 12*86400000).toISOString(), lastActivity: new Date(Date.now() - 2*86400000).toISOString(), notes: [], category: 'prospect' },
  { id: newId(), firstName: 'Emily', lastName: 'Chen', email: 'emily.chen@icloud.com', phone: '(555) 456-7890', stage: 'Under Contract', source: 'Website', type: 'Buyer', price: '$500k - $700k', tags: ['VIP', 'Cash Buyer'], createdAt: new Date(Date.now() - 30*86400000).toISOString(), lastActivity: new Date(Date.now() - 0*86400000).toISOString(), notes: [], category: 'active' },
  { id: newId(), firstName: 'David', lastName: 'Williams', email: 'david.w@yahoo.com', phone: '(555) 567-8901', stage: 'New', source: 'Zillow', type: 'Buyer', price: '$300k - $400k', tags: [], createdAt: new Date(Date.now() - 1*86400000).toISOString(), lastActivity: new Date(Date.now() - 1*86400000).toISOString(), notes: [], category: 'lead' },
  { id: newId(), firstName: 'Jennifer', lastName: 'Martinez', email: 'jmartinez@gmail.com', phone: '(555) 678-9012', stage: 'Nurture', source: 'Open House', type: 'Buyer', price: '$200k - $300k', tags: ['Follow Up'], createdAt: new Date(Date.now() - 45*86400000).toISOString(), lastActivity: new Date(Date.now() - 7*86400000).toISOString(), notes: [], category: 'prospect' },
  { id: newId(), firstName: 'Robert', lastName: 'Thompson', email: 'r.thompson@hotmail.com', phone: '(555) 789-0123', stage: 'Active Seller', source: 'Cold Call', type: 'Seller', price: '$450k', tags: ['Motivated Seller'], createdAt: new Date(Date.now() - 20*86400000).toISOString(), lastActivity: new Date(Date.now() - 3*86400000).toISOString(), notes: [], category: 'active' },
  { id: newId(), firstName: 'Amanda', lastName: 'Davis', email: 'amanda.d@gmail.com', phone: '(555) 890-1234', stage: 'Closed', source: 'Referral', type: 'Buyer', price: '$380k', tags: ['Past Client'], createdAt: new Date(Date.now() - 90*86400000).toISOString(), lastActivity: new Date(Date.now() - 14*86400000).toISOString(), notes: [], category: 'past client' },
  { id: newId(), firstName: 'James', lastName: 'Wilson', email: 'james.w@gmail.com', phone: '(555) 901-2345', stage: 'Connected', source: 'Social Media', type: 'Buyer', price: '$600k - $800k', tags: ['Luxury', 'Pre-approved'], createdAt: new Date(Date.now() - 8*86400000).toISOString(), lastActivity: new Date(Date.now() - 1*86400000).toISOString(), notes: [], category: 'lead' },
  { id: newId(), firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.and@outlook.com', phone: '(555) 012-3456', stage: 'Met', source: 'Website', type: 'Both', price: '$350k - $500k', tags: ['Relocating'], createdAt: new Date(Date.now() - 15*86400000).toISOString(), lastActivity: new Date(Date.now() - 4*86400000).toISOString(), notes: [], category: 'prospect' },
  { id: newId(), firstName: 'Carlos', lastName: 'Garcia', email: 'c.garcia@gmail.com', phone: '(555) 111-2222', stage: 'Agreement Signed', source: 'Zillow', type: 'Seller', price: '$275k', tags: ['Quick Sale'], createdAt: new Date(Date.now() - 25*86400000).toISOString(), lastActivity: new Date(Date.now() - 2*86400000).toISOString(), notes: [], category: 'active' },
  { id: newId(), firstName: 'Tiffany', lastName: 'Brown', email: 'tiffany.b@icloud.com', phone: '(555) 222-3333', stage: 'Attempted Contact', source: 'Realtor.com', type: 'Buyer', price: '$150k - $250k', tags: [], createdAt: new Date(Date.now() - 3*86400000).toISOString(), lastActivity: new Date(Date.now() - 3*86400000).toISOString(), notes: [], category: 'lead' },
  { id: newId(), firstName: 'Kevin', lastName: 'Lee', email: 'k.lee@yahoo.com', phone: '(555) 333-4444', stage: 'Dead', source: 'Cold Call', type: 'Buyer', price: '$200k', tags: ['Lost'], createdAt: new Date(Date.now() - 60*86400000).toISOString(), lastActivity: new Date(Date.now() - 30*86400000).toISOString(), notes: [], category: 'lead' },
];

const SEED_TASKS = [
  { id: newId(), desc: 'Call Sarah Johnson back', type: 'Call', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0,10), personId: null, personName: 'Sarah Johnson', done: false },
  { id: newId(), desc: 'Send listing agreement to Carlos Garcia', type: 'Email', dueDate: todayISO(), personId: null, personName: 'Carlos Garcia', done: false },
  { id: newId(), desc: 'Schedule showing for Mike Ramirez', type: 'Follow Up', dueDate: todayISO(), personId: null, personName: 'Mike Ramirez', done: false },
  { id: newId(), desc: 'Follow up with David Williams on pre-approval', type: 'Call', dueDate: todayISO(), personId: null, personName: 'David Williams', done: false },
  { id: newId(), desc: 'Send market report to Jennifer Martinez', type: 'Email', dueDate: new Date(Date.now() + 2*86400000).toISOString().slice(0,10), personId: null, personName: 'Jennifer Martinez', done: false },
  { id: newId(), desc: 'Check in with Emily Chen — contract update', type: 'Text', dueDate: new Date(Date.now() + 3*86400000).toISOString().slice(0,10), personId: null, personName: 'Emily Chen', done: false },
];

const SEED_MESSAGES = [
  { id: newId(), personName: 'Sarah Johnson', type: 'email', subject: 'Re: Property on Maple St', preview: 'Hi! Yes I am still interested, when can we schedule...', time: '10:24 AM', unread: true, thread: [
    { dir: 'recv', text: 'Hi! Yes I am still interested. When can we schedule a showing for the Maple St property?', time: '10:24 AM' },
    { dir: 'sent', text: 'Great to hear! I have Thursday at 2pm or Friday at 11am available. Which works better for you?', time: '10:30 AM' }
  ]},
  { id: newId(), personName: 'Mike Ramirez', type: 'text', subject: 'Appointment Confirmation', preview: 'See you Thursday at 3pm! Looking forward to it', time: 'Yesterday', unread: true, thread: [
    { dir: 'sent', text: 'Hi Mike, just confirming our appointment Thursday at 3pm. Does that still work?', time: 'Yesterday 2:00 PM' },
    { dir: 'recv', text: 'See you Thursday at 3pm! Looking forward to it 👍', time: 'Yesterday 2:15 PM' }
  ]},
  { id: newId(), personName: 'Emily Chen', type: 'email', subject: 'Contract Update', preview: 'The title company confirmed they received the...', time: 'Yesterday', unread: true, thread: [
    { dir: 'recv', text: 'The title company confirmed they received the signed contract. Expected closing date is still on track for next Friday.', time: 'Yesterday 9:00 AM' }
  ]},
  { id: newId(), personName: 'Robert Thompson', type: 'text', subject: 'Listing Photos', preview: 'Photos look great! When will it go live on MLS?', time: 'Mon', unread: false, thread: [
    { dir: 'sent', text: 'Robert, the photographer just sent over the final listing photos. They look amazing! I\'ll be uploading to MLS tomorrow.', time: 'Mon 4:00 PM' },
    { dir: 'recv', text: 'Photos look great! When will it go live on MLS?', time: 'Mon 4:45 PM' },
    { dir: 'sent', text: 'Going live Tuesday morning! I\'ll send you the link as soon as it\'s up.', time: 'Mon 5:00 PM' }
  ]},
];

const SEED_TEXTS = [
  { id: newId(), personName: 'Sarah Johnson', preview: 'Thursday at 2pm works!', time: '10:31 AM', thread: [
    { dir: 'sent', text: 'Hi Sarah! Just wanted to follow up on the Maple St property. Still interested?', time: '9:00 AM' },
    { dir: 'recv', text: 'Yes! Definitely still interested. What times are available for a showing?', time: '10:00 AM' },
    { dir: 'sent', text: 'I have Thursday at 2pm or Friday at 11am open. Which works?', time: '10:25 AM' },
    { dir: 'recv', text: 'Thursday at 2pm works!', time: '10:31 AM' },
  ]},
  { id: newId(), personName: 'Mike Ramirez', preview: 'Looking forward to Thursday!', time: 'Yesterday', thread: [
    { dir: 'sent', text: 'Mike, confirming our appointment for Thursday 3pm. Address is 1423 Oak Ave.', time: 'Yesterday 2:00 PM' },
    { dir: 'recv', text: 'Looking forward to Thursday! Should I bring my pre-approval letter?', time: 'Yesterday 2:20 PM' },
    { dir: 'sent', text: 'Yes please bring it! It really helps move things along if you love the place.', time: 'Yesterday 2:30 PM' }
  ]},
  { id: newId(), personName: 'Carlos Garcia', preview: 'When do the photos go live?', time: 'Mon', thread: [
    { dir: 'recv', text: 'When do the photos go live on Zillow?', time: 'Mon 11:00 AM' },
    { dir: 'sent', text: 'The listing goes live Tuesday morning! I\'ll text you the link as soon as it\'s published.', time: 'Mon 11:15 AM' }
  ]},
];

// ============================================================
// STATE
// ============================================================

let state = {
  people: DB.get('people', null) || SEED_PEOPLE.map(p => ({ ...p })),
  tasks: DB.get('tasks', null) || SEED_TASKS.map(t => ({ ...t })),
  messages: DB.get('messages', null) || SEED_MESSAGES,
  texts: DB.get('texts', null) || SEED_TEXTS,
  currentPersonId: null,
  currentView: 'dashboard',
  peopleFilter: 'all',
  peopleSearch: '',
  stageFilter: '',
  sourceFilter: '',
  activeInboxItem: null,
  activeTextItem: null,
  sortCol: 'lastActivity',
  sortDir: 'desc',
};

function saveState() {
  DB.set('people', state.people);
  DB.set('tasks', state.tasks);
  DB.set('messages', state.messages);
  DB.set('texts', state.texts);
}

// ============================================================
// STAGE CONFIG
// ============================================================

const STAGES = [
  { name: 'New', color: '#3b82f6', barColor: '#3b82f6' },
  { name: 'Attempted Contact', color: '#f59e0b', barColor: '#f59e0b' },
  { name: 'Connected', color: '#10b981', barColor: '#10b981' },
  { name: 'Nurture', color: '#6366f1', barColor: '#6366f1' },
  { name: 'Appointment Set', color: '#ec4899', barColor: '#ec4899' },
  { name: 'Met', color: '#8b5cf6', barColor: '#8b5cf6' },
  { name: 'Agreement Signed', color: '#f97316', barColor: '#f97316' },
  { name: 'Active Buyer', color: '#06b6d4', barColor: '#06b6d4' },
  { name: 'Active Seller', color: '#eab308', barColor: '#eab308' },
  { name: 'Under Contract', color: '#ef4444', barColor: '#ef4444' },
  { name: 'Closed', color: '#10b981', barColor: '#10b981' },
  { name: 'Dead', color: '#9ca3af', barColor: '#9ca3af' },
];

function getStageBadgeClass(stage) {
  const map = {
    'New': 'stage-new',
    'Attempted Contact': 'stage-attempted',
    'Connected': 'stage-connected',
    'Nurture': 'stage-nurture',
    'Appointment Set': 'stage-appointment',
    'Met': 'stage-met',
    'Agreement Signed': 'stage-agreement',
    'Active Buyer': 'stage-buyer',
    'Active Seller': 'stage-seller',
    'Under Contract': 'stage-contract',
    'Closed': 'stage-closed',
    'Dead': 'stage-dead',
  };
  return map[stage] || 'stage-new';
}

function getStageColor(stage) {
  const s = STAGES.find(s => s.name === stage);
  return s ? s.color : '#9ca3af';
}

// ============================================================
// NAVIGATION
// ============================================================

function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + viewName);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === viewName);
  });

  state.currentView = viewName;
  renderView(viewName);
}

function renderView(viewName) {
  switch (viewName) {
    case 'dashboard': renderDashboard(); break;
    case 'people': renderPeople(); break;
    case 'pipeline': renderPipeline(); break;
    case 'inbox': renderInbox(); break;
    case 'tasks': renderTasks(); break;
    case 'texts': renderTexts(); break;
    case 'reports': renderReports(); break;
  }
}

// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard() {
  const today = todayISO();
  const thirtyDaysAgo = new Date(Date.now() - 30*86400000).toISOString();

  // Stats
  const newLeads = state.people.filter(p => p.createdAt >= thirtyDaysAgo).length;
  const contacted = state.people.filter(p => ['Attempted Contact','Connected','Met','Appointment Set'].includes(p.stage)).length;
  const contract = state.people.filter(p => p.stage === 'Under Contract').length;
  const closed = state.people.filter(p => p.stage === 'Closed').length;

  document.getElementById('stat-new-leads').textContent = newLeads;
  document.getElementById('stat-contacted').textContent = contacted;
  document.getElementById('stat-contract').textContent = contract;
  document.getElementById('stat-closed').textContent = closed;

  // Action items (tasks due today or overdue)
  const dueTasks = state.tasks.filter(t => !t.done && t.dueDate <= today).slice(0, 5);
  const taskList = document.getElementById('dashTaskList');
  if (dueTasks.length === 0) {
    taskList.innerHTML = '<div class="action-item"><div class="action-item-body"><div class="action-item-sub" style="padding:12px 0;">No pending tasks. You\'re all caught up! 🎉</div></div></div>';
  } else {
    taskList.innerHTML = dueTasks.map(t => {
      const typeMap = { Call: 'icon-call', Email: 'icon-email', Text: 'icon-text', 'Follow Up': 'icon-task', Other: 'icon-task' };
      const iconClass = typeMap[t.type] || 'icon-task';
      const initText = t.type[0];
      return `<div class="action-item" onclick="switchView('tasks')">
        <div class="action-item-icon ${iconClass}">${initText}</div>
        <div class="action-item-body">
          <div class="action-item-title">${escapeHtml(t.desc)}</div>
          <div class="action-item-sub">${t.personName ? escapeHtml(t.personName) : 'No person'}</div>
        </div>
        <div class="action-item-time">${t.dueDate === today ? 'Today' : 'Overdue'}</div>
      </div>`;
    }).join('');
  }

  // Activity feed
  const recent = [...state.people].sort((a,b) => new Date(b.lastActivity) - new Date(a.lastActivity)).slice(0, 6);
  const feed = document.getElementById('activityFeed');
  feed.innerHTML = recent.map(p => {
    const notes = p.notes || [];
    const lastNote = notes[notes.length - 1];
    const action = lastNote ? lastNote.type + ': ' + lastNote.content.slice(0, 50) + (lastNote.content.length > 50 ? '...' : '') : 'Lead added to CRM';
    return `<div class="activity-entry">
      <strong>${escapeHtml(p.firstName + ' ' + p.lastName)}</strong> — ${escapeHtml(action)}
      <div class="activity-entry-time">${daysAgo(p.lastActivity)}</div>
    </div>`;
  }).join('');

  // Pipeline bars
  const bars = document.getElementById('pipelineBars');
  const max = Math.max(...STAGES.map(s => state.people.filter(p => p.stage === s.name).length), 1);
  bars.innerHTML = STAGES.map(s => {
    const count = state.people.filter(p => p.stage === s.name).length;
    const pct = Math.round((count / max) * 100);
    return `<div class="pipe-bar-item">
      <div class="pipe-bar-label" title="${s.name}">${s.name}</div>
      <div class="pipe-bar-track">
        <div class="pipe-bar-fill" style="height:${pct}%;background:${s.barColor}"></div>
      </div>
      <div class="pipe-bar-count">${count}</div>
    </div>`;
  }).join('');
}

// ============================================================
// PEOPLE
// ============================================================

function getFilteredPeople() {
  let list = [...state.people];

  if (state.peopleFilter !== 'all') {
    list = list.filter(p => (p.category || 'lead') === state.peopleFilter);
  }

  if (state.peopleSearch) {
    const q = state.peopleSearch.toLowerCase();
    list = list.filter(p =>
      (p.firstName + ' ' + p.lastName).toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q)
    );
  }

  if (state.stageFilter) {
    list = list.filter(p => p.stage === state.stageFilter);
  }

  if (state.sourceFilter) {
    list = list.filter(p => p.source === state.sourceFilter);
  }

  // Sort
  list.sort((a, b) => {
    let va = a[state.sortCol] || '';
    let vb = b[state.sortCol] || '';
    if (state.sortCol === 'name') {
      va = a.firstName + ' ' + a.lastName;
      vb = b.firstName + ' ' + b.lastName;
    }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return state.sortDir === 'asc' ? cmp : -cmp;
  });

  return list;
}

function renderPeople() {
  const people = getFilteredPeople();
  document.getElementById('peopleCount').textContent = people.length;

  const tbody = document.getElementById('peopleTableBody');
  if (people.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">
      <div class="empty-state">
        <svg viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
        <p>No people found. Try adjusting your filters.</p>
      </div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = people.map(p => {
    const name = p.firstName + ' ' + p.lastName;
    const color = getAvatarColor(name);
    const init = initials(name);
    const badgeClass = getStageBadgeClass(p.stage);
    return `<tr onclick="openPersonModal('${p.id}')">
      <td onclick="event.stopPropagation()"><input type="checkbox"></td>
      <td>
        <div class="person-name-cell">
          <div class="person-initials" style="background:${color}">${init}</div>
          <div>
            <div class="person-name-text">${escapeHtml(name)}</div>
            <div class="person-email-text">${escapeHtml(p.email || '')}</div>
          </div>
        </div>
      </td>
      <td><span class="stage-badge ${badgeClass}">${p.stage}</span></td>
      <td>${escapeHtml(p.source || '—')}</td>
      <td>${escapeHtml(p.phone || '—')}</td>
      <td>${escapeHtml(p.email || '—')}</td>
      <td>${daysAgo(p.lastActivity)}</td>
      <td>${escapeHtml(p.price || '—')}</td>
      <td>
        <div class="row-actions" onclick="event.stopPropagation()">
          <button class="row-action-btn" onclick="openPersonModal('${p.id}')" title="View">
            <svg viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
          </button>
          <button class="row-action-btn" onclick="deletePerson('${p.id}', event)" title="Delete">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function deletePerson(id, e) {
  if (e) e.stopPropagation();
  if (!confirm('Delete this person? This cannot be undone.')) return;
  state.people = state.people.filter(p => p.id !== id);
  saveState();
  renderPeople();
  renderDashboard();
  updateBadges();
}

// ============================================================
// PIPELINE
// ============================================================

function renderPipeline() {
  const board = document.getElementById('pipelineBoard');
  const typeFilter = document.getElementById('pipelineTypeFilter').value;

  let people = state.people;
  if (typeFilter) people = people.filter(p => p.type === typeFilter || p.type === 'Both');

  board.innerHTML = STAGES.map(stage => {
    const cards = people.filter(p => p.stage === stage.name);
    const cardHTML = cards.length === 0
      ? '<div class="pipeline-empty-col">No leads in this stage</div>'
      : cards.map(p => {
          const name = p.firstName + ' ' + p.lastName;
          const days = daysSince(p.createdAt);
          return `<div class="pipeline-card" onclick="openPersonModal('${p.id}')">
            <div class="pipeline-card-name">${escapeHtml(name)}</div>
            <div class="pipeline-card-sub">${escapeHtml(p.source || '')} · ${escapeHtml(p.type || '')}</div>
            ${p.price ? `<div class="pipeline-card-price">${escapeHtml(p.price)}</div>` : ''}
            <div class="pipeline-card-footer">
              <span class="pipeline-card-source">${escapeHtml(p.source || 'Unknown')}</span>
              <span class="pipeline-card-days">${days}d</span>
            </div>
          </div>`;
        }).join('');

    return `<div class="pipeline-col">
      <div class="pipeline-col-header">
        <span class="pipeline-col-name" style="color:${stage.color}">${stage.name}</span>
        <span class="pipeline-col-count" style="background:${stage.color}">${cards.length}</span>
      </div>
      <div class="pipeline-col-body">${cardHTML}</div>
    </div>`;
  }).join('');
}

// ============================================================
// INBOX
// ============================================================

function renderInbox() {
  const list = document.getElementById('inboxList');
  list.innerHTML = state.messages.map((m, i) => `
    <div class="inbox-item ${m.unread ? 'inbox-unread' : ''} ${state.activeInboxItem === i ? 'active' : ''}" onclick="openInboxItem(${i})">
      <div class="inbox-item-header">
        <span class="inbox-item-name">${escapeHtml(m.personName)}</span>
        <span class="inbox-item-time">${m.time}</span>
      </div>
      <div class="inbox-item-preview">${escapeHtml(m.preview)}</div>
    </div>`).join('');

  if (state.activeInboxItem !== null) openInboxItem(state.activeInboxItem, false);
}

function openInboxItem(i, updateState = true) {
  if (updateState) {
    state.activeInboxItem = i;
    state.messages[i].unread = false;
    saveState();
    renderInbox();
    return;
  }
  const m = state.messages[i];
  const content = document.getElementById('inboxContent');
  content.innerHTML = `
    <div class="inbox-thread">
      <div class="inbox-thread-header">
        <div>
          <div class="inbox-thread-name">${escapeHtml(m.personName)}</div>
          <div style="font-size:12px;color:var(--text-secondary)">${m.type === 'email' ? '✉ ' : '💬 '}${escapeHtml(m.subject)}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="openPersonByName('${escapeHtml(m.personName)}')">View Contact</button>
      </div>
      <div class="inbox-thread-body">
        ${m.thread.map(msg => `
          <div class="msg-bubble-wrap ${msg.dir}">
            <div class="msg-bubble">${escapeHtml(msg.text)}</div>
            <div class="msg-meta">${msg.time}</div>
          </div>`).join('')}
      </div>
      <div class="inbox-thread-compose">
        <textarea class="compose-input" id="inboxReply" rows="2" placeholder="Reply..."></textarea>
        <button class="btn btn-primary btn-sm" onclick="sendInboxReply(${i})">Send</button>
      </div>
    </div>`;
}

function sendInboxReply(i) {
  const input = document.getElementById('inboxReply');
  const text = input.value.trim();
  if (!text) return;
  state.messages[i].thread.push({ dir: 'sent', text, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) });
  state.messages[i].preview = text.slice(0, 60);
  saveState();
  openInboxItem(i);
  input.value = '';
}

function openPersonByName(name) {
  const p = state.people.find(p => p.firstName + ' ' + p.lastName === name);
  if (p) openPersonModal(p.id);
}

// ============================================================
// TASKS
// ============================================================

function renderTasks() {
  const today = todayISO();
  const overdue = state.tasks.filter(t => !t.done && t.dueDate < today);
  const todayT = state.tasks.filter(t => !t.done && t.dueDate === today);
  const upcoming = state.tasks.filter(t => !t.done && t.dueDate > today);

  renderTaskGroup('taskListOverdue', overdue);
  renderTaskGroup('taskListToday', todayT);
  renderTaskGroup('taskListUpcoming', upcoming);
}

function renderTaskGroup(elId, tasks) {
  const el = document.getElementById(elId);
  if (tasks.length === 0) {
    el.innerHTML = '<div class="task-empty">No tasks here</div>';
    return;
  }
  const typeClass = { Call: 'type-call', Email: 'type-email', Text: 'type-text', 'Follow Up': 'type-followup', Other: 'type-other' };
  el.innerHTML = tasks.map(t => `
    <div class="task-item" id="task-${t.id}">
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="completeTask('${t.id}', this.checked)">
      <div class="task-item-body">
        <div class="task-item-desc" style="${t.done ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${escapeHtml(t.desc)}</div>
        ${t.personName ? `<div class="task-item-meta">For: ${escapeHtml(t.personName)}</div>` : ''}
      </div>
      <span class="task-type-badge ${typeClass[t.type] || 'type-other'}">${t.type}</span>
      <span class="task-due">${formatDate(t.dueDate)}</span>
    </div>`).join('');
}

function completeTask(id, done) {
  const t = state.tasks.find(t => t.id === id);
  if (t) { t.done = done; saveState(); }
  setTimeout(() => renderTasks(), 300);
  updateBadges();
}

// ============================================================
// TEXTS
// ============================================================

function renderTexts() {
  const list = document.getElementById('textsList');
  list.innerHTML = state.texts.map((t, i) => {
    const color = getAvatarColor(t.personName);
    const init = initials(t.personName);
    return `<div class="texts-item ${state.activeTextItem === i ? 'active' : ''}" onclick="openTextConvo(${i})">
      <div class="texts-avatar" style="background:${color}">${init}</div>
      <div class="texts-item-body">
        <div class="texts-item-name">${escapeHtml(t.personName)}</div>
        <div class="texts-item-preview">${escapeHtml(t.preview)}</div>
      </div>
      <div class="texts-item-time">${t.time}</div>
    </div>`;
  }).join('');

  if (state.activeTextItem !== null) openTextConvo(state.activeTextItem, false);
}

function openTextConvo(i, updateState = true) {
  if (updateState) {
    state.activeTextItem = i;
    renderTexts();
    return;
  }
  const conv = state.texts[i];
  const content = document.getElementById('textsContent');
  content.innerHTML = `
    <div class="inbox-thread">
      <div class="inbox-thread-header">
        <div class="inbox-thread-name">${escapeHtml(conv.personName)}</div>
        <button class="btn btn-outline btn-sm" onclick="openPersonByName('${escapeHtml(conv.personName)}')">View Contact</button>
      </div>
      <div class="inbox-thread-body" id="textThreadBody">
        ${conv.thread.map(msg => `
          <div class="msg-bubble-wrap ${msg.dir}">
            <div class="msg-bubble">${escapeHtml(msg.text)}</div>
            <div class="msg-meta">${msg.time}</div>
          </div>`).join('')}
      </div>
      <div class="inbox-thread-compose">
        <textarea class="compose-input" id="textReplyInput" rows="2" placeholder="Text message..." onkeydown="handleTextEnter(event, ${i})"></textarea>
        <button class="btn btn-primary btn-sm" onclick="sendText(${i})">Send</button>
      </div>
    </div>`;

  const body = content.querySelector('.inbox-thread-body');
  if (body) body.scrollTop = body.scrollHeight;
}

function handleTextEnter(e, i) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(i); }
}

function sendText(i) {
  const input = document.getElementById('textReplyInput');
  const text = input.value.trim();
  if (!text) return;
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  state.texts[i].thread.push({ dir: 'sent', text, time: now });
  state.texts[i].preview = text.slice(0, 50);
  state.texts[i].time = 'Just now';
  saveState();
  openTextConvo(i);
  input.value = '';
}

// ============================================================
// REPORTS
// ============================================================

function renderReports() {
  renderSourceChart();
  renderStageChart();
  renderVolumeChart();
}

function renderSourceChart() {
  const el = document.getElementById('sourceChart');
  const sources = {};
  state.people.forEach(p => { sources[p.source || 'Unknown'] = (sources[p.source || 'Unknown'] || 0) + 1; });
  const colors = [AVATAR_COLORS[0], AVATAR_COLORS[1], AVATAR_COLORS[2], AVATAR_COLORS[4], AVATAR_COLORS[5], AVATAR_COLORS[6], AVATAR_COLORS[7], AVATAR_COLORS[8]];
  const entries = Object.entries(sources).sort((a,b) => b[1]-a[1]);
  const total = state.people.length || 1;

  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.gap = '24px';

  const size = 120;
  let offset = 0;
  const strokes = entries.map(([name, count], i) => {
    const pct = count / total;
    const dash = pct * 314;
    const gap = 314 - dash;
    const rot = offset * 360;
    offset += pct;
    return `<circle cx="60" cy="60" r="50" fill="none" stroke="${colors[i % colors.length]}" stroke-width="20"
      stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${314 * 0.25}" transform="rotate(${rot - 90} 60 60)"/>`;
  }).join('');

  const legend = entries.map(([name, count], i) => `
    <div class="donut-legend-item">
      <div class="donut-dot" style="background:${colors[i % colors.length]}"></div>
      <span>${escapeHtml(name)}</span>
      <strong style="margin-left:auto;margin-left:4px">${count}</strong>
    </div>`).join('');

  el.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" stroke-width="20"/>
      ${strokes}
      <text x="60" y="65" text-anchor="middle" font-size="18" font-weight="700" fill="var(--text-primary)">${total}</text>
    </svg>
    <div class="donut-legend">${legend}</div>`;
}

function renderStageChart() {
  const el = document.getElementById('stageChart');
  const pipeline = STAGES.slice(0, 8);
  const max = Math.max(...pipeline.map(s => state.people.filter(p => p.stage === s.name).length), 1);

  el.style.alignItems = 'flex-end';
  el.style.paddingBottom = '20px';
  el.style.position = 'relative';

  el.innerHTML = pipeline.map(s => {
    const count = state.people.filter(p => p.stage === s.name).length;
    const pct = Math.round((count / max) * 100);
    const shortName = s.name.length > 8 ? s.name.slice(0, 8) + '…' : s.name;
    return `<div class="chart-bar" style="height:${Math.max(pct, 4)}%;background:${s.color}" title="${s.name}: ${count}">
      <div class="chart-bar-label">${shortName}</div>
    </div>`;
  }).join('');
}

function renderVolumeChart() {
  const el = document.getElementById('volumeChart');
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString('en-US', { month: 'short' });
    const count = state.people.filter(p => p.createdAt && p.createdAt.startsWith(key)).length;
    months.push({ label, count });
  }
  const max = Math.max(...months.map(m => m.count), 1);
  el.style.alignItems = 'flex-end';
  el.style.paddingBottom = '20px';

  el.innerHTML = months.map(m => {
    const pct = Math.round((m.count / max) * 100);
    return `<div class="chart-bar" style="height:${Math.max(pct, 4)}%;background:#3b82f6;opacity:0.8" title="${m.label}: ${m.count} leads">
      <div class="chart-bar-label">${m.label}</div>
    </div>`;
  }).join('');
}

// ============================================================
// PERSON MODAL
// ============================================================

function openPersonModal(personId) {
  const p = state.people.find(p => p.id === personId);
  if (!p) return;
  state.currentPersonId = personId;

  const name = p.firstName + ' ' + p.lastName;
  const color = getAvatarColor(name);
  const init = initials(name);

  const avatar = document.getElementById('modalAvatar');
  avatar.textContent = init;
  avatar.style.background = color;

  document.getElementById('modalName').textContent = name;
  document.getElementById('modalMeta').textContent = `${p.stage} · Added ${daysAgo(p.createdAt)}`;

  const stageSelect = document.getElementById('modalStageSelect');
  stageSelect.value = p.stage;

  // Contact fields
  document.getElementById('contactFields').innerHTML = `
    <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value"><a href="tel:${p.phone}">${escapeHtml(p.phone || '—')}</a></span></div>
    <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value"><a href="mailto:${p.email}">${escapeHtml(p.email || '—')}</a></span></div>
    <div class="detail-row"><span class="detail-label">Added</span><span class="detail-value">${formatDate(p.createdAt)}</span></div>
    <div class="detail-row"><span class="detail-label">Last Activity</span><span class="detail-value">${daysAgo(p.lastActivity)}</span></div>
  `;

  // Lead fields
  document.getElementById('leadFields').innerHTML = `
    <div class="detail-row"><span class="detail-label">Source</span><span class="detail-value">${escapeHtml(p.source || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${escapeHtml(p.type || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">Price Range</span><span class="detail-value">${escapeHtml(p.price || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">Stage</span><span class="detail-value"><span class="stage-badge ${getStageBadgeClass(p.stage)}">${p.stage}</span></span></div>
  `;

  // Tags
  const tags = p.tags || [];
  document.getElementById('tagsWrap').innerHTML = tags.length
    ? tags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')
    : '<span style="font-size:12px;color:var(--text-muted)">No tags</span>';

  renderActivityTimeline(p);

  document.getElementById('composeArea').style.display = 'none';
  document.getElementById('personModal').classList.add('open');
}

function renderActivityTimeline(p) {
  const timeline = document.getElementById('activityTimeline');
  const notes = p.notes || [];

  if (notes.length === 0) {
    timeline.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:20px 0;text-align:center">No activity yet. Use the buttons above to log a call, send an email, or add a note.</div>`;
    return;
  }

  const iconColors = {
    note: '#8b5cf6', email: '#3b82f6', call: '#10b981', text: '#06b6d4', task: '#f59e0b'
  };

  timeline.innerHTML = [...notes].reverse().map(n => {
    const color = iconColors[n.type] || '#9ca3af';
    const icon = { note: '📝', email: '✉', call: '📞', text: '💬', task: '✓' }[n.type] || '•';
    return `<div class="timeline-entry">
      <div class="timeline-icon" style="background:${color}">${icon}</div>
      <div class="timeline-body">
        <div class="timeline-text">${n.type.charAt(0).toUpperCase() + n.type.slice(1)}</div>
        <div class="timeline-content">${escapeHtml(n.content)}</div>
        <div class="timeline-time">${daysAgo(n.createdAt)}</div>
      </div>
    </div>`;
  }).join('');
}

function closePersonModal() {
  document.getElementById('personModal').classList.remove('open');
  state.currentPersonId = null;
  saveState();
  renderPeople();
  renderDashboard();
}

// Compose
function showCompose(type, title, saveBtnText = 'Save') {
  const area = document.getElementById('composeArea');
  area.style.display = 'block';
  document.getElementById('composeTitle').textContent = title;
  document.getElementById('composeBody').value = '';
  document.getElementById('composeSend').textContent = saveBtnText;
  document.getElementById('composeSend').dataset.type = type;
  document.getElementById('composeBody').focus();
}

function saveCompose() {
  const type = document.getElementById('composeSend').dataset.type;
  const content = document.getElementById('composeBody').value.trim();
  if (!content) return;

  const p = state.people.find(p => p.id === state.currentPersonId);
  if (!p) return;

  if (!p.notes) p.notes = [];
  p.notes.push({ type, content, createdAt: new Date().toISOString() });
  p.lastActivity = new Date().toISOString();

  saveState();
  renderActivityTimeline(p);
  document.getElementById('composeArea').style.display = 'none';
  document.getElementById('activityFeed') && renderDashboard();
}

// Stage change
document.getElementById('modalStageSelect').addEventListener('change', e => {
  const p = state.people.find(p => p.id === state.currentPersonId);
  if (p) {
    p.stage = e.target.value;
    p.lastActivity = new Date().toISOString();
    if (!p.notes) p.notes = [];
    p.notes.push({ type: 'note', content: `Stage changed to: ${p.stage}`, createdAt: new Date().toISOString() });
    saveState();
    renderActivityTimeline(p);
    document.getElementById('modalMeta').textContent = `${p.stage} · Added ${daysAgo(p.createdAt)}`;
  }
});

// ============================================================
// ADD PERSON
// ============================================================

function openAddPersonModal() {
  document.getElementById('addPersonModal').classList.add('open');
  document.getElementById('addFirstName').focus();
}

function closeAddPersonModal() {
  document.getElementById('addPersonModal').classList.remove('open');
  ['addFirstName','addLastName','addEmail','addPhone','addNotes','addPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function saveNewPerson() {
  const firstName = document.getElementById('addFirstName').value.trim();
  if (!firstName) { alert('First name is required.'); return; }

  const newPerson = {
    id: newId(),
    firstName,
    lastName: document.getElementById('addLastName').value.trim(),
    email: document.getElementById('addEmail').value.trim(),
    phone: document.getElementById('addPhone').value.trim(),
    stage: document.getElementById('addStage').value,
    source: document.getElementById('addSource').value,
    type: document.getElementById('addType').value,
    price: document.getElementById('addPrice').value.trim(),
    notes: document.getElementById('addNotes').value.trim()
      ? [{ type: 'note', content: document.getElementById('addNotes').value.trim(), createdAt: new Date().toISOString() }]
      : [],
    tags: [],
    category: 'lead',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };

  state.people.unshift(newPerson);
  saveState();
  closeAddPersonModal();
  renderPeople();
  renderDashboard();
  updateBadges();
}

// ============================================================
// ADD TASK
// ============================================================

function openAddTaskModal(personId = null) {
  const modal = document.getElementById('addTaskModal');
  modal.classList.add('open');

  // Populate person dropdown
  const sel = document.getElementById('taskPersonSelect');
  sel.innerHTML = '<option value="">No person assigned</option>' +
    state.people.map(p => `<option value="${p.id}" ${p.id === personId ? 'selected' : ''}>${escapeHtml(p.firstName + ' ' + p.lastName)}</option>`).join('');

  // Set default due date to today
  document.getElementById('taskDueDate').value = todayISO();
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskDesc').focus();
}

function closeAddTaskModal() {
  document.getElementById('addTaskModal').classList.remove('open');
}

function saveNewTask() {
  const desc = document.getElementById('taskDesc').value.trim();
  if (!desc) { alert('Please enter a task description.'); return; }

  const personId = document.getElementById('taskPersonSelect').value;
  const person = personId ? state.people.find(p => p.id === personId) : null;

  const task = {
    id: newId(),
    desc,
    type: document.getElementById('taskType').value,
    dueDate: document.getElementById('taskDueDate').value || todayISO(),
    personId: personId || null,
    personName: person ? person.firstName + ' ' + person.lastName : '',
    done: false,
  };

  state.tasks.push(task);
  saveState();
  closeAddTaskModal();
  renderTasks();
  renderDashboard();
  updateBadges();
}

// ============================================================
// BADGES
// ============================================================

function updateBadges() {
  const today = todayISO();
  const pendingTasks = state.tasks.filter(t => !t.done && t.dueDate <= today).length;
  const unreadInbox = state.messages.filter(m => m.unread).length;

  const taskBadge = document.getElementById('tasks-badge');
  const inboxBadge = document.getElementById('inbox-badge');

  taskBadge.textContent = pendingTasks;
  taskBadge.style.display = pendingTasks > 0 ? 'inline-block' : 'none';

  inboxBadge.textContent = unreadInbox;
  inboxBadge.style.display = unreadInbox > 0 ? 'inline-block' : 'none';
}

// ============================================================
// UTILITY
// ============================================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Navigation
document.querySelectorAll('.nav-item[data-view]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    switchView(item.dataset.view);
  });
});

// Dashboard links
document.addEventListener('click', e => {
  const link = e.target.closest('[data-view-link]');
  if (link) { e.preventDefault(); switchView(link.dataset.viewLink); }
});

// Add person
document.getElementById('addPersonBtn').addEventListener('click', openAddPersonModal);
document.getElementById('addModalClose').addEventListener('click', closeAddPersonModal);
document.getElementById('addPersonCancel').addEventListener('click', closeAddPersonModal);
document.getElementById('addPersonSave').addEventListener('click', saveNewPerson);

// Close add modal on overlay click
document.getElementById('addPersonModal').addEventListener('click', e => {
  if (e.target === document.getElementById('addPersonModal')) closeAddPersonModal();
});

// Add task
document.getElementById('addTaskBtn').addEventListener('click', () => openAddTaskModal());
document.getElementById('taskModalClose').addEventListener('click', closeAddTaskModal);
document.getElementById('taskCancel').addEventListener('click', closeAddTaskModal);
document.getElementById('taskSave').addEventListener('click', saveNewTask);

document.getElementById('addTaskModal').addEventListener('click', e => {
  if (e.target === document.getElementById('addTaskModal')) closeAddTaskModal();
});

// Close person modal
document.getElementById('modalClose').addEventListener('click', closePersonModal);
document.getElementById('personModal').addEventListener('click', e => {
  if (e.target === document.getElementById('personModal')) closePersonModal();
});

// Compose actions
document.getElementById('sendEmailBtn').addEventListener('click', () => showCompose('email', 'Send Email', 'Send Email'));
document.getElementById('sendTextBtn').addEventListener('click', () => showCompose('text', 'Send Text', 'Send Text'));
document.getElementById('logCallBtn').addEventListener('click', () => showCompose('call', 'Log Call', 'Log Call'));
document.getElementById('addNoteBtn').addEventListener('click', () => showCompose('note', 'Add Note', 'Save Note'));
document.getElementById('addTaskModalBtn').addEventListener('click', () => { closePersonModal(); openAddTaskModal(state.currentPersonId); });
document.getElementById('composeSend').addEventListener('click', saveCompose);
document.getElementById('composeClose').addEventListener('click', () => { document.getElementById('composeArea').style.display = 'none'; });

// People filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.peopleFilter = tab.dataset.filter;
    renderPeople();
  });
});

// People search
document.getElementById('peopleSearch').addEventListener('input', e => {
  state.peopleSearch = e.target.value;
  renderPeople();
});

// Stage / source filter
document.getElementById('stageFilter').addEventListener('change', e => {
  state.stageFilter = e.target.value;
  renderPeople();
});

document.getElementById('sourceFilter').addEventListener('change', e => {
  state.sourceFilter = e.target.value;
  renderPeople();
});

// Global search
document.getElementById('globalSearch').addEventListener('input', e => {
  if (state.currentView !== 'people') switchView('people');
  state.peopleSearch = e.target.value;
  renderPeople();
});

// Sort columns
document.querySelectorAll('.people-table th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col;
    if (state.sortCol === col) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortCol = col;
      state.sortDir = 'asc';
    }
    renderPeople();
  });
});

// Pipeline view toggle
document.getElementById('kanbanViewBtn').addEventListener('click', () => {
  document.getElementById('kanbanViewBtn').classList.add('active');
  document.getElementById('listViewBtn').classList.remove('active');
  document.getElementById('pipelineBoard').style.flexDirection = 'row';
  renderPipeline();
});

document.getElementById('listViewBtn').addEventListener('click', () => {
  document.getElementById('listViewBtn').classList.add('active');
  document.getElementById('kanbanViewBtn').classList.remove('active');
  renderPipeline();
});

document.getElementById('pipelineTypeFilter').addEventListener('change', renderPipeline);

// Sidebar toggle (collapse)
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

// Inbox tabs
document.querySelectorAll('.inbox-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.inbox-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// New text conversation
document.getElementById('newTextBtn').addEventListener('click', () => {
  const name = prompt('Enter person name for new text conversation:');
  if (!name) return;
  const existing = state.texts.findIndex(t => t.personName.toLowerCase() === name.toLowerCase());
  if (existing >= 0) { openTextConvo(existing); return; }
  state.texts.unshift({ id: newId(), personName: name, preview: '', time: 'Now', thread: [] });
  saveState();
  state.activeTextItem = 0;
  renderTexts();
});

// Settings nav
document.querySelectorAll('.settings-nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Activity tabs in modal
document.querySelectorAll('.act-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('personModal').classList.contains('open')) closePersonModal();
    if (document.getElementById('addPersonModal').classList.contains('open')) closeAddPersonModal();
    if (document.getElementById('addTaskModal').classList.contains('open')) closeAddTaskModal();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('globalSearch').focus();
  }
});

// ============================================================
// INIT
// ============================================================

function init() {
  updateBadges();
  switchView('dashboard');
}

init();
