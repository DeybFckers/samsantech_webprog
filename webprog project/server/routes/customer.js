const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all customers
router.get("/", (req, res) => {
    const query = `
        SELECT c.Customer_ID, c.Customer_Name, c.Customer_Number,
               b.Barber_Name, s.Service_Name
        FROM customer c
        LEFT JOIN barber b ON c.Barber_ID = b.Barber_ID
        LEFT JOIN services s ON c.Service_ID = s.Service_ID
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Add a new customer
router.post("/", (req, res) => {
    let { Customer_Name, Customer_Number, Barber_ID, Service_ID } = req.body;

    if (!Customer_Name || !Customer_Number) {
        return res.status(400).json({ error: "Customer_Name and Customer_Number are required." });
    }

    // Ensure Barber_ID and Service_ID are numbers or set them to NULL
    Barber_ID = Barber_ID ? Barber_ID : null;
    Service_ID = Service_ID ? Service_ID : null;

    const query = "INSERT INTO customer (Customer_Name, Customer_Number, Barber_ID, Service_ID) VALUES (?, ?, ?, ?)";
    db.query(query, [Customer_Name, Customer_Number, Barber_ID, Service_ID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, ...req.body });
    });
});


// ✅ Update customer
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { Customer_Name, Customer_Number, Barber_ID, Service_ID } = req.body;

    if (!Customer_Name || !Customer_Number) {
        return res.status(400).json({ error: "Customer_Name and Customer_Number are required." });
    }

    const query = "UPDATE customer SET Customer_Name = ?, Customer_Number = ?, Barber_ID = ?, Service_ID = ? WHERE Customer_ID = ?";
    db.query(query, [Customer_Name, Customer_Number, Barber_ID, Service_ID, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Customer not found." });
        }
        res.json({ id, ...req.body });
    });
});

// ✅ Delete customer
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM customer WHERE Customer_ID = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Customer not found." });
        }
        res.status(204).send();
    });
});

module.exports = router;
