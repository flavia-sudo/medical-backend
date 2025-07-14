import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

function randomEmail(): string {
    return `user${Math.floor(Math.random() * 10000)}@example.com`;
}

export default function () {
    const url = 'http://localhost:3000/auth/register';
    const payload = JSON.stringify({
        firstName: 'Dennis',
        lastName: 'Kizito',
        email: 'dkwanjiru057@gmail.com',
        password: 'password',
        role: 'user',
        address: "Test Address",
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {
        'status is 201': (r) => r.status === 201,
        'message present': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.message !== undefined;
            } catch {
                return false;
            }
        },
    });
    sleep(1);
}