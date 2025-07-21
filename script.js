document.addEventListener('DOMContentLoaded', function() {
    // Datos de los cursos por semestre
    const coursesData = [
        { // Semestre 1
            semester: "Semestre 1",
            courses: [
                { name: "Intro. Cálculo", credits: 6, prerequisites: [], id: 1 },
                { name: "Intro. Álgebra", credits: 6, prerequisites: [], id: 2 },
                { name: "Intro. Física", credits: 6, prerequisites: [], id: 3 },
                { name: "Biología", credits: 3, prerequisites: [], id: 4 },
                { name: "Innovación", credits: 6, prerequisites: [], id: 5 },
                { name: "Computación", credits: 3, prerequisites: [], id: 6 }
            ]
        },
        { // Semestre 2
            semester: "Semestre 2",
            courses: [
                { name: "Diferencial", credits: 6, prerequisites: [1], id: 7 },
                { name: "Lineal", credits: 6, prerequisites: [2], id: 8 },
                { name: "Moderna", credits: 6, prerequisites: [1, 2, 3], id: 9 },
                { name: "Programación", credits: 6, prerequisites: [], id: 10 },
                { name: "Proyectos", credits: 3, prerequisites: [5], id: 11 }
            ]
        },
        { // Semestre 3
            semester: "Semestre 3",
            courses: [
                { name: "C.V.V", credits: 6, prerequisites: [7, 8], id: 12 },
                { name: "E.D.O", credits: 6, prerequisites: [7, 8], id: 13 },
                { name: "Mecánica", credits: 6, prerequisites: [7, 8, 9], id: 14 },
                { name: "Química", credits: 6, prerequisites: [9, 10], id: 15 },
                { name: "Métodos", credits: 6, prerequisites: [7, 9], id: 16 }
            ]
        },
        { // Semestre 4
            semester: "Semestre 4",
            courses: [
                { name: "C.A.A", credits: 6, prerequisites: [12, 13], id: 17 },
                { name: "Economía", credits: 6, prerequisites: [12], id: 18 },
                { name: "Electro", credits: 6, prerequisites: [12, 13, 14], id: 19 },
                { name: "Termodinámica", credits: 6, prerequisites: [12, 14, 15], id: 20 },
                { name: "Termodinámica Química", credits: 6, prerequisites: [12, 14, 15], id: 21 },
                { name: "Módulo Interdisciplinario", credits: 3, prerequisites: [16, 11], id: 22 }
            ]
        }
    ];

    // Estado de la aplicación
    const state = {
        approvedCourses: JSON.parse(localStorage.getItem('approvedCourses')) || [],
        totalCourses: coursesData.reduce((total, semester) => total + semester.courses.length, 0),
        totalCredits: coursesData.flatMap(semester => semester.courses).reduce((total, course) => total + course.credits, 0)
    };

    // Elementos del DOM
    const semestersContainer = document.querySelector('.semesters-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const approvedCount = document.getElementById('approved-count');
    const availableCount = document.getElementById('available-count');
    const remainingCount = document.getElementById('remaining-count');
    const totalCredits = document.getElementById('total-credits');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');

    // Inicializar la malla
    function initMalla() {
        semestersContainer.innerHTML = '';
        
        coursesData.forEach(semesterData => {
            const semesterElement = document.createElement('div');
            semesterElement.className = 'semester';
            
            const semesterTitle = document.createElement('h2');
            semesterTitle.textContent = semesterData.semester;
            semesterElement.appendChild(semesterTitle);
            
            semesterData.courses.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.className = 'course';
                
                const courseInfo = document.createElement('div');
                courseInfo.className = 'course-info';
                
                const courseName = document.createElement('span');
                courseName.className = 'course-name';
                courseName.textContent = course.name;
                
                const courseCredits = document.createElement('span');
                courseCredits.className = 'course-credits';
                courseCredits.textContent = `Cr ${course.credits}`;
                
                courseInfo.appendChild(courseName);
                courseInfo.appendChild(courseCredits);
                courseElement.appendChild(courseInfo);
                
                const prerequisites = document.createElement('div');
                prerequisites.className = 'prerequisites';
                
                if (course.prerequisites.length > 0) {
                    const prereqNames = course.prerequisites.map(id => 
                        coursesData.flatMap(s => s.courses).find(c => c.id === id).name
                    );
                    prerequisites.textContent = `Requiere: ${prereqNames.join(', ')}`;
                }
                
                courseElement.appendChild(prerequisites);
                
                const courseBtn = document.createElement('button');
                courseBtn.className = 'course-btn';
                courseBtn.dataset.id = course.id;
                
                const isApproved = state.approvedCourses.includes(course.id);
                const isAvailable = course.prerequisites.every(prereq => 
                    state.approvedCourses.includes(prereq)
                );
                
                if (isApproved) {
                    courseBtn.classList.add('approved');
                    courseBtn.innerHTML = `${course.name} <i class="fas fa-check"></i>`;
                } else if (isAvailable) {
                    courseBtn.textContent = course.name;
                } else {
                    courseBtn.classList.add('locked');
                    courseBtn.textContent = course.name;
                    courseBtn.disabled = true;
                }
                
                courseBtn.addEventListener('click', () => toggleCourse(course.id));
                courseElement.appendChild(courseBtn);
                
                const courseId = document.createElement('span');
                courseId.className = 'course-id';
                courseId.textContent = `ID: ${course.id}`;
                courseElement.appendChild(courseId);
                
                semesterElement.appendChild(courseElement);
            });
            
            semestersContainer.appendChild(semesterElement);
        });
        
        updateStats();
    }

    // Alternar estado de aprobación de un curso
    function toggleCourse(courseId) {
        const index = state.approvedCourses.indexOf(courseId);
        
        if (index === -1) {
            state.approvedCourses.push(courseId);
        } else {
            state.approvedCourses.splice(index, 1);
        }
        
        // Verificar si algún curso aprobado depende de este
        if (index !== -1) {
            const dependentCourses = coursesData.flatMap(semester => semester.courses)
                .filter(course => course.prerequisites.includes(courseId))
                .map(course => course.id);
            
            dependentCourses.forEach(depId => {
                if (state.approvedCourses.includes(depId)) {
                    state.approvedCourses.splice(state.approvedCourses.indexOf(depId), 1);
                }
            });
        }
        
        localStorage.setItem('approvedCourses', JSON.stringify(state.approvedCourses));
        initMalla();
    }

    // Actualizar estadísticas
    function updateStats() {
        const approved = state.approvedCourses.length;
        const available = coursesData.flatMap(semester => semester.courses)
            .filter(course => 
                !state.approvedCourses.includes(course.id) && 
                course.prerequisites.every(prereq => state.approvedCourses.includes(prereq))
            ).length;
        const remaining = state.totalCourses - approved;
        
        const progress = Math.round((approved / state.totalCourses) * 100);
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% completado`;
        
        approvedCount.textContent = approved;
        availableCount.textContent = available;
        remainingCount.textContent = remaining;
        
        const approvedCredits = coursesData.flatMap(semester => semester.courses)
            .filter(course => state.approvedCourses.includes(course.id))
            .reduce((total, course) => total + course.credits, 0);
        totalCredits.textContent = approvedCredits;
    }

    // Event listeners
    resetBtn.addEventListener('click', () => {
        state.approvedCourses = [];
        localStorage.removeItem('approvedCourses');
        initMalla();
    });

    saveBtn.addEventListener('click', () => {
        // Simplemente guardamos en localStorage, que ya lo hacemos al alternar cursos
        alert('Progreso guardado correctamente');
    });

    // Inicializar la aplicación
    initMalla();
});
