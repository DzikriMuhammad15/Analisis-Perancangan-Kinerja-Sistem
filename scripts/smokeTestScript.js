import http from "k6/http";
import { check, group, sleep } from "k6";

export let options = {
    stages: [
        { duration: '1m', target: 4 }, // Ramp up to 10 virtual users over 10 seconds
        { duration: '2m', target: 4 }, // Stay at 10 virtual users for 30 seconds
        { duration: '1m', target: 0 }, // Ramp down to 0 virtual users over 10 seconds
    ],
};

const listOfEndpoint = [
    "users",
    "users/me",
    "cinemas",
    "movies",
    "reservations",
    "showtimes",
];
const BASE_URL = "http://app:5000"; // Replace your_port_here with the actual port
const USERNAME = "jikirzzz";
const PASSWORD = "pw123456";
var isRegister = false;

export default function () {
    let authToken;
    let idUser;

    // Group for user login
    if (!isRegister) {
        group("User Register", () => {
            const createUserRes = http.post(
                `${BASE_URL}/users`,
                JSON.stringify({
                    username: USERNAME,
                    password: PASSWORD,
                    name: "jikirzzz",
                    role: "superadmin",
                    email: "jikirzzz@std.stei.itb.ac.id",
                    phone: "081220524864",
                }),
                { headers: { "Content-Type": "application/json" } }
            );

            // Check if the login was successful (status code 200)
            check(createUserRes, {
                "Register Successful": (r) => r.status === 200,
            });

            // Extract the authentication token from the response
            authToken = createUserRes.json("token");

            // Sleep for a short duration
            sleep(1);
            isRegister = true;
        });
    }

    // Group for user login
    group("User Login", () => {
        const loginRes = http.post(
            `${BASE_URL}/users/login`,
            JSON.stringify({ username: USERNAME, password: PASSWORD }),
            { headers: { "Content-Type": "application/json" } }
        );

        // Check if the login was successful (status code 200)
        check(loginRes, {
            "Login Successful": (r) => r.status === 200,
        });

        // Extract the authentication token from the response
        authToken = loginRes.json("token");
        idUser = loginRes.json("_id");

        // Sleep for a short duration
        sleep(1);
    });

    // Only proceed if the login was successful
    if (authToken) {
        for (let index = 0; index < listOfEndpoint.length; index++) {
            // Group for accessing a protected endpoint (adjust as needed)
            group("Protected Endpoint", () => {
                const protectedRes = http.get(`${BASE_URL}/${listOfEndpoint[index]}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                // Check if the access to the protected endpoint was successful (status code 200)
                check(protectedRes, {
                    "Access to Protected Endpoint Successful": (r) => r.status === 200,
                });

                // Sleep for a short duration
                sleep(1);
            });

            // Only proceed if the login was successful
            if (authToken) {
                for (let index = 0; index < listOfEndpoint.length; index++) {
                    // Group for accessing a protected endpoint (adjust as needed)
                    group('Protected Endpoint', () => {
                        const protectedRes = http.get(`${BASE_URL}/${listOfEndpoint[index]}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        });

                        // Check if the access to the protected endpoint was successful (status code 200)
                        check(protectedRes, {
                            'Access to Protected Endpoint Successful': (r) => r.status === 200,
                        });

                        // Sleep for a short duration
                        sleep(1);
                    });
                }

                group('Protected Endpoint', () => {
                    const cinemas = http.post(
                        `${BASE_URL}/cinemas`,
                        JSON.stringify({ name: "cinema 1", ticketPrice: "10000", city: "Bandung", seats: 5, seatsAvailable: 1, image: "https://unsplash.com/photos/red-cinema-chair-evlkOfkQ5rE" }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(cinemas, {
                        'Create Cinema Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const cinemas = http.patch(
                        `${BASE_URL}/cinemas/1`,
                        JSON.stringify({ name: "cinema 90", ticketPrice: "68999", city: "Solo", seats: 56, seatsAvailable: 21 }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(cinemas, {
                        'Update Cinema Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const cinemas = http.delete(
                        `${BASE_URL}/cinemas/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(cinemas, {
                        'Delete Cinema Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const cinemas = http.get(
                        `${BASE_URL}/cinemas/usermodeling/${USERNAME}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(cinemas, {
                        'Get Cinema Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const cinemas = http.get(
                        `${BASE_URL}/cinemas/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(cinemas, {
                        'Get Cinema Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const inv = http.post(
                        `${BASE_URL}/invitations`,
                        JSON.stringify({ to: "Mamang", host: "Jikirz", movie: "The Nun", date: new Date(), time: "19.09", cinema: "cinema 1", image: "https://unsplash.com/photos/a-table-topped-with-lots-of-different-types-of-toys-09y-SEYZvnc", seat: 9 }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(inv, {
                        'Create Invitation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const movie = http.post(
                        `${BASE_URL}/movies`,
                        JSON.stringify({ title: "Mamang", language: "Hindi", genre: "Horor", endDate: new Date(), releaseDate: new Date(), duration: 90, image: "https://unsplash.com/photos/a-table-topped-with-lots-of-different-types-of-toys-09y-SEYZvnc", director: "komeng", cast: "popo" }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(movie, {
                        'Create Movie Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const movie = http.put(
                        `${BASE_URL}/movies/1`,
                        JSON.stringify({ title: "the pro", language: "INdo", genre: "Horor", endDate: new Date(), releaseDate: new Date(), duration: 90, image: "https://unsplash.com/photos/a-table-topped-with-lots-of-different-types-of-toys-09y-SEYZvnc", director: "komeng", cast: "popo" }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(movie, {
                        'Edit Movie Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const movie = http.delete(
                        `${BASE_URL}/movies/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(movie, {
                        'Delete Movie Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const movie = http.get(
                        `${BASE_URL}/movies/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(movie, {
                        'Get Movie Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const movie = http.get(
                        `${BASE_URL}/movies/usermodeling/${USERNAME}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(movie, {
                        'Get Movie Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const reservation = http.get(
                        `${BASE_URL}/reservations`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(reservation, {
                        'Get reservation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const reservation = http.get(
                        `${BASE_URL}/reservations/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(reservation, {
                        'Get reservation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const reservation = http.get(
                        `${BASE_URL}/reservations/checkin/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(reservation, {
                        'Get reservation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const reservation = http.get(
                        `${BASE_URL}/reservations/usermodeling/${USERNAME}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(reservation, {
                        'Get reservation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const reservation = http.patch(
                        `${BASE_URL}/reservations/1`,
                        JSON.stringify({ startAt: "9", ticketPrice: 999, total: 9999, date: new Date(), seats: 90, username: "komeng", phone: "081328458890", checkin: true }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(reservation, {
                        'Edit reservation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Protected Endpoint', () => {
                    const reservation = http.delete(
                        `${BASE_URL}/reservations/1`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    // Check if the login was successful (status code 200)
                    check(reservation, {
                        'Delete reservation Successful': (r) => r.status === 200,
                    });
                    // Sleep for a short duration
                    sleep(1);
                });
                group('Log Out', () => {
                    const logOutRes = http.post(
                        `${BASE_URL}/users/logout`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                    check(logOutRes, {
                        'Logout Successful': (r) => r.status === 200,
                    });
                    authToken = null;

                    // Sleep for a short duration
                    sleep(1);
                    isRegister = true;
                });
            }

            group("Log Out", () => {
                const logOutRes = http.post(`${BASE_URL}/users/logout`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                check(logOutRes, {
                    "Logout Successful": (r) => r.status === 200,
                });
                authToken = null;

                // Sleep for a short duration
                sleep(1);
                isRegister = true;
            });
        }
        group("Delete", () => {
            const logOutRes = http.delete(`${BASE_URL}/users/testDelete/${idUser}`, {
                headers: { "Content-Type": "application/json" },
            });
            check(logOutRes, {
                "Logout Successful": (r) => r.status === 200,
            });
            authToken = logOutRes.json("token");

            // Sleep for a short duration
            sleep(1);
            isRegister = false;
        });
    }
}
