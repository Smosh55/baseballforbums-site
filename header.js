const path = window.location.pathname;

function isActive(page) {
  return path.includes(page) ? "active" : "";
}

function renderHeader() {
  return `
    <div class="site-header">
      <div class="header-inner">

        <nav class="nav">

          <div class="nav-main">
            <a href="/" class="${path === '/' ? 'active' : ''}">Home</a>
            <a href="/schedule.html" class="${isActive('schedule')}">Schedule</a>
            <a href="/rosters.html" class="${isActive('rosters')}">Rosters</a>
            <a href="/stats.html" class="${isActive('stats')}">Stats</a>
          </div>

          <div class="nav-secondary">
            <a href="/league-rules/" class="${isActive('league-rules')}">Rules</a>
            <a href="/waiver-and-conduct/" class="${isActive('waiver-and-conduct')}">Waiver</a>
            <a href="/signup/" class="${isActive('signup')}">Signup</a>
          </div>

        </nav>

      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("site-header");
  if (target) {
    target.innerHTML = renderHeader();
  }
});