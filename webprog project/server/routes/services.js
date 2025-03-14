const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all services
router.get("/", (req, res) => {
    db.query("SELECT * FROM services", (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error fetching services", details: err.message });
        } else {
            res.json(result);
        }
    });
});

// ✅ Get a single service by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM services WHERE Service_ID = ?", [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error fetching service", details: err.message });
        } else if (result.length === 0) {
            res.status(404).json({ error: "Service not found." });
        } else {
            res.json(result[0]);
        }
    });
});

// ✅ Add a new service
router.post("/", (req, res) => {
    const { Service_Name, Service_Price, service_type } = req.body;

    if (!Service_Name || !Service_Price || !service_type) {
        return res.status(400).json({ error: "All fields (Service_Name, Service_Price, service_type) are required." });
    }

    const query = "INSERT INTO services (Service_Name, Service_Price, service_type) VALUES (?, ?, ?)";
    db.query(query, [Service_Name, Service_Price, service_type], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error adding service", details: err.message });
        } else {
            res.json({ message: "Service added successfully", id: result.insertId });
        }
    });
});

// ✅ Update a service
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { Service_Name, Service_Price, service_type } = req.body;

    if (!Service_Name || !Service_Price || !service_type) {
        return res.status(400).json({ error: "All fields (Service_Name, Service_Price, service_type) are required." });
    }

    const query = "UPDATE services SET Service_Name = ?, Service_Price = ?, service_type = ? WHERE Service_ID = ?";
    db.query(query, [Service_Name, Service_Price, service_type, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error updating service", details: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Service not found." });
        } else {
            res.json({ message: "Service updated successfully", id });
        }
    });
});

// ✅ Delete a service
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM services WHERE Service_ID = ?", [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error deleting service", details: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Service not found." });
        } else {
            res.json({ message: "Service deleted successfully" });
        }
    });
});

module.exports = router;
