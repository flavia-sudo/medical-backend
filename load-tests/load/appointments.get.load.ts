import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://medical-backend-v1wz.onrender.com';

export const options = {
    stages: [
        { duration: '30s', target: 40 }, // ramp-up to 40 users over 30 seconds
        { duration: '40s', target: 50 }, // stay at 50 users for 40 seconds
        { duration: '10s', target: 0 }, // ramp-down to 0 users

    ],
    ext: {
        loadimpact: {
            name: 'Appointments GET Load Test',
        }
    }
}

export default function () {
    const res = http.get(`${BASE_URL}/appointment_all`, {
    headers: {
        'Content-Type': 'application/json',
    },
});
    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body);
            } catch {
                return false;
            }
        },
    });
    sleep(1);
}