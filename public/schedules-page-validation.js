//  Nav bar selection elements
const weekElements = document.querySelectorAll('.nav-link');
// schedule cards
const schedules = document.querySelectorAll('.scheduleItem');
// days of the week inside the cards
const scheduleDays = document.querySelectorAll('.week-day');

weekElements.forEach((day, index) => {
    day.onclick = () => {
        
        let c = 0;
        while (c < weekElements.length) {
            weekElements[c++].className = 'nav-link';
        }
        day.className = 'nav-link active';

        scheduleDays.forEach((daysInSchedule, index) => {
            const daysAvailable = daysInSchedule.innerHTML.split(' ');
            const dayValue = daysAvailable[daysAvailable.length - 1].toLowerCase();

            if (day.id === 'all') {
                schedules[index].classList.remove('hidden')
            } else if (day.id === dayValue) {
                schedules[index].className = 'col-md-6 scheduleItem';          
            } else {
                schedules[index].className = 'col-md-6 scheduleItem hidden'; 
            }
        })
    }
});