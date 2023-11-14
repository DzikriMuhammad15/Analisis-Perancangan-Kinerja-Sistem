import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '0.5m', target: 100 },  // Ramp-up to 100 users over 2 minutes
        { duration: '0.5m', target: 100 },  // Stay at 100 users for 5 minutes
        { duration: '0.5m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // Tambahkan threshold sesuai kebutuhan
    },
    outputs: ['influxdb=http://localhost:8086/k6'],
};

export default function () {
    let res = http.get('http://localhost:5000/movies');  // Ganti URL dengan URL aplikasi Anda
    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(1);
}