document.addEventListener('DOMContentLoaded', function() {
    // Datos de los cursos con colores temáticos
    const coursesData = [
        { // Semestre 1
            semester: "Semestre 1",
            courses: [
                { name: "Intro. Cálculo", credits: 6, prerequisites: [], id: 1, icon: "fa-square-root-alt" },
                { name: "Intro. Álgebra", credits: 6, prerequisites: [], id: 2, icon: "fa-infinity" },
                { name: "Intro. Física", credits: 6, prerequisites: [], id: 3, icon: "fa-atom" },
                { name: "Biología", credits: 3, prerequisites: [], id: 4, icon: "fa-dna" },
                { name: "Innovación", credits: 6, prerequisites: [], id: 5, icon: "fa-lightbulb" },
                { name: "Computación", credits: 3, prerequisites: [], id: 6, icon: "fa-laptop-code" }
            ]
        },
        { // Semestre 2
            semester: "Semestre 2",
            courses: [
                { name: "Diferencial", credits: 6, prerequisites: [1], id: 7, icon: "fa-calculator" },
                { name: "Lineal", credits: 6, prerequisites: [2], id: 8, icon: "fa-vector-square" },
                { name: "Moderna", credits: 6, prerequisites: [1, 2, 3], id: 9, icon: "fa-meteor" },
                { name: "Programación", credits: 6, prerequisites: [], id: 10, icon: "fa-code" },
                { name: "Proyectos", credits: 3, prerequisites: [5], id: 11, icon: "fa-project-diagram" }
            ]
        },
        { // Semestre 3
            semester: "Semestre 3",
            courses: [
                { name: "C.V.V", credits: 6, prerequisites: [7, 8], id: 12, icon: "fa-chart-line" },
                { name: "E.D.O", credits: 6, prerequisites: [7, 8], id: 13, icon: "fa-wave-square" },
                { name: "Mecánica", credits: 6, prerequisites: [7, 8, 9], id: 14, icon: "fa-cogs" },
                { name: "Química", credits: 6, prerequisites: [9, 10], id: 15, icon: "fa-flask" },
                { name: "Métodos", credits: 6, prerequisites: [7, 9], id: 16, icon: "fa-chart-bar" }
            ]
        },
        { // Semestre 4
            semester: "Semestre 4",
            courses: [
                { name: "C.A.A", credits: 6, prerequisites: [12, 13], id: 17, icon: "fa-project-diagram" },
                { name: "Economía", credits: 6, prerequisites: [12], id: 18, icon: "fa-money-bill-wave" },
                { name: "Electro", credits: 6, prerequisites: [12, 13, 14], id: 19, icon: "fa-bolt" },
                { name: "Termodinámica", credits: 6, prerequisites: [12, 14, 15], id: 20, icon: "fa-temperature-high" },
                { name: "Termodinámica Química", credits: 6, prerequisites: [12, 14, 15], id: 21, icon: "fa-vial" },
                { name: "Módulo Interdisciplinario", credits: 3, prerequisites: [16, 11], id: 22, icon: "fa-network-wired" }
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
    const semestersContainer = document.getElementById('semesters-container');
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
                
                // Agregar icono al nombre del curso
                if (course.icon) {
                    const icon = document.createElement('i');
                    icon.className = `fas ${course.icon}`;
                    icon.style.marginRight = '8px';
                    courseName.appendChild(icon);
                }
                
                courseName.appendChild(document.createTextNode(course.name));
                
                const courseCredits = document.createElement('span');
                courseCredits.className = 'course-credits';
                courseCredits.textContent = `${course.credits} CR`;
                
                courseInfo.appendChild(courseName);
                courseInfo.appendChild(courseCredits);
                courseElement.appendChild(courseInfo);
                
                const prerequisites = document.createElement('div');
                prerequisites.className = 'prerequisites';
                
                if (course.prerequisites.length > 0) {
                    const prereqNames = course.prerequisites.map(id => 
                        coursesData.flatMap(s => s.courses).find(c => c.id === id).name
                    );
                    prerequisites.textContent = `Prerrequisitos: ${prereqNames.join(', ')}`;
                } else {
                    prerequisites.textContent = 'Sin prerrequisitos';
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
                    courseBtn.innerHTML = `${course.name} <i class="fas fa-arrow-right"></i>`;
                } else {
                    courseBtn.classList.add('locked');
                    courseBtn.innerHTML = `${course.name} <i class="fas fa-lock"></i>`;
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
            // Efecto visual al aprobar
            const courseBtn = document.querySelector(`.course-btn[data-id="${courseId}"]`);
            courseBtn.classList.add('pulse-effect');
            setTimeout(() => courseBtn.classList.remove('pulse-effect'), 300);
            
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
        
        // Efecto de confeti al completar todo
        if (state.approvedCourses.length === state.totalCourses) {
            showCompletionEffect();
        }
    }

    // Efecto de finalización
    function showCompletionEffect() {
        const confettiSettings = {
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#64ffda', '#9d4edd', '#ff6d00', '#1a4b8c']
        };
        
        // Usar confetti.js si está disponible
        if (window.confetti) {
            confetti(confettiSettings);
        }
        
        // Mostrar mensaje
        setTimeout(() => {
            alert('¡Felicidades! Has completado todo el Plan Común FCFM 🎉');
        }, 800);
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
        progressText.textContent = `${progress}%`;
        
        // Animación de conteo
        animateValue(approvedCount, parseInt(approvedCount.textContent), approved, 500);
        animateValue(availableCount, parseInt(availableCount.textContent), available, 500);
        animateValue(remainingCount, parseInt(remainingCount.textContent), remaining, 500);
        
        const approvedCredits = coursesData.flatMap(semester => semester.courses)
            .filter(course => state.approvedCourses.includes(course.id))
            .reduce((total, course) => total + course.credits, 0);
        animateValue(totalCredits, parseInt(totalCredits.textContent), approvedCredits, 500);
    }

    // Animación de números
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Event listeners
    resetBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
            state.approvedCourses = [];
            localStorage.removeItem('approvedCourses');
            initMalla();
        }
    });

    saveBtn.addEventListener('click', () => {
        // Simplemente guardamos en localStorage, que ya lo hacemos al alternar cursos
        const toast = document.createElement('div');
        toast.textContent = 'Progreso guardado correctamente';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'var(--success-green)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = 'var(--border-radius)';
        toast.style.zIndex = '1000';
        toast.style.boxShadow = 'var(--box-shadow)';
        toast.style.animation = 'fadeInOut 2.5s ease-in-out';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2500);
    });

    // Inicializar la aplicación
    initMalla();

    // Agregar animación al cargar
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});
