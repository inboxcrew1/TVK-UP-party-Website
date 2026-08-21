@echo off
echo Logging into Admin...
curl.exe -s -c cookies.txt -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@tvkup.org\",\"password\":\"Admin@123\"}" https://skyblue-tarsier-268054.hostingersite.com/api/admin/login
echo.
echo Fetching Admin Members and Stats...
curl.exe -s -b cookies.txt https://skyblue-tarsier-268054.hostingersite.com/api/admin/members
echo.
