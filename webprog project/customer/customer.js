document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3002/customer"; // Backend API
    const BARBER_API = "http://localhost:3002/barber";
    const SERVICE_API = "http://localhost:3002/services";

    const customerTable = document.getElementById("customer-table");
    const addForm = document.getElementById("addForm");
    const modal = document.getElementById("addModal");

    const customerBarber = document.getElementById("customerBarber");
    const customerService = document.getElementById("customerService");

    // Sidebar Toggle
    function toggleSidebar() {
        document.getElementById("sidebar").classList.toggle("open");
        document.body.classList.toggle("sidebar-open");
    }
    document.querySelector(".menu-icon").addEventListener("click", toggleSidebar);

    // Modal Functionality
    document.getElementById("openModal").addEventListener("click", () => {
        modal.style.display = "flex";
        loadBarbers();
        loadServices();
    });

    document.querySelector("#addModal .close-btn").addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });

    // Load Barbers into the Dropdown
    function loadBarbers() {
        fetch(BARBER_API)
            .then(response => response.json())
            .then(data => {
                customerBarber.innerHTML = '<option value="">Select Barber</option>';
                data.forEach(barber => {
                    customerBarber.innerHTML += `<option value="${barber.Barber_ID}">${barber.Barber_Name}</option>`;
                });
            })
            .catch(error => console.error("Error loading barbers:", error));
    }

    // Load Services into the Dropdown
    function loadServices() {
        fetch(SERVICE_API)
            .then(response => response.json())
            .then(data => {
                customerService.innerHTML = '<option value="">Select Service</option>';
                data.forEach(service => {
                    customerService.innerHTML += `<option value="${service.Service_ID}">${service.Service_Name}</option>`;
                });
            })
            .catch(error => console.error("Error loading services:", error));
    }

    // Function to fetch and display customers
    // Function to fetch and display customers
    function loadCustomers() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                customerTable.innerHTML = ""; // Clear table before loading new data
                data.forEach((customer, index) => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${customer.Customer_Name}</td>
                        <td>${customer.Customer_Number}</td>
                        <td>${customer.Barber_Name ? customer.Barber_Name : "N/A"}</td>
                        <td>${customer.Service_Name ? customer.Service_Name : "N/A"}</td>
                        <td>
                            <button class="edit-btn" data-id="${customer.Customer_ID}">Edit</button>
                            <button class="delete-btn" data-id="${customer.Customer_ID}">Delete</button>
                        </td>
                    `;
                    customerTable.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching customers:", error));
    }
    
    // Load customers on page load
    loadCustomers();

    // Handle form submission (Add Customer)
    addForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const customerData = {
            Customer_Name: document.getElementById("customerName").value,
            Customer_Number: document.getElementById("customerPhone").value,
            Barber_ID: customerBarber.value || null, // Default to null if not selected
            Service_ID: customerService.value || null // Default to null if not selected
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData)
        })
        .then(response => response.json())
        .then(() => {
            modal.style.display = "none";
            addForm.reset();
            loadCustomers(); // Refresh table
        })
        .catch(error => console.error("Error adding customer:", error));
    });

    // Handle Edit and Delete actions
    customerTable.addEventListener("click", function (event) {
        const target = event.target;
        const customerId = target.dataset.id;

        if (target.classList.contains("edit-btn")) {
            editCustomer(target, customerId);
        } else if (target.classList.contains("delete-btn")) {
            deleteCustomer(customerId);
        }
    });

    // Edit Customer
    function editCustomer(button, customerId) {
        const row = button.closest("tr");
        const cells = row.querySelectorAll("td");

        if (button.textContent === "Edit") {
            cells[1].innerHTML = `<input type="text" value="${cells[1].textContent}" class="edit-input">`;
            cells[2].innerHTML = `<input type="text" value="${cells[2].textContent}" class="edit-input">`;

            const barberName = cells[3].textContent;
            const serviceName = cells[4].textContent;

            cells[3].innerHTML = `<select class="edit-input">${customerBarber.innerHTML}</select>`;
            cells[4].innerHTML = `<select class="edit-input">${customerService.innerHTML}</select>`;

            // Preselect values
            cells[3].querySelector("select").value = getSelectedOption(customerBarber, barberName);
            cells[4].querySelector("select").value = getSelectedOption(customerService, serviceName);

            button.textContent = "Save";
        } else {
            const updatedData = {
                Customer_Name: cells[1].querySelector(".edit-input").value.trim(),
                Customer_Number: cells[2].querySelector(".edit-input").value.trim(),
                Barber_ID: cells[3].querySelector("select").value.trim(),
                Service_ID: cells[4].querySelector("select").value.trim()
            };

            fetch(`${API_URL}/${customerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            })
            .then(() => loadCustomers())
            .catch(error => console.error("Error updating customer:", error));
        }
    }

    // Delete Customer
    function deleteCustomer(customerId) {
        if (!confirm("Are you sure you want to delete this customer?")) return;

        fetch(`${API_URL}/${customerId}`, { method: "DELETE" })
        .then(() => loadCustomers())
        .catch(error => console.error("Error deleting customer:", error));
    }

    // Helper function to get the correct dropdown selection
    function getSelectedOption(selectElement, textValue) {
        for (let option of selectElement.options) {
            if (option.text === textValue) return option.value;
        }
        return "";
    }
});
