const proxy = "https://corsproxy.io/?"

function switchTo(form) {
    document.getElementById('login-form').style.display = form === 'login' ? 'flex' : 'none'
    document.getElementById('signup-form').style.display = form === 'signup' ? 'flex' : 'none'
    document.getElementById('tab-login').classList.toggle('active', form === 'login')
    document.getElementById('tab-signup').classList.toggle('active', form === 'signup')
    showMessage('login-message', '', '')
    showMessage('signup-message', '', '')
}

function showMessage(id, text, type) {
    const el = document.getElementById(id)
    el.textContent = text
    el.className = 'message' + (type ? ' ' + type : '')
}

function setLoading(btn, loading) {
    btn.disabled = loading
    btn.textContent = loading ? 'Please wait...' : btn.dataset.label
}

async function handleSignup() {
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
    const confirmpassword = document.getElementById('signup-confirmpassword').value
    const btn = document.querySelector('#signup-form .btn-primary')

    setLoading(btn, true)

    try {
        const res = await fetch(proxy + "https://fusion-ai-api.medifus.dev/webhooks/webhook-incu4c40g0h9mjpjq2zsrng3/signup?t=" + Date.now(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, confirmpassword })
        })

        const data = await res.json()

        if (data.success) {
            showMessage('signup-message', "Account created!", 'success')
        } else {
            showMessage('signup-message', data.error || "Something went wrong.", 'error')
        }
    } catch (err) {
        showMessage('signup-message', "Network error. Please try again.", 'error')
    } finally {
        setLoading(btn, false)
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const btn = document.querySelector('#login-form .btn-primary')

    setLoading(btn, true)

    try {
        const res = await fetch(proxy + "https://fusion-ai-api.medifus.dev/webhooks/webhook-j8rabt6bsiw18vyn388zssa2/login?t=" + Date.now(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (data.success) {
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('userEmail', data.email)
            showMessage('login-message', "Welcome back!", 'success')
            window.location.href = '../pages/dashboard.html'
        } else {
            showMessage('login-message', data.error || "Invalid email or password.", 'error')
        }
    } catch (err) {
        showMessage('login-message', "Network error. Please try again.", 'error')
    } finally {
        setLoading(btn, false)
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId)
    if (input.type === 'password') {
        input.type = 'text'
        btn.textContent = '🙈'
    } else {
        input.type = 'password'
        btn.textContent = '👁'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.dataset.label = btn.textContent
    })
    switchTo('login')
})
