//choose color based on id on a colorwheel designed so that two consecutive ids have a color that is visually very distinct
//use 256 color, web based
//id is a string with alpha characters only from 2 chars or more
const colorFromId = (id) => {
  const colorwheel = [];
  //generate colorwheel
  for (let i = 0; i < 256; i++) {
    colorwheel.push(`#${i.toString(16).padStart(2, '0')}0000`);
  }
  for (let i = 0; i < 256; i++) {
    colorwheel.push(`#00${i.toString(16).padStart(2, '0')}00`);
  }
  for (let i = 0; i < 256; i++) {
    colorwheel.push(`#0000${i.toString(16).padStart(2, '0')}`);
  }
  //hash id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = colorwheel[Math.abs(hash) % colorwheel.length];
  return color;
};

//add <> to urls to prevent discord from embedding them
const preventEmbed = (url) => {
  if (!url || url === '') return '';
  return url.replace(/(https?:\/\/[^\s]+)/g, '<$1>');
};

//helper function to shift char code
const _shiftCharCode = (Δ) => (c) => String.fromCharCode(c.charCodeAt(0) + Δ);

//convert string to full width characters
const toFullWidthString = (str) =>
  str.replace(/[!-~]/g, _shiftCharCode(0xfee0));

//convert string to half width characters
const toHalfWidthString = (str) =>
  str.replace(/[！-～]/g, _shiftCharCode(-0xfee0));

//check if string is full width
const isFullWidthString = (str) => {
  return str.split('').some((c) => c.charCodeAt(0) > 0xff00);
};

//parse date string or date object to date object, if not possible return current date
const parseDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (date instanceof Date) {
    return date;
  }
  return new Date();
};

// 2022-12-28
const formatDateShort = (date) => {
  const d = new Date(date);
  // adds 0 if month or day is < 10
  const addZero = (n) => (n < 10 ? `0${n}` : n);
  return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(
    d.getDate()
  )}`;
};

const formatEmbedFieldDate = (date) => {
  return `📅 ${formatDateShort(parseDate(date))}`;
};

const formatChannelName = (name) => {
  return `#${name}`;
};

const formatUsername = (name) => {
  return `@${name}`;
};

module.exports = {
  colorFromId,
  preventEmbed,
  toFullWidthString,
  toHalfWidthString,
  isFullWidthString,
  parseDate,
  formatDateShort,
  formatEmbedFieldDate,
  formatChannelName,
  formatUsername,
};
