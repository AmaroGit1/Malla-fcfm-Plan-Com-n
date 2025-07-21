document.addEventListener('DOMContentLoaded', function() {
    // Datos de los cursos
    const coursesData = [
        { 
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
        { 
            semester: "Semestre 2",
            courses: [
                { name: "Diferencial", credits: 6, prerequisites: [1], id: 7 },
                { name: "Lineal", credits: 6, prerequisites: [2], id: 8 },
                { name: "Moderna", credits: 6, prerequisites: [1, 2, 3], id: 9 },
                { name: "Programación", credits: 6, prerequisites: [], id: 10 },
                { name: "Proyectos", credits: 3, prerequisites: [5], id: 11 }
            ] 
        },
        { 
            semester: "Semestre 3",
            courses: [
                { name: "C.V.V", credits: 6, prerequisites: [7, 8], id: 12 },
                { name: "E.D.O", credits: 6, prerequisites: [7, 8], id: 13 },
                { name: "Mecánica", credits: 6, prerequisites: [7, 8, 9], id: 14 },
                { name: "Química", credits: 6, prerequisites: [9, 10], id: 15 },
                { name: "Métodos", credits: 6, prerequisites: [7, 9], id: 16 }
            ] 
        },
        { 
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
        totalCourses: coursesData.reduce((total, semester) => total + semester.courses.length, 0)
    };

    // Elementos del DOM
    const semestersContainer = document.getElementById('semesters-container');

    // Función para renderizar los cursos
    function renderCourses() {
        semestersContainer.innerHTML = '';

        coursesData.forEach(semester => {
            const semesterElement = document.createElement('div');
            semesterElement.className = 'semester';
            
            const semesterTitle = document.createElement('h2');
            semesterTitle.textContent = semester.semester;
            semesterElement.appendChild(semesterTitle);

            semester.courses.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.className = 'course';

                // Información del curso
                const courseInfo = document.createElement('div');
                courseInfo.className = 'course-info';
                
                const courseName = document.createElement('span');
                courseName.className = 'course-name';
                courseName.textContent = course.name;
                
                const courseCredits = document.createElement('span');
                courseCredits.className = 'course-credits';
                courseCredits.textContent = `${course.credits} CR`;
                
                courseInfo.appendChild(courseName);
                courseInfo.appendChild(courseCredits);
                courseElement.appendChild(courseInfo);

                // Prerrequisitos
                const prerequisites = document.createElement('div');
                prerequisites.className = 'prerequisites';
                
                if (course.prerequisites.length > 0) {
                    const prereqNames = course.prerequisites.map(id => {
                        const prereqCourse = coursesData
                            .flatMap(s => s.courses)
                            .find(c => c.id === id);
                        return prereqCourse ? prereqCourse.name : '';
                    }).filter(name => name !== '');
                    
                    prerequisites.textContent = `Prerrequisitos: ${prereqNames.join(', ')}`;
                } else {
                    prerequisites.textContent = 'Sin prerrequisitos';
                }
                courseElement.appendChild(prerequisites);

                // Botón del curso
                const courseBtn = document.createElement('button');
                courseBtn.className = 'course-btn';
                courseBtn.dataset.courseId = course.id;
                
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

                courseBtn.addEventListener('click', () => toggleCourseStatus(course.id));
                courseElement.appendChild(courseBtn);

                // ID del curso
                const courseId = document.createElement('span');
                courseId.className = 'course-id';
                courseId.textContent = `ID: ${course.id}`;
                courseElement.appendChild(courseId);

                semesterElement.appendChild(courseElement);
            });

            semestersContainer.appendChild(semesterElement);
        });
    }

    // Función para cambiar el estado del curso
    function toggleCourseStatus(courseId) {
        const index = state.approvedCourses.indexOf(courseId);
        
        if (index === -1) {
            state.approvedCourses.push(courseId);
        } else {
            state.approvedCourses.splice(index, 1);
        }
        
        localStorage.setItem('approvedCourses', JSON.stringify(state.approvedCourses));
        renderCourses();
    }

    // Inicializar la aplicación
    renderCourses();
});
