import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:80/jobsync/jobsync/src/api',
});
//http://localhost:80/capstone-project/jobsync/
export default apiClient;
