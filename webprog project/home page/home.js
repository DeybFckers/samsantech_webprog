function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;

    if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        body.classList.remove("sidebar-open");
    } else {
        sidebar.classList.add("open");
        body.classList.add("sidebar-open");
    }
}