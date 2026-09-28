const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Allow JSON data
app.use(express.json());

// Serve index.html
app.use(express.static(__dirname));

// ========================================
// Database Connection
// ========================================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL database");
});

// ========================================
// Routes
// ========================================

// RETRIEVE
app.get("/api/students", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// INSERT
app.post("/api/students", (req, res) => {
    const { name, course, year_level } = req.body;
    db.query(
        "INSERT INTO students (name, course, year_level) VALUES (?, ?, ?)",
        [name, course, year_level],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, name, course, year_level });
        }
    );
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
