#!/bin/bash
if [ "$TEST_TYPE" == "smoke" ]; then
    k6 run --out "influxdb=http://influxdb:8086/k6" "/scripts/smokeTestScript.js"
elif [ "$TEST_TYPE" == "load" ]; then
    k6 run --out "influxdb=http://influxdb:8086/k6" "/scripts/loadTestScript.js"
elif [ "$TEST_TYPE" == "stress" ]; then
    k6 run --out "influxdb=http://influxdb:8086/k6" "/scripts/stressTestScript.js"
else
    echo "Invalid test type. Usage: ./run_tests.sh [smoke|load|stress]"
fi
