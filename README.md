<h1>A Simple To-do</h1>

My take on a simple to-do app, featuring a "sliding window" that always show to-dos within the week as default (5 days including current day, excludes weekends).  A toolbar on the right for toggling for the color-coded (kind of) todos:
* For the week (as mentioned)
* Solid (black):
  - ASAP to-dos that aren't dated
* Red:
  - current day
* Amber (yellow):
  - next day
* Green:
  - in 2-3 days
* Transparent (white):
  - on the final "week" day
* Blank (white, different shape):
  - for further out 5+ days

JSON structure:
```json
[
  {
        "id": "650923396d4e4712df326b00",
        "title": "Return books",
        "tasks": [
            "all of them"
        ],
        "completed": false,
        "date": "Mon Oct 02 2023",
        "color": "red"
    }
]
```

<h2>Installation</h2>

1. Clone repository and install dependencies.
2. Do the same for <a href="https://github.com/jeanings/todo-backend">A Simple To-do</a> backend.
3. Run `npm start` or whichever package manager you prefer.
