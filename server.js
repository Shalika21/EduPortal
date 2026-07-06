const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());
const path = require("path");

app.use(express.static(__dirname));
const FILE = "students.json";

// ---------------- READ DATABASE ----------------

function readStudents() {

    try {

        const data = fs.readFileSync(FILE);

        return JSON.parse(data);

    } catch {

        return [];

    }

}

// ---------------- WRITE DATABASE ----------------

function writeStudents(students) {

    fs.writeFileSync(FILE, JSON.stringify(students, null, 4));

}

// =================================================
// GET ALL STUDENTS
// =================================================

app.get("/students", (req, res) => {

    const students = readStudents();

    res.json(students);

});

// =================================================
// ADD STUDENT
// =================================================

app.post("/students", (req, res) => {

    const students = readStudents();

    const student = req.body;

    const exists = students.find(s => s.usn === student.usn);

    if (exists) {

        return res.status(400).json({

            message: "USN already exists."

        });

    }

    students.push(student);

    writeStudents(students);

    res.json({

        message: "Student Added Successfully."

    });

});

// =================================================
// UPDATE STUDENT
// =================================================

app.put("/students/:usn", (req, res) => {

    const students = readStudents();

    const usn = req.params.usn;

    const index = students.findIndex(s => s.usn === usn);

    if (index === -1) {

        return res.status(404).json({

            message: "Student not found."

        });

    }

    students[index] = req.body;

    writeStudents(students);

    res.json({

        message: "Student Updated Successfully."

    });

});

// =================================================
// DELETE STUDENT
// =================================================

app.delete("/students/:usn", (req, res) => {

    const students = readStudents();

    const usn = req.params.usn;

    const updatedStudents = students.filter(student => student.usn !== usn);

    if (students.length === updatedStudents.length) {

        return res.status(404).json({

            message: "Student not found."

        });

    }

    writeStudents(updatedStudents);

    res.json({

        message: "Student Deleted Successfully."

    });

});

// =================================================
// START SERVER
// =================================================

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});