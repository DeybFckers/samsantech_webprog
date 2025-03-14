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
    const barberTable = document.getElementById("barber-table");

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

    async function fetchBarbers() {
        try {
            const response = await fetch("http://localhost:3002/barber");
            const barbers = await response.json();
            barberTable.innerHTML = "";

            barbers.forEach((barber, index) => {
                let newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${barber.Barber_Name}</td>
                    <td>${barber.Barber_Address}</td>
                    <td>${barber.Contact_Details}</td>
                    <td>
                        <button class="edit-btn" data-id="${barber.Barber_ID}">Edit</button>
                        <button class="delete-btn" data-id="${barber.Barber_ID}">Delete</button>
                    </td>
                `;
                barberTable.appendChild(newRow);
            });
        } catch (error) {
            console.error("Error fetching barbers:", error);
        }
    }

    addForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let name = document.getElementById("barberName").value.trim();
        let address = document.getElementById("barberAddress").value.trim();
        let phone = document.getElementById("barberPhone").value.trim();

        if (name && address && phone) {
            try {
                const response = await fetch("http://localhost:3002/barber", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Barber_Name: name,
                        Barber_Address: address,
                        Contact_Details: phone,
                    }),
                });

                if (response.ok) {
                    fetchBarbers();
                    modal.style.display = "none";
                    addForm.reset();
                } else {
                    const errorData = await response.json();
                    alert("Error adding barber: " + errorData.error);
                }
            } catch (error) {
                console.error("Error adding barber:", error);
            }
        } else {
            alert("Please fill in all fields.");
        }
    });

    barberTable.addEventListener("click", async function (event) {
        let target = event.target;
        let id = target.getAttribute("data-id");
        let row = target.closest("tr");

        if (target.classList.contains("edit-btn")) {
            if (target.textContent === "Edit") {
                row.cells[1].innerHTML = `<input type="text" value="${row.cells[1].textContent}" class="edit-input">`;
                row.cells[2].innerHTML = `<input type="text" value="${row.cells[2].textContent}" class="edit-input">`;
                row.cells[3].innerHTML = `<input type="text" value="${row.cells[3].textContent}" class="edit-input">`;
                target.textContent = "Save";
            } else {
                let newName = row.cells[1].querySelector(".edit-input").value.trim();
                let newAddress = row.cells[2].querySelector(".edit-input").value.trim();
                let newPhone = row.cells[3].querySelector(".edit-input").value.trim();

                if (newName && newAddress && newPhone) {
                    try {
                        const response = await fetch(`http://localhost:3002/barber/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                Barber_Name: newName,
                                Barber_Address: newAddress,
                                Contact_Details: newPhone,
                            }),
                        });

                        if (response.ok) {
                            fetchBarbers();
                        } else {
                            const errorData = await response.json();
                            alert("Error updating barber: " + errorData.error);
                        }
                    } catch (error) {
                        console.error("Error updating barber:", error);
                    }
                } else {
                    alert("Please fill in all fields.");
                }
            }
        } else if (target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this barber?")) {
                try {
                    const response = await fetch(`http://localhost:3002/barber/${id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        fetchBarbers();
                    } else {
                        const errorData = await response.json();
                        alert("Error deleting barber: " + errorData.error);
                    }
                } catch (error) {
                    console.error("Error deleting barber:", error);
                }
            }
        }
    });

    document.querySelector(".search-bar").addEventListener("input", function () {
        let searchValue = this.value.toLowerCase();
        let rows = document.querySelectorAll("#barber-table tr");
    
        rows.forEach((row) => {
            let name = row.cells[1].textContent.toLowerCase();
            let address = row.cells[2].textContent.toLowerCase();
            let phone = row.cells[3].textContent.toLowerCase();
    
            if (name.includes(searchValue) || address.includes(searchValue) || phone.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
    

    fetchBarbers();

    window.onload = function () {
        document.activeElement.blur();
    };
});
