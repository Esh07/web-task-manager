document.addEventListener('DOMContentLoaded', () => {
    const hour = new Date().getHours();
    const msg = hour < 12 ? 'Good Morning' :
        hour < 17 ? 'Good Afternoon' : 'Good Evening';
    document.getElementById('greeting-msg').textContent = msg;
});


function formatNoteMeta(iso) {
    if (!iso) return "";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(iso)); // "15 Jan, 03:11"
}


function getDisplayTime(note) {
    return note.updatedAt || note.createdAt || "";
}