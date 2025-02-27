This is a frontend for a web app that allows users to solve problems, track their progress, and compete with their friends.

The frontend will be built using React.

The backend will be built using spring boot.

The database will be built using MongoDB.

The app will be deployed on Render.com

The app will be responsive and will be able to run on any resolution.

The app will use react library to display errors globally.

The app will have welcome page introducing the app and inviting the user to login.

The app will have a login page with email and password input fields.
    
The login page will have field for username.

The login page will have field for password.

The login page will have a login button. 

The app will have a page with a set of quizzes.

The quizzes will be displayed in cards with the following information:

- Quiz name
- Quiz description
- Quiz difficulty (easy, medium, hard)
- Quiz status (last best results, not attempted)
- Quiz cooldown (time to next attempt)
- Quiz tags
- number of questions in it

The quiz will be sorted by difficulty.

The user will be able to filter the quizzes by difficulty, tags.

The quiz will have a information about how many quizzes are there in total. how many hard, medium, easy quizzes are there. how many questions are there in total. 

There will be substring search for quizzes.

The user will be able to select a quiz to solve by clicking on the quiz card.

Upon selecting a quiz, the user will be redirected to the quiz details page.

The quiz details page will have the following information:

- Quiz name
- Quiz description
- Quiz difficulty
- Quiz status
- Quiz cooldown
- Quiz tags
- number of questions in it
- the rules and instructions of the quiz

The quiz details page will have a button to start the quiz.

The quiz details page will have a button to download the quiz as a pdf.

The pdf will only contain the questions no any additional information or instructions. 

There will be different ways to see resuts.

One way is to see the results after answering all the questions. In this case the user can go back and forth between the questions and change the answers before submitting the quiz. There will be indicator at top of the question indicator will have length of the quiz question number, and there will be mark on it indicating which question the user is currently on, and which questions are answered and which are not. all the questions must be answered to complete the quiz.

Another way is to see the results after answering each question. In this case user can't change the answer he selected. Results will be shown upon answering each question. There will be indicator at top of the question indicator will have length of the quiz question number, and there will be mark on it indicating which question the user is currently on, and which questions are answered correctly and which are not and which are skipped at all. all the questions must be answered to complete the quiz.

On last question there will be a button to submit the quiz instead of going to the next question.

upon submitting the quiz, the user will be redirected to the quiz results page.

The quiz results page will have the following information:

- Quiz name
- Quiz description
- Quiz difficulty
- Quiz status
- Quiz cooldown 
- Quiz tags
- How many questions were answered correctly 
- How many questions were answered incorrectly
- Total time taken to answer the quiz
- Rank points gained alongside total rank points
- number of attempts
- how user performed compared to other users with same number of attempts.

on results page user can see which questions were answered correctly and which were answered incorrectly.

There will be a button to go back to the quiz list page.

The app will have a page with a set of leaderboard.

The users will be sorted by rank points. There should be global and weekly leaderboards. 

Leaderboard will have player username and avatar. first 3 players will have different medals.

The app will have a profile page.

The profile page will have the following information:

- Username
- Avatar
- member since
- Rank points
- Total attempts
- Total correct answers
- Total incorrect answers
- Recent quiz results total 10 (title, rank points gained alongside total rank points, date and time, difficulty, time taken)
- title determined by rank points gained
- chart showing submissions over time like github
- tags user is good at determined by total tag counts across all quizzes and how many of them user completed with more than half of the questions answered correctly


The app will have admin dashboard.

Admin dashboard will have the following features:

- Add, edit, delete quizzes
- Substring search for quizzes filtering by tags, difficulty, etc.
- Add, edit, delete tags, difficulties, time limits, etc.
- ban users
- make user admin
- make admin user



The app will have a navbar with the following navigation options:

- Home
- Quizzes
- Leaderboard
- Profile
- Avatar
- Admin dashboard (only for admins)
- Login (if user is not logged in)
- Logout (if user is logged in)


The app will have a footer with the following information:

- Copyright 2025 Problems2.com
- All rights reserved
- Privacy policy
- Terms of service
- Contact us
- Support
- FAQ



The app will have a pages:
- Error
- Contact us
- FAQ



Database schema:

users:
    - id (string) // auto generated
    - username (string)
    - passwordHash (string)
    - role (string) // USER (default), ADMIN
    - avatar (string) // default is "https://api.dicebear.com/8.x/pixel-art/png?seed=" + username + password
    - memberSince (date) // default is creation date
    - rankPoints (number) // default is 0
    - title (rank title) // RECRUIT (default), APPRENTICE, NOVICE, WARRIOR, ELITE_SOLDIER, GLADIATOR, CHAMPION, VETERAN, WARLORD, MASTER_FIGHTER, GRANDMASTER, LEGEND, SHADOW_SLAYER, TITAN, MYTHIC_CONQUEROR, IMMORTAL_GUARDIAN, CELESTIAL_KNIGHT, GOD_OF_WAR, ETERNAL_OVERLORD, ASCENDED_DEITY
    - isBanned (boolean) // default is false
    - stats (object{ 
        - id (string) // auto generated
        - totalAttempts (number) // default is 0
        - correctAnswers (number) // default is 0
        - incorrectAnswers (number) // default is 0
     }) 
    - weeklyPoints (number) // default is 0

quizzes:
    - id (string) // auto generated
    - name (string) 
    - description (string) 
    - difficulty (string) // EASY(default), MEDIUM, HARD
    - tags (array of strings) 
    - timeLimit (number) // default is 10 (no time limit)
    - rules (string) // default is ""
    - instructions (string) // default is ""
    - questions (array of objects{
        - id (string) // auto generated
        - type (string) // MULTIPLE_CHOICE(default), FILL_IN_THE_BLANK, MULTIPLE_SELECT
        - content (
            if type is MULTIPLE_CHOICE:
                object{
                    - question (string)
                    - options (array of strings)
                    - correctOption (number) // index of the correct option
                }
            if type is FILL_IN_THE_BLANK:
                object{
                    - question (string)
                    - correctAnswer (string) // answer to fill in the blank
                }   
            if type is MULTIPLE_SELECT:
                object{
                    - question (string)
                    - options (array of strings)
                    - correctOptions (array of numbers) // indices of the correct options
                }
        )
    })


quiz_results:
    - id (string) // auto generated
    - userId (string) // id of the user who submitted the quiz
    - quizId (string) // id of the quiz
    - submissionDate (date) // default is current date  
    - obtainedPoints (number) // points gained from the quiz
    - timeTaken (number) // in seconds
    - content (array of objects{
        - questionId (string) // id of the question
        - isCorrect (boolean) // true if the answer is correct, false otherwise
    })




api/quizzes/quiz/get-all/?page={page}&pageSize={pageSize}&status={status}&cooldown={cooldown}&difficulty={difficulty}&tags={tags}&minimumNumberOfQuestions={minimumNumberOfQuestions}&maximumNumberOfQuestions={maximumNumberOfQuestions}:
    - method: GET
    - backend expects:
    - frontend expects:
        - {
            "quizzes": [
                {
                    "id": "string",
                    "name": "string",
                    "description": "string",
                    "difficulty": "string",
                    "tags": ["string"],
                    "numberOfQuestions": "number",
                    "quizStatus": {
                        "timeTaken": "number",
                        "obtainedPoints": "number",
                        "numberOfCorrectAnswers": "number",
                    },
                    "cooldown": "number",
                    "timeLimit": "number"
                }
            ]
            "tags": ["string"],
            "totalQuizzes": "number",
            "totalCompletedQuizzes": "number",
            "totalQuestions": "number",
            "totalEasyQuizzes": "number",
            "totalMediumQuizzes": "number",
            "totalHardQuizzes": "number",
            "totalTags": "map<string, number>",
            "totalAttempts": "number",
            "currentPage": "number",
            "totalPages": "number",

        }


api/quizzes/quiz/quiz-details/{quizId}:
    - method: GET
    - backend expects:
    - frontend expects:
        - {
            "quiz": [
                {
                    "id": "string",
                    "name": "string",
                    "description": "string",
                    "difficulty": "string",
                    "tags": ["string"],
                    "numberOfQuestions": "number",
                    "timeLimit": "number",
                    "cooldown": "number",
                    "rules": "string",
                    "instructions": "string"
                }
            ]   
        }


api/quizzes/quiz/quiz-results/{quizId}:
    - method: GET
    - backend expects:
    - frontend expects:
        - quizResults (array of objects)

api/quizzes/quiz/start-quiz/{quizId}:
    - method: POST
    - backend expects:
    - frontend expects:
        - quiz (object)

api/quizzes/quiz/submit-quiz/{quizId}:
    - method: POST
    - backend expects:
    - frontend expects:
        - quizResults (array of objects)

api/quizzes/quiz/submit/question/{questionId}:
    - method: POST
    - backend expects:
    - frontend expects:
        - questionResults (array of objects)







