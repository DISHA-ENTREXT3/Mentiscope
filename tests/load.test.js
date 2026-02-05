import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // Virtual Users
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must be below 2s
    http_req_failed: ['rate<0.02'],    // Error rate must be less than 2%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'protocol active': (r) => r.json().status === "Mentiscope Protocol Active",
  });
  sleep(1);
}
