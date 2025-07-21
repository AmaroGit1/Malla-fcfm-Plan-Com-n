document.querySelectorAll('.course').forEach(course => {
    const courseId = parseInt(course.dataset.id);
    const prereqs = course.dataset.prereqs ? course.dataset.prereqs.split(',').map(Number) : [];
    const approved = JSON.parse(localStorage.getItem('approvedCourses')) || [];

    const isUnlocked = prereqs.every(p => approved.includes(p));

    if (approved.includes(courseId)) {
        course.classList.add('completed');
    } else if (isUnlocked) {
        course.classList.add('unlocked');
        course.addEventListener('click', () => {
            approved.push(courseId);
            localStorage.setItem('approvedCourses', JSON.stringify(approved));
            location.reload();
        });
    } else {
        course.classList.add('locked');
    }
});
}

renderCourses();
    
