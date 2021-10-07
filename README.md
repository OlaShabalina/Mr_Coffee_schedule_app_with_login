# Schedule app for Mr Coffee cafe

## Functionality

User can register/login to add shifts to his roaster and see other employees schedules. User can't see the dashboards till login. 

![Sitemap](https://user-images.githubusercontent.com/88268603/136168084-0146566a-9fc7-4dc3-b86c-ab87170d9b55.PNG)

## Technical overview

The project is done in Express-js as a back-end using PostgreSQL as a database, EJS and Bootstrap for front-end. External JS file is used to arrange schedules by days. 

## Steps to use the app

1. clone repo

```bash
git clone https://github.com/OlaShabalina/incode_project4.git
```

2. install dependencies

```bash
cd incode5-group-work
npm install
```

3. Copy and rename .env.sample to .env and fill out credentials

4. Choose your task and work on it 

5. Follow the steps from "contributing-steps.md" file to complete your work

6. Communicate with your team members so they can approve your contributions

## Login page
![Login_page](https://user-images.githubusercontent.com/88268603/136169415-c172889d-4ef0-406b-a144-51754cfcfcf9.PNG)
## Register page
![Register_page](https://user-images.githubusercontent.com/88268603/136169412-01fa068f-3bf3-48bb-92a3-7b7b9ab592bf.PNG)
### Error handling (back-end)
![Backend_error_handling](https://user-images.githubusercontent.com/88268603/136169405-9797a7e5-9c3b-453d-80d8-8531a341ea30.PNG)
## Home page
![Home_page](https://user-images.githubusercontent.com/88268603/136169419-5264b69d-bc0e-4b8d-b5e1-98e0cf5f865c.PNG)
## All schedules page
![All_schedules_page](https://user-images.githubusercontent.com/88268603/136169433-cb8cfc20-441a-4afc-936f-1c3c06679bf4.PNG)
## New schedule page
![create_new_schedule](https://user-images.githubusercontent.com/88268603/136169421-6e58e462-2bd0-4495-b27f-6596891b0f76.PNG)
### Solution to prevent overlaping (back-end)
![Validation_for_not_overlaping](https://user-images.githubusercontent.com/88268603/136169426-b5cf556a-add3-4286-bc36-cf130a15a44a.PNG)
