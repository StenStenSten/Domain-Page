const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usr TEXT,
            pwd TEXT,
            email TEXT,
            phone TEXT,
            company_name TEXT,
            company_id TEXT
        )`);
    }
});

app.post("/save_data", (req, res) => {
    const { usr, pwd, email, phone, companyName, companyId } = req.body;

    db.run(
        `INSERT INTO users (usr, pwd, email, phone, company_name, company_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [usr, pwd, email, phone, companyName, companyId],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ message: "Data saved successfully", id: this.lastID });
        }
    );
});

console.log("Starting server");
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
