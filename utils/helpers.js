// src/utils/helpers.js

export const formatCurrency = (amount, currency = "USD") => {
  if (amount === undefined || amount === null) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date, format = "MMM DD, YYYY") => {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const formatDateTime = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return num.toLocaleString("en-US");
};

export const truncateText = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export const generateInvoiceNumber = () => {
  const prefix = "INV";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
