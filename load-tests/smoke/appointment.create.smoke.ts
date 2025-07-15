import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
}

export default function () {
    const url = 'http://localhost:3000/appointment';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const payload = JSON.stringify({
        userId: 1,
        doctorId: 1,
        appointmentDate: "2025-07-15",
        time: "2025-07-15 11:00:00",
        totalAmount: "300.00",
        status: "confirmed",
        createdAt: "2025-07-15T00:00:00.000Z",
        updatedAt: "2025-07-15T00:00:00.000Z"
    });

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
        }
    });
    sleep(1);
}