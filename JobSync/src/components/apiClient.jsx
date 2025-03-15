import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:80/capstone-project/jobsync/src/api',
});
//http://localhost:80/capstone-project/jobsync/
export default apiClient;
