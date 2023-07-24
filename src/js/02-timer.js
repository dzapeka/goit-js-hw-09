import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startBtn = document.querySelector('button[data-start]');
const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

const DEFAULT_TIMER_INTERVAL = 1000;

let timerId = null;
let selectedDate = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      Notify.failure('Please choose a date in the future');
      return;
    }
    startBtn.disabled = false;
  },
};

flatpickr('input#datetime-picker', options);

startBtn.addEventListener('click', startTimerHandler);

function startTimerHandler() {
  startBtn.disabled = true;
  updateRemainingTime(selectedDate);
  timerId = setInterval(
    updateRemainingTime,
    DEFAULT_TIMER_INTERVAL,
    selectedDate
  );
}

function updateRemainingTime(selctedDate) {
  let remainingTime = selctedDate - new Date();
  if (remainingTime <= 0) {
    clearInterval(timerId);
    remainingTime = 0;
  }
  const { days, hours, minutes, seconds } = convertMs(remainingTime);

  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return `${value}`.padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
