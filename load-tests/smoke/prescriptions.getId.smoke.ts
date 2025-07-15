import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
}

export default function () {
    const url = 'https://medical-backend-v1wz.onrender.com/prescription/3';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);
    console.log(res.body);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data object': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body === 'object' && body !== null && !Array.isArray(body);
            } catch {
                return false;
            }
        },
    });
    sleep(1);
}