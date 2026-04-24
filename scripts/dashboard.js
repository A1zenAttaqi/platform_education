const proxy = "https://corsproxy.io/?"
const COURSES_WEBHOOK = "https://fusion-ai-api.medifus.dev/webhooks/webhook-l4eccrehjhbvhrfp34fytsen/courses"

const FALLBACK = [
  { id:1, title:"Agentic AI",        description:"Understand how autonomous AI agents are built, how they plan, use tools, and execute multi-step tasks without human intervention.", tag:"AI",       icon:"🤖", tag_color:"#2B4FFF", tag_bg:"#EEF2FF", drive_link:"" },
  { id:2, title:"Physical AI & IoT", description:"Explore how AI integrates with physical systems — sensors, actuators, embedded devices, and real-time data pipelines.",              tag:"IoT",      icon:"⚙️", tag_color:"#E07B00", tag_bg:"#FFF4E6", drive_link:"" },
  { id:5, title:"Python",            description:"Master Python from the ground up — syntax, data structures, OOP, file handling, and practical automation scripting.",               tag:"Dev",      icon:"🐍", tag_color:"#B8860B", tag_bg:"#FFFBEE", drive_link:"" },
]

function showSkeletons() {
  document.getElementById('courses-grid').innerHTML = Array(3).fill(`
    <div class="skeleton-card">
      <div class="skeleton-block" style="width:44px;height:44px;border-radius:10px;"></div>
      <div class="skeleton-block" style="height:20px;width:60%;"></div>
      <div class="skeleton-block" style="height:13px;width:100%;"></div>
      <div class="skeleton-block" style="height:13px;width:75%;"></div>
      <div style="display:flex;justify-content:space-between;margin-top:4px;">
        <div class="skeleton-block" style="height:24px;width:60px;border-radius:20px;"></div>
        <div class="skeleton-block" style="height:30px;width:80px;border-radius:8px;"></div>
      </div>
    </div>
  `).join('')
}

function renderCourses(courses) {
  document.getElementById('courses-grid').innerHTML = courses.map((c, i) => `
    <div class="course-card" style="animation-delay:${i * 0.06}s">
      <div class="course-icon" style="background:${c.tag_bg}">${c.icon}</div>
      <div class="course-title">${c.title}</div>
      <div class="course-desc">${c.description}</div>
      <div class="course-footer">
        <span class="course-tag" style="background:${c.tag_bg}; color:${c.tag_color}">${c.tag}</span>
        <button class="btn-access" onclick="accessCourse('${c.drive_link}', '${c.title}')">Access</button>
      </div>
    </div>
  `).join('')
}

async function loadCourses() {
  showSkeletons()

  const userId = localStorage.getItem('userId')

  // If no userId, user is not logged in — redirect to login
  if (!userId) {
    window.location.href = '../pages/login.html'
    return
  } 

  const email = localStorage.getItem('userEmail')
  if (email) document.getElementById('nav-user').textContent = email
  
  try {
    const url = proxy + COURSES_WEBHOOK + "?userId=" + userId + "&t=" + Date.now()
    const res = await fetch(url, { method: "GET" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    const courses = Array.isArray(data) ? data
      : Array.isArray(data.rows)    ? data.rows
      : Array.isArray(data.courses) ? data.courses
      : []

    if (!courses.length) throw new Error("Empty response")
    renderCourses(courses)
  } catch (err) {
    console.warn("Webhook failed, using fallback:", err.message)
    document.getElementById('error-banner').style.display = 'block'
    renderCourses(FALLBACK)
  }
}

function accessCourse(driveLink, title) {
  if (driveLink && driveLink !== 'undefined' && driveLink !== '') {
    window.open(driveLink, '_blank')
  } else {
    alert(`"${title}" — drive link coming soon!`)
  }
}

async function handleSearch() {
  const query = document.getElementById('search-input').value.trim()
  if (!query) return

  const btn = document.getElementById('search-btn')
  btn.disabled = true
  btn.textContent = '⏳ Generating... (up to 30s)'

  const userId = localStorage.getItem('userId')

  try {
    const res = await fetch(proxy + "https://fusion-ai-api.medifus.dev/webhooks/webhook-m75jlogjuqy0e15nmhk863p9/generatecourses?t=" + Date.now(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, topic: query })
    })

    const data = await res.json()

    if (data.success) {
      document.getElementById('search-input').value = ''
      if (data.message === 'already_assigned') {
        alert("You already have this course in your dashboard!")
      } else {
        await loadCourses()
      }
    } else {
      alert("Failed to generate course. Please try again.")
    }
  } catch (err) {
    alert("Network error. Please try again.")
  } finally {
    btn.disabled = false
    btn.textContent = 'Generate'
  }
}
function logout() {
  localStorage.removeItem('userId')
  window.location.href = '../pages/login.html'
}

document.addEventListener('DOMContentLoaded', loadCourses)
