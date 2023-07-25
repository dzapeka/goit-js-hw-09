import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startBtn = document.querySelector('button[data-start]');
const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

const TIMER_DEFAULT_INTERVAL = 1000;
const TIMER_FAILURE_MSG = 'Please choose a date in the future';
const TIMER_SUCCESS_MSG = "It's Time to Stop!!!";

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

    if (!isDateInFuture(selectedDate)) {
      Notify.failure(TIMER_FAILURE_MSG);
      return;
    }
    startBtn.disabled = false;
  },
};

flatpickr('input#datetime-picker', options);

startBtn.addEventListener('click', startTimerHandler);

function startTimerHandler() {
  startBtn.disabled = true;

  // Display remaining time before starting a new timer.
  // Useful for cases with large intervals.
  updateRemainingTime();

  timerId = setInterval(updateRemainingTime, TIMER_DEFAULT_INTERVAL);
}

function updateRemainingTime() {
  let remainingTime = getRemainingTime(selectedDate);

  if (remainingTime <= 0) {
    handleTimerExpiration();
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(remainingTime);

  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function handleTimerExpiration() {
  // If the timer started with a delay and the selected date is already in the past.
  if (!timerId) {
    Notify.failure(TIMER_FAILURE_MSG);
    return;
  }

  clearInterval(timerId);
  Notify.success(TIMER_SUCCESS_MSG);
}

function getRemainingTime(selectedDate) {
  const currentDate = new Date();
  return selectedDate - currentDate;
}

function addLeadingZero(value) {
  return `${value}`.padStart(2, '0');
}

function isDateInFuture(selectedDate) {
  const currentDate = new Date();
  return selectedDate > currentDate;
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
