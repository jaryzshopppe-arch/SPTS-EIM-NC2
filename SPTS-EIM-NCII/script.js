let students = JSON.parse(localStorage.getItem('students')) || [];
let currentStudentIndex = -1;
let currentCompetencyIndex = -1;

const studentForm = document.getElementById('studentForm');
const competencyForm = document.getElementById('competencyForm');
const studentsDiv = document.getElementById('students');
const cancelEditBtn = document.getElementById('cancelEdit');
const backToStudentsBtn = document.getElementById('backToStudents');

function renderStudents() {
    studentsDiv.innerHTML = '';
    students.forEach((student, index) => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student-item';
        studentDiv.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>Qualification:</strong> ${student.qualification}</p>
            <p><strong>Training Center:</strong> ${student.trainingCenter}</p>
            <p><strong>Trainer:</strong> ${student.trainer}</p>
            <p><strong>Section:</strong> ${student.section}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <button onclick="editStudent(${index})">Edit Student</button>
            <button onclick="manageCompetencies(${index})">Manage Competencies</button>
            <button onclick="deleteStudent(${index})">Delete Student</button>
            <table class="competency-table">
                <thead>
                    <tr>
                        <th>Competency</th>
                        <th>Status</th>
                        <th>Date Started</th>
                        <th>Date Completed</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${student.competencies.map((comp, compIndex) => `
                        <tr>
                            <td>${comp.name}</td>
                            <td>${comp.status}</td>
                            <td>${comp.dateStarted || ''}</td>
                            <td>${comp.dateCompleted || ''}</td>
                            <td>${comp.remarks || ''}</td>
                            <td>
                                <button onclick="editCompetency(${index}, ${compIndex})">Edit</button>
                                <button onclick="deleteCompetency(${index}, ${compIndex})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        studentsDiv.appendChild(studentDiv);
    });
}

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const student = {
        name: document.getElementById('studentName').value,
        qualification: document.getElementById('qualification').value,
        trainingCenter: document.getElementById('trainingCenter').value,
        trainer: document.getElementById('trainer').value,
        section: document.getElementById('section').value,
        gender: document.getElementById('gender').value,
        competencies: currentStudentIndex >= 0 ? students[currentStudentIndex].competencies : []
    };
    if (currentStudentIndex >= 0) {
        students[currentStudentIndex] = student;
    } else {
        students.push(student);
    }
    localStorage.setItem('students', JSON.stringify(students));
    studentForm.reset();
    studentForm.classList.remove('hidden');
    competencyForm.classList.add('hidden');
    currentStudentIndex = -1;
    renderStudents();
});

competencyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const competency = {
        name: document.getElementById('competencyName').value,
        status: document.querySelector('input[name="status"]:checked').value,
        dateStarted: document.getElementById('dateStarted').value,
        dateCompleted: document.getElementById('dateCompleted').value,
        remarks: document.getElementById('remarks').value
    };
    if (currentCompetencyIndex >= 0) {
        students[currentStudentIndex].competencies[currentCompetencyIndex] = competency;
    } else {
        students[currentStudentIndex].competencies.push(competency);
    }
    localStorage.setItem('students', JSON.stringify(students));
    competencyForm.reset();
    competencyForm.classList.add('hidden');
    studentForm.classList.remove('hidden');
    currentCompetencyIndex = -1;
    renderStudents();
});

function editStudent(index) {
    currentStudentIndex = index;
    const student = students[index];
    document.getElementById('studentName').value = student.name;
    document.getElementById('qualification').value = student.qualification;
    document.getElementById('trainingCenter').value = student.trainingCenter;
    document.getElementById('trainer').value = student.trainer;
    document.getElementById('section').value = student.section;
    document.getElementById('gender').value = student.gender;
    studentForm.classList.remove('hidden');
    competencyForm.classList.add('hidden');
}

function manageCompetencies(index) {
    currentStudentIndex = index;
    studentForm.classList.add('hidden');
    competencyForm.classList.remove('hidden');
}

function editCompetency(studentIndex, compIndex) {
    currentStudentIndex = studentIndex;
    currentCompetencyIndex = compIndex;
    const comp = students[studentIndex].competencies[compIndex];
    document.getElementById('competencyName').value = comp.name;
    document.querySelector(`input[name="status"][value="${comp.status}"]`).checked = true;
    document.getElementById('dateStarted').value = comp.dateStarted;
    document.getElementById('dateCompleted').value = comp.dateCompleted;
    document.getElementById('remarks').value = comp.remarks;
    studentForm.classList.add('hidden');
    competencyForm.classList.remove('hidden');
}

function deleteCompetency(studentIndex, compIndex) {
    students[studentIndex].competencies.splice(compIndex, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
}

cancelEditBtn.addEventListener('click', () => {
    studentForm.reset();
    currentStudentIndex = -1;
    studentForm.classList.remove('hidden');
    competencyForm.classList.add('hidden');
});

backToStudentsBtn.addEventListener('click', () => {
    competencyForm.reset();
    currentCompetencyIndex = -1;
    competencyForm.classList.add('hidden');
    studentForm.classList.remove('hidden');
});

renderStudents();