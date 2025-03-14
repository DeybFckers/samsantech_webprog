document.addEventListener("DOMContentLoaded", function () {
    // Toggle sidebar
    function toggleSidebar() {
        document.getElementById("sidebar").classList.toggle("open");
        document.body.classList.toggle("sidebar-open");
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleSidebar);

    const modal = document.getElementById("addModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.querySelector("#addModal .close-btn");
    const addForm = document.getElementById("addForm");
    const servicesTable = document.getElementById("services-table");

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    async function fetchServices() {
        try {
            const response = await fetch("http://localhost:3002/services");
            const services = await response.json();
            servicesTable.innerHTML = "";

            services.forEach((service, index) => {
                let newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${service.Service_Name}</td>
                    <td>${service.Service_Price}</td>
                    <td>${service.service_type}</td>
                    <td>
                        <button class="edit-btn" data-id="${service.Service_ID}">Edit</button>
                        <button class="delete-btn" data-id="${service.Service_ID}">Delete</button>
                    </td>
                `;
                servicesTable.appendChild(newRow);
            });
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }

    addForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let name = document.getElementById("serviceName").value.trim();
        let price = document.getElementById("servicePrice").value.trim();
        let type = document.getElementById("serviceType").value.trim();

        if (name && price && type) {
            try {
                const response = await fetch("http://localhost:3002/services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Service_Name: name,
                        Service_Price: price,
                        service_type: type,
                    }),
                });

                if (response.ok) {
                    fetchServices();
                    modal.style.display = "none";
                    addForm.reset();
                } else {
                    const errorData = await response.json();
                    alert("Error adding service: " + errorData.error);
                }
            } catch (error) {
                console.error("Error adding service:", error);
            }
        } else {
            alert("Please fill in all fields.");
        }
    });

    servicesTable.addEventListener("click", async function (event) {
        let target = event.target;
        let id = target.getAttribute("data-id");
        let row = target.closest("tr");

        if (target.classList.contains("edit-btn")) {
            if (target.textContent === "Edit") {
                row.cells[1].innerHTML = `<input type="text" value="${row.cells[1].textContent}" class="edit-input">`;
                row.cells[2].innerHTML = `<input type="number" value="${row.cells[2].textContent}" class="edit-input">`;
                row.cells[3].innerHTML = `<input type="text" value="${row.cells[3].textContent}" class="edit-input">`;
                target.textContent = "Save";
            } else {
                let newName = row.cells[1].querySelector(".edit-input").value.trim();
                let newPrice = row.cells[2].querySelector(".edit-input").value.trim();
                let newType = row.cells[3].querySelector(".edit-input").value.trim();

                if (newName && newPrice && newType) {
                    try {
                        const response = await fetch(`http://localhost:3002/services/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                Service_Name: newName,
                                Service_Price: newPrice,
                                service_type: newType,
                            }),
                        });

                        if (response.ok) {
                            fetchServices();
                        } else {
                            const errorData = await response.json();
                            alert("Error updating service: " + errorData.error);
                        }
                    } catch (error) {
                        console.error("Error updating service:", error);
                    }
                } else {
                    alert("Please fill in all fields.");
                }
            }
        } else if (target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this service?")) {
                try {
                    const response = await fetch(`http://localhost:3002/services/${id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        fetchServices();
                    } else {
                        const errorData = await response.json();
                        alert("Error deleting service: " + errorData.error);
                    }
                } catch (error) {
                    console.error("Error deleting service:", error);
                }
            }
        }
    });

    fetchServices(); // Fetch services on page load
    
    document.querySelector(".search-bar").addEventListener("input", function () {
        let searchQuery = this.value.toLowerCase();
        let rows = document.querySelectorAll("#services-table tr");
    
        rows.forEach(row => {
            let serviceName = row.cells[1].textContent.toLowerCase();
            let serviceType = row.cells[3].textContent.toLowerCase();
    
            if (serviceName.includes(searchQuery) || serviceType.includes(searchQuery)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
    
});
