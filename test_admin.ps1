$loginResponse = Invoke-WebRequest -Uri 'https://skyblue-tarsier-268054.hostingersite.com/api/admin/login' -Method POST -Body '{"email":"admin@tvkup.org","password":"Admin@123"}' -ContentType 'application/json' -SessionVariable adminSession
Write-Host "Admin Login Status:" $loginResponse.StatusCode

$membersResponse = Invoke-RestMethod -Uri 'https://skyblue-tarsier-268054.hostingersite.com/api/admin/members' -Method GET -WebSession $adminSession
Write-Host "Admin Members Stats:"
$membersResponse.stats | Format-List
Write-Host "Total Members in DB:" $membersResponse.members.Count
foreach ($m in $membersResponse.members) {
    Write-Host " - Member ID:" $m.membershipId "Name:" $m.fullName "Status:" $m.status "District:" $m.district.name "Assembly:" $m.assembly.name
}
