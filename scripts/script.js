import http from "k6/http";
import { check, group, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10000s", target: 1 }, // Ramp up to 10 virtual users over 10 seconds
    // { duration: '30s', target: 10 }, // Stay at 10 virtual users for 30 seconds
    // { duration: '10s', target: 0 }, // Ramp down to 0 virtual users over 10 seconds
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
const USERNAME = "asdfg";
const PASSWORD = "pw123456";

export default function () {
  let authToken;

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
    }

    group("Protected", () => {
      const protectedRes = http.get(`${BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          tags: { name: "endpoint 2" },
        },
      });

      // Check if the access to the protected endpoint was successful (status code 200)
      check(protectedRes, {
        "Access to Protected Endpoint Successful": (r) => r.status === 200,
      });

      // Sleep for a short duration
      sleep(1);
    });
  }
}
