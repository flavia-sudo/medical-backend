import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    const url = 'http://localhost:3000/auth/verify';
    const payload = JSON.stringify({
        email: 'dkwanjiru097@gmail.com',
        code: '180408',
    })

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const res = http.post(url, payload, params);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'message present': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.message !== undefined;
            } catch {
                return false;
            }
        },
    });
}