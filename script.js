const courses = [
    {id: 1, name: "Intro. Cálculo", credits: 6, prereqs: []},
    {id: 2, name: "Intro. Álgebra", credits: 6, prereqs: []},
    {id: 3, name: "Intro. Física", credits: 6, prereqs: []},
    {id: 4, name: "Biología", credits: 3, prereqs: []},
    {id: 5, name: "Innovación", credits: 6, prereqs: []},
    {id: 6, name: "Computación", credits: 3, prereqs: []},
    {id: 7, name: "Diferencial", credits: 6, prereqs: [1]},
    {id: 8, name: "Lineal", credits: 6, prereqs: [2]},
    {id: 9, name: "Moderna", credits: 6, prereqs: [1,2,3]},
    {id: 10, name: "Programación", credits: 6, prereqs: []},
    {id: 11, name: "Proyectos", credits: 3, prereqs: [5]},
    {id: 12, name: "C.V.V", credits: 6, prereqs: [7,8]},
    {id: 13, name: "E.D.O", credits: 6, prereqs: [7,8]},
    {id: 14, name: "Mecánica", credits: 6, prereqs: [7,8,9]},
    {id: 15, name: "Química", credits: 6, prereqs: [9,10]},
    {id: 16, name: "Métodos", credits: 6, prereqs: [7,9]},
    {id: 17, name: "C.A.A", credits: 6, prereqs: [12,13]},
    {id: 18, name: "Economía", credits: 6, prereqs: [12]},
    {id: 19, name: "Electro", credits: 6, prereqs: [12,13,14]},
    {id: 20, name: "Termodinámica", credits: 6, prereqs: [12,14,15]},
    {id: 21, name: "Termodinámica Química", credits: 6, prereqs: [12,14,15]},
    {id: 22, name: "Módulo interdisciplinario", credits: 3, prereqs: [16,11]}
];

const grid = document.getElementById('grid');
const approved = JSON.parse(localStorage.getItem('approvedCourses')) || [];

function renderCourses() {
    grid.innerHTML = "";
    courses.forEach(course => {
        const isUnlocked = course.prereqs.every(p => approved.includes(p));
        const div = document.createElement('div');
        div.className = `course ${isUnlocked ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <h2>${course.name}</h2>
            <p>Créditos: ${course.credits}</p>
            <p>Prerrequisitos: ${course.prereqs.length ? course.prereqs.join(', ') : 'Ninguno'}</p>
            <span class="id">ID: ${course.id}</span>
        `;
        if (isUnlocked) {
            div.addEventListener('click', () => {
                if (!approved.includes(course.id)) {
                    approved.push(course.id);
                    localStorage.setItem('approvedCourses', JSON.stringify(approved));
                    renderCourses();
                }
            });
        }
        grid.appendChild(div);
    });
}

renderCourses();
    
