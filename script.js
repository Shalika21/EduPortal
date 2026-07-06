const API = "http://localhost:3000/students";

let selectedUSN = "";

// ================= STATUS =================

function showStatus(message, color = "green") {
    const statusBar = document.getElementById("statusBar");
    statusBar.innerHTML = message;
    statusBar.style.color = color;
}

// ================= SUMMARY =================

function updateSummary() {

    document.getElementById("sUSN").innerHTML =
        document.getElementById("usn").value || "-";

    document.getElementById("sName").innerHTML =
        document.getElementById("name").value || "-";

    document.getElementById("sSemester").innerHTML =
        document.getElementById("semester").value || "-";

    document.getElementById("sBranch").innerHTML =
        document.getElementById("branch").value || "-";

    document.getElementById("sDepartment").innerHTML =
        document.getElementById("department").value || "-";

    document.getElementById("sSGPA").innerHTML =
        document.getElementById("sgpa").value || "-";

    document.getElementById("sAttendance").innerHTML =
        document.getElementById("attendance").value
            ? document.getElementById("attendance").value + "%"
            : "-";

    document.getElementById("sStatus").innerHTML =
        document.getElementById("status").value || "-";
}

// ================= VALIDATION =================

function validateStudent() {

    let usn = document.getElementById("usn").value.trim();
    let name = document.getElementById("name").value.trim();
    let semester = document.getElementById("semester").value;
    let branch = document.getElementById("branch").value;
    let department = document.getElementById("department").value;
    let sgpa = document.getElementById("sgpa").value;
    let attendance = document.getElementById("attendance").value;
    let status = document.getElementById("status").value;

    if (
        usn === "" ||
        name === "" ||
        semester === "" ||
        branch === "" ||
        department === "" ||
        sgpa === "" ||
        attendance === "" ||
        status === ""
    ) {
        showStatus("Please fill all fields.", "red");
        return false;
    }

    if (sgpa < 0 || sgpa > 10) {
        showStatus("SGPA should be between 0 and 10.", "red");
        return false;
    }

    if (attendance < 0 || attendance > 100) {
        showStatus("Attendance should be between 0 and 100.", "red");
        return false;
    }

    updateSummary();

    showStatus("Validation Successful.", "green");

    return true;
}

// ================= ADD =================

async function addStudent() {

    if (!validateStudent()) return;

    const student = {

        usn: document.getElementById("usn").value,
        name: document.getElementById("name").value,
        semester: document.getElementById("semester").value,
        branch: document.getElementById("branch").value,
        department: document.getElementById("department").value,
        sgpa: document.getElementById("sgpa").value,
        attendance: document.getElementById("attendance").value,
        status: document.getElementById("status").value

    };

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)

        });

        if (!response.ok) {

            const data = await response.json();

            showStatus(data.message, "red");

            return;
        }

        showStatus("Student Record Added Successfully.", "green");

        clearForm();

        loadStudents();

    } catch {

        showStatus("Unable to connect to server.", "red");

    }

}

// ================= LOAD =================

async function loadStudents() {

    try {

        const response = await fetch(API);

        const students = await response.json();

        renderTable(students);

        document.getElementById("jsonDatabase").textContent =
            JSON.stringify(students, null, 4);

    }

    catch {

        showStatus("Unable to fetch server records.", "red");

    }

}

// ================= TABLE =================

function renderTable(students) {

    const tbody = document.querySelector("#studentTable tbody");

    tbody.innerHTML = "";

    students.forEach(student => {

        let row = `
        <tr onclick="selectStudent(
        '${student.usn}',
        '${student.name}',
        '${student.semester}',
        '${student.branch}',
        '${student.department}',
        '${student.sgpa}',
        '${student.attendance}',
        '${student.status}'
        )">

            <td>${student.usn}</td>
            <td>${student.name}</td>
            <td>${student.semester}</td>
            <td>${student.branch}</td>
            <td>${student.department}</td>
            <td>${student.sgpa}</td>
            <td>${student.attendance}%</td>
            <td>${student.status}</td>

        </tr>`;

        tbody.innerHTML += row;

    });

}

// ================= SELECT =================

function selectStudent(
    usn,
    name,
    semester,
    branch,
    department,
    sgpa,
    attendance,
    status
) {

    selectedUSN = usn;

    document.getElementById("usn").value = usn;
    document.getElementById("name").value = name;
    document.getElementById("semester").value = semester;
    document.getElementById("branch").value = branch;
    document.getElementById("department").value = department;
    document.getElementById("sgpa").value = sgpa;
    document.getElementById("attendance").value = attendance;
    document.getElementById("status").value = status;

    updateSummary();

}

// ================= UPDATE =================

async function updateStudent() {

    if (selectedUSN === "") {

        showStatus("Select a student first.", "red");

        return;

    }

    const student = {

        usn: document.getElementById("usn").value,
        name: document.getElementById("name").value,
        semester: document.getElementById("semester").value,
        branch: document.getElementById("branch").value,
        department: document.getElementById("department").value,
        sgpa: document.getElementById("sgpa").value,
        attendance: document.getElementById("attendance").value,
        status: document.getElementById("status").value

    };

    try {

        await fetch(API + "/" + selectedUSN, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(student)

        });

        showStatus("Student Record Updated Successfully.", "green");

        loadStudents();

    }

    catch {

        showStatus("Update Failed.", "red");

    }

}

// ================= DELETE =================

async function deleteStudent() {

    if (selectedUSN === "") {

        showStatus("Select a student first.", "red");

        return;

    }

    try {

        await fetch(API + "/" + selectedUSN, {

            method: "DELETE"

        });

        showStatus("Student Record Deleted Successfully.", "green");

        clearForm();

        loadStudents();

    }

    catch {

        showStatus("Delete Failed.", "red");

    }

}

// ================= CLEAR =================

function clearForm() {

    document.getElementById("usn").value = "";
    document.getElementById("name").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("branch").value = "";
    document.getElementById("department").value = "";
    document.getElementById("sgpa").value = "";
    document.getElementById("attendance").value = "";
    document.getElementById("status").value = "";

    selectedUSN = "";

    updateSummary();

    showStatus("Fields Cleared.", "blue");

}

// ================= INITIAL LOAD =================

window.onload = function () {

    loadStudents();

};