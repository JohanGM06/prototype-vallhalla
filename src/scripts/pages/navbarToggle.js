document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});
window.addEventListener('resize', () => {
    if (window.innerWidth < 992) { // Less than lg
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('collapsed')) {
            sidebar.classList.toggle('collapsed');
        }
    }
});