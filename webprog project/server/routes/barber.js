const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all barbers
router.get("/", (req, res) => {
    db.query("SELECT * FROM barber", (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error fetching barbers", details: err.message });
        } else {
            res.json(result);
        }
    });
});

// ✅ Add a new barber
router.post("/", (req, res) => {
    const { Barber_Name, Barber_Address, Contact_Details } = req.body;

    if (!Barber_Name || !Barber_Address || !Contact_Details) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = "INSERT INTO barber (Barber_Name, Barber_Address, Contact_Details) VALUES (?, ?, ?)";
    db.query(query, [Barber_Name, Barber_Address, Contact_Details], (err, result) => {
        if (err) {
            console.error("Database Insert Error:", err); // Logs error in terminal
            res.status(500).json({ error: "Error adding barber", details: err.message });
        } else {
            res.json({ message: "Barber added successfully", id: result.insertId });
        }
    });
});


router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { Barber_Name, Barber_Address, Contact_Details } = req.body;

    if (!Barber_Name || !Barber_Address || !Contact_Details) {
        return res.status(400).json({ error: "All fields (Barber_Name, Barber_Address, Contact_Details) are required." });
    }

    const query = "UPDATE barber SET Barber_Name = ?, Barber_Address = ?, Contact_Details = ? WHERE Barber_ID = ?";
    db.query(query, [Barber_Name, Barber_Address, Contact_Details, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error updating barber", details: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Barber not found." });
        } else {
            res.json({ message: "Barber updated successfully", id });
        }
    });
});

// ✅ Delete a barber
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM barber WHERE Barber_ID = ?", [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error deleting barber", details: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Barber not found." });
        } else {
            res.json({ message: "Barber deleted successfully" });
        }
    });
});

module.exports = router;
