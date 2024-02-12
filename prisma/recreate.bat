:: You can use this batch file to remove the database files, and trigger the initial database creation

cd /D "%~dp0"

if exist .\migrations rmdir /S /Q .\migrations
if exist .\dev.db del .\dev.db
if exist .\dev.db-journal del .\dev.db-journal

cd ..

npx prisma migrate dev --name init