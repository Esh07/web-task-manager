document.addEventListener('DOMContentLoaded', () => {
    const hour = new Date().getHours();
    const msg = hour < 12 ? 'Good Morning' :
        hour < 17 ? 'Good Afternoon' : 'Good Evening';
    document.getElementById('greeting-msg').textContent = msg;
});
