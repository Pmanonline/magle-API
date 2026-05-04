const backendURL = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL
  : "http://localhost:5000";

export default backendURL;
