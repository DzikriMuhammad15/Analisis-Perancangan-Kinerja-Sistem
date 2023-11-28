import http from "k6/http";
import { check, group, sleep } from "k6";
const mongoose = require("mongoose");

export let options = {
  stages: [
    { duration: "10s", target: 1 }, // Ramp up to 10 virtual users over 10 seconds
    // { duration: '30s', target: 10 }, // Stay at 10 virtual users for 30 seconds
    // { duration: '10s', target: 0 }, // Ramp down to 0 virtual users over 10 seconds
  ],
};

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
    group("makeReservation", () => {
      const makeReservationRes = http.post(
        `${BASE_URL}/reservations`,
        JSON.stringify({
          date: new Date(),
          startAt: "08.00",
          seats: 5,
          ticketPrice: 20000,
          total: 100000,
          movieId: new mongoose.Types.ObjectId(),
          cinemaId: new mongoose.Types.ObjectId(),
          username: "user",
          phone: "085222136798",
          checkin: false,
        }),
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if the login was successful (status code 200)
      check(makeReservationRes, {
        "reservation made sucessfully": (r) => r.status === 200,
      });
    });
    group("makeShowtime", () => {
      const makeShowtime = http.post(
        `${BASE_URL}/showtimes`,
        JSON.stringify({
          startAt: "08.00",
          startDate: new Date(),
          endDate: new Date(),
          movieId: new mongoose.Types.ObjectId(),
          cinemaId: new mongoose.Types.ObjectId(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if the login was successful (status code 200)
      check(makeShowtime, {
        "showtime made sucessfully": (r) => r.status === 200,
      });
    });

    group("getShowTimeAll", () => {
      const getShowtime = http.get(`${BASE_URL}/showtimes`, {
        headers: { "Content-Type": "application/json" },
      });

      // Check if the login was successful (status code 200)
      check(getShowtime, {
        "showtime get sucessfully": (r) => r.status === 200,
      });
    });

    group("getShowTimeById", () => {
      const getShowtimebyId = http.get(`${BASE_URL}/showtimes/1`, {
        headers: { "Content-Type": "application/json" },
      });

      // Check if the login was successful (status code 200)
      check(getShowtimebyId, {
        "showtime get sucessfully": (r) => r.status === 200,
      });
    });

    group("updateShowtime", () => {
      const udateShowtimeById = http.patch(
        `${BASE_URL}/showtimes/1`,
        JSON.stringify({
          startAt: "08.00",
          startDate: new Date(),
          endDate: new Date(),
          movieId: new mongoose.Types.ObjectId(),
          cinemaId: new mongoose.Types.ObjectId(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if the login was successful (status code 200)
      check(udateShowtimeById, {
        "showtime updated sucessfully": (r) => r.status === 200,
      });
    });
    group("deleteShowtime", () => {
      const deleteShowtimeById = http.delete(`${BASE_URL}/showtimes/1`, {
        headers: { "Content-Type": "application/json" },
      });

      // Check if the login was successful (status code 200)
      check(deleteShowtimeById, {
        "showtime deleted sucessfully": (r) => r.status === 200,
      });
    });

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
