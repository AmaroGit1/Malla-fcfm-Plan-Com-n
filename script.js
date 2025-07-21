document.addEventListener('DOMContentLoaded', () => {

    const coursesData = [
        // Semestre 1
        { id: 1, name: 'Intro. Cálculo', credits: 6, semester: 1, prereqs: [] },
        { id: 2, name: 'Intro. Álgebra', credits: 6, semester: 1, prereqs: [] },
        { id: 3, name: 'Intro. Física', credits: 6, semester: 1, prereqs: [] },
        { id: 4, name: 'Biología', credits: 3, semester: 1, prereqs: [] },
        { id: 5, name: 'Innovación', credits: 6, semester: 1, prereqs: [] },
        { id: 6, name: 'Computación', credits: 3, semester: 1, prereqs: [] },
        // Semestre 2
        { id: 7, name: 'Diferencial', credits: 6, semester: 2, prereqs: [1] },
        { id: 8, name: 'Lineal', credits: 6, semester: 2, prereqs: [2] },
        { id: 9, name: 'Moderna', credits: 6, semester: 2, prereqs: [1, 2, 3] },
        { id: 10, name: 'Programación', credits: 6, semester: 2, prereqs: [] },
        { id: 11, name: 'Proyectos', credits: 3, semester: 2, prereqs: [5] },
        // Semestre 3
        { id: 12, name: 'C.V.V', credits: 6, semester: 3, prereqs: [7, 8] },
        { id: 13, name: 'E.D.O', credits: 6, semester: 3, prereqs: [7, 8] },
        { id: 14, name: 'Mecánica', credits: 6, semester: 3, prereqs: [7, 8, 9] },
        { id: 15, name: 'Química', credits: 6, semester: 3, prereqs: [9, 10] },
        { id: 16, name: 'Métodos', credits: 6, semester: 3, prereqs: [7, 9] },
        // Semestre 4
        { id: 17, name: 'C.A.A', credits: 6, semester: 4, prereqs: [12, 13] },
        { id: 18, name: 'Economía', credits: 6, semester: 4, prereqs: [12] },
        { id: 19, name: 'Electro', credits: 6, semester: 4, prereqs: [12, 13, 14] },
        { id: 20, name: 'Termodinámica', credits: 6, semester: 4, prereqs: [12, 14, 15] },
        { id: 21, name: 'Termodinámica Química', credits: 6, semester: 4, prereqs: [12, 14, 15] },
        { id: 22, name: 'Módulo Interdisciplinario', credits: 3, semester: 4, prereqs: [16, 11] }
    ];

    let approvedCourses = new Set(JSON.parse(localStorage.getItem('approvedCourses')) || []);
    const totalCredits = coursesData.reduce((sum, course) => sum + course.credits, 0);

    const grid = document.getElementById('curriculum-grid');
    const resetButton = document.getElementById('reset-button');
    
    const updateProgress = () => {
        const approvedCredits = coursesData
            .filter(course => approvedCourses.has(course.id))
            .reduce((sum, course) => sum + course.credits, 0);

        const progressPercentage = (approvedCredits / totalCredits) * 100;
        
        document.getElementById('credits-approved').textContent = approvedCredits;
        document.getElementById('credits-total').textContent = totalCredits;
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    };
    
    const checkAvailability = (course) => {
        if (course.prereqs.length === 0) return true;
        return course.prereqs.every(prereqId => approvedCourses.has(prereqId));
    };

    const renderCourses = () => {
        coursesData.forEach(course => {
            const container = document.getElementById(`semester-${course.semester}`);
            if (!container) return; // Si no existe el contenedor del semestre, no hacer nada

            // Limpiar contenedor solo una vez al principio del renderizado total
            if (!container.hasAttribute('data-rendered')) {
                 container.innerHTML = '';
                 container.setAttribute('data-rendered', 'true');
            }
        });

        // Limpiar atributo para el próximo renderizado completo
        document.querySelectorAll('[data-rendered]').forEach(el => el.removeAttribute('data-rendered'));

        coursesData.forEach(course => {
            const container = document.getElementById(`semester-${course.semester}`);
            const card = document.createElement('div');
            card.className = 'course-card';
            card.dataset.id = course.id;

            let status = 'locked';
            if (approvedCourses.has(course.id)) {
                status = 'approved';
            } else if (checkAvailability(course)) {
                status = 'available';
            }
            card.classList.add(status);

            card.innerHTML = `
                <div class="course-name">${course.name}</div>
                <div class="course-credits">Cr ${course.credits}</div>
                <div class="course-prereqs">Req: ${course.prereqs.length > 0 ? course.prereqs.join(', ') : 'Ninguno'}</div>
                <div class="course-id">ID: ${course.id}</div>
            `;
            container.appendChild(card);
        });
        updateProgress();
    };

    const handleCourseClick = (e) => {
        const card = e.target.closest('.course-card');
        if (!card || !card.classList.contains('available')) return;
        
        const courseId = parseInt(card.dataset.id, 10);
        
        approvedCourses.add(courseId);
        localStorage.setItem('approvedCourses', JSON.stringify([...approvedCourses]));
        
        renderCourses();
    };

    const handleReset = () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
            approvedCourses.clear();
            localStorage.removeItem('approvedCourses');
            renderCourses();
        }
    };

    grid.addEventListener('click', handleCourseClick);
    resetButton.addEventListener('click', handleReset);

    // Initial Render
    renderCourses();
});
