import { useEffect, useRef, useState } from "react";
import { API_BASE_URL as API_BASE } from "../config/api";
export const LEARNING_STUDENT_ID = "e0bab151-ab49-42fe-b6f1-c4346834b1f1";
const COURSE_TITLE = "SkillBridge Developer Foundations";
const CERTIFICATE_MIN_PERCENT = 60; // Learners need 60% or higher for certificate eligibility.
const VERSION = 1;
const CHANGE_EVENT = "skillbridge-learning-change";
// Browser records are self-reported, not server-verified credentials.
const storageKey = (studentId) => `skillbridge-learning-v${VERSION}:${studentId}`;

const MODULES = [
  {
    "id": "python",
    "skill": "Python",
    "title": "Python Backend Foundations",
    "target": 80,
    "source": "https://docs.python.org/3/tutorial/",
    "introVideo": "/videos/python-intro.mp4",
    "slides": [
      {
        "id": "python-1",
        "title": "Values and collections",
        "summary": "Represent student records with the right Python types.",
        "example": "student = {\"name\": \"Asha\", \"skills\": [\"Python\"]}\nstudent[\"skills\"].append(\"SQL\")\nprint(len(student[\"skills\"]))  # 2",
        "points": [
          "A dictionary connects keys to values.",
          "Lists hold ordered items and can be modified.",
          "append adds one item to the end of a list.",
          "len returns the number of items in a collection."
        ],
        "questions": [
          {
            "prompt": "Which collection represents a student using named fields?",
            "options": [
              "Dictionary",
              "Set",
              "String",
              "Integer"
            ],
            "answer": 0,
            "explanation": "A dictionary connects keys to values."
          },
          {
            "prompt": "Which collection suits an ordered, editable skill list?",
            "options": [
              "Tuple",
              "Integer",
              "Boolean",
              "List"
            ],
            "answer": 3,
            "explanation": "Lists hold ordered items and can be modified."
          },
          {
            "prompt": "What does skills.append(\"SQL\") do?",
            "options": [
              "Sorts every skill",
              "Creates a tuple",
              "Adds SQL at the end",
              "Deletes SQL"
            ],
            "answer": 2,
            "explanation": "append adds one item to the end of a list."
          },
          {
            "prompt": "What does len([\"Python\", \"SQL\"]) return?",
            "options": [
              "3",
              "2",
              "1",
              "0"
            ],
            "answer": 1,
            "explanation": "len returns the number of items in a collection."
          }
        ]
      },
      {
        "id": "python-2",
        "title": "Conditions and iteration",
        "summary": "Filter candidates and repeat work without duplicating instructions.",
        "example": "scores = [45, 80, 65]\nfor score in scores:\n    if score >= 60:\n        print(\"Eligible\")",
        "points": [
          ">= includes values equal to the threshold.",
          "A for loop iterates through a collection.",
          "Only 80 and 65 satisfy the threshold of 60.",
          "break leaves the nearest enclosing loop."
        ],
        "questions": [
          {
            "prompt": "Which condition accepts scores of 60 or higher?",
            "options": [
              "score > 60",
              "score < 60",
              "score == 59",
              "score >= 60"
            ],
            "answer": 3,
            "explanation": ">= includes values equal to the threshold."
          },
          {
            "prompt": "Which loop visits every item in scores?",
            "options": [
              "try score in scores",
              "return scores",
              "for score in scores",
              "if score in scores"
            ],
            "answer": 2,
            "explanation": "A for loop iterates through a collection."
          },
          {
            "prompt": "How many times does the example print Eligible?",
            "options": [
              "0",
              "2",
              "3",
              "1"
            ],
            "answer": 1,
            "explanation": "Only 80 and 65 satisfy the threshold of 60."
          },
          {
            "prompt": "What does break do inside a loop?",
            "options": [
              "Exits the nearest loop",
              "Skips only this iteration",
              "Restarts Python",
              "Sorts the list"
            ],
            "answer": 0,
            "explanation": "break leaves the nearest enclosing loop."
          }
        ]
      },
      {
        "id": "python-3",
        "title": "Functions and return values",
        "summary": "Separate reusable business rules from presentation code.",
        "example": "def eligible(score, minimum=60):\n    return score >= minimum\n\nprint(eligible(70))  # True",
        "points": [
          "def introduces a function definition.",
          "Default parameters supply a value when an argument is omitted.",
          "55 is below the default minimum of 60.",
          "return passes the computed result back to the caller."
        ],
        "questions": [
          {
            "prompt": "Which keyword defines a Python function?",
            "options": [
              "define",
              "func",
              "def",
              "function"
            ],
            "answer": 2,
            "explanation": "def introduces a function definition."
          },
          {
            "prompt": "What is minimum in the example?",
            "options": [
              "A loop counter",
              "A parameter with a default value",
              "A database table",
              "An import"
            ],
            "answer": 1,
            "explanation": "Default parameters supply a value when an argument is omitted."
          },
          {
            "prompt": "What does eligible(55) return?",
            "options": [
              "False",
              "True",
              "55",
              "None"
            ],
            "answer": 0,
            "explanation": "55 is below the default minimum of 60."
          },
          {
            "prompt": "Why use return instead of only print?",
            "options": [
              "To install packages",
              "To always raise an error",
              "To write a database row",
              "To provide a value to the caller"
            ],
            "answer": 3,
            "explanation": "return passes the computed result back to the caller."
          }
        ]
      },
      {
        "id": "python-4",
        "title": "Errors and JSON",
        "summary": "Handle invalid input and exchange structured data with an API.",
        "example": "import json\ntry:\n    score = int(\"eighty\")\nexcept ValueError:\n    score = 0\npayload = json.dumps({\"score\": score})",
        "points": [
          "except selects the exception type to handle.",
          "The failed conversion enters the handler and assigns zero.",
          "json.dumps serializes a Python value into JSON text.",
          "json.loads parses JSON text into Python values."
        ],
        "questions": [
          {
            "prompt": "Which block handles an expected conversion failure?",
            "options": [
              "return error",
              "except ValueError",
              "finally ValueError",
              "if exception"
            ],
            "answer": 1,
            "explanation": "except selects the exception type to handle."
          },
          {
            "prompt": "What is score after this example runs?",
            "options": [
              "0",
              "80",
              "None",
              "\"eighty\""
            ],
            "answer": 0,
            "explanation": "The failed conversion enters the handler and assigns zero."
          },
          {
            "prompt": "What does json.dumps produce?",
            "options": [
              "A Python module",
              "An HTTP server",
              "A database connection",
              "A JSON string"
            ],
            "answer": 3,
            "explanation": "json.dumps serializes a Python value into JSON text."
          },
          {
            "prompt": "What converts JSON text back into Python data?",
            "options": [
              "int.json",
              "json.open",
              "json.loads",
              "json.dumps"
            ],
            "answer": 2,
            "explanation": "json.loads parses JSON text into Python values."
          }
        ]
      }
    ]
  },
  {
    "id": "fastapi",
    "skill": "FastAPI",
    "title": "FastAPI API Foundations",
    "target": 80,
    "source": "https://fastapi.tiangolo.com/tutorial/",
    "introVideo": "/videos/fastapi-intro.mp4",
    "slides": [
      {
        "id": "fastapi-1",
        "title": "Routes and HTTP methods",
        "summary": "Expose application actions through explicit API routes.",
        "example": "from fastapi import FastAPI\napp = FastAPI()\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}",
        "points": [
          "The get decorator registers a handler for GET requests.",
          "POST commonly submits data to create a resource.",
          "The route path is the string in the decorator.",
          "FastAPI converts the returned dictionary into a JSON response."
        ],
        "questions": [
          {
            "prompt": "What registers the health read endpoint?",
            "options": [
              "@app.get(\"/health\")",
              "@app.post(\"/delete\")",
              "@app.css(\"/health\")",
              "@app.table(\"health\")"
            ],
            "answer": 0,
            "explanation": "The get decorator registers a handler for GET requests."
          },
          {
            "prompt": "Which HTTP method commonly creates a new application?",
            "options": [
              "GET",
              "HEAD",
              "OPTIONS",
              "POST"
            ],
            "answer": 3,
            "explanation": "POST commonly submits data to create a resource."
          },
          {
            "prompt": "What is the route path in the example?",
            "options": [
              "/app",
              "/get",
              "/health",
              "/status"
            ],
            "answer": 2,
            "explanation": "The route path is the string in the decorator."
          },
          {
            "prompt": "What does this handler return to the client?",
            "options": [
              "A SQL database",
              "A JSON object",
              "A CSS file",
              "A Python executable"
            ],
            "answer": 1,
            "explanation": "FastAPI converts the returned dictionary into a JSON response."
          }
        ]
      },
      {
        "id": "fastapi-2",
        "title": "Path and query parameters",
        "summary": "Identify a resource with its path and filter with query parameters.",
        "example": "@app.get(\"/students/{student_id}\")\ndef get_student(student_id: int, active: bool = True):\n    return {\"id\": student_id, \"active\": active}",
        "points": [
          "A path parameter receives the corresponding URL segment.",
          "Query parameters follow the question mark in a URL.",
          "The int annotation requests integer parsing and validation.",
          "The function default is used when the query value is absent."
        ],
        "questions": [
          {
            "prompt": "In /students/42, what is student_id?",
            "options": [
              "students",
              "True",
              "active",
              "42"
            ],
            "answer": 3,
            "explanation": "A path parameter receives the corresponding URL segment."
          },
          {
            "prompt": "Where is active=false in the request URL?",
            "options": [
              "In the hostname only",
              "In the HTTP method",
              "After ? as a query parameter",
              "Inside a CSS selector"
            ],
            "answer": 2,
            "explanation": "Query parameters follow the question mark in a URL."
          },
          {
            "prompt": "What type is declared for student_id?",
            "options": [
              "bool",
              "int",
              "str",
              "list"
            ],
            "answer": 1,
            "explanation": "The int annotation requests integer parsing and validation."
          },
          {
            "prompt": "What happens when active is omitted?",
            "options": [
              "It defaults to True",
              "It defaults to False",
              "The route disappears",
              "Every request fails"
            ],
            "answer": 0,
            "explanation": "The function default is used when the query value is absent."
          }
        ]
      },
      {
        "id": "fastapi-3",
        "title": "Request bodies and validation",
        "summary": "Describe incoming records with a Pydantic model.",
        "example": "from pydantic import BaseModel, Field\n\nclass Result(BaseModel):\n    score: int = Field(ge=0, le=100)\n\n@app.post(\"/results\")\ndef create_result(result: Result):\n    return {\"score\": result.score}",
        "points": [
          "Pydantic models derive from BaseModel.",
          "ge=0 and le=100 accept values from zero through one hundred.",
          "A model parameter describes a structured request body.",
          "Default request validation errors use HTTP status 422."
        ],
        "questions": [
          {
            "prompt": "Which class is the base for Result?",
            "options": [
              "BaseSQL",
              "BaseCSS",
              "BaseModel",
              "BaseRoute"
            ],
            "answer": 2,
            "explanation": "Pydantic models derive from BaseModel."
          },
          {
            "prompt": "Which score meets the declared range?",
            "options": [
              "150",
              "75",
              "-1",
              "101"
            ],
            "answer": 1,
            "explanation": "ge=0 and le=100 accept values from zero through one hundred."
          },
          {
            "prompt": "Where does the result model normally come from?",
            "options": [
              "The JSON request body",
              "The CSS stylesheet",
              "The server filename",
              "The browser title"
            ],
            "answer": 0,
            "explanation": "A model parameter describes a structured request body."
          },
          {
            "prompt": "Which status does default FastAPI request validation normally use for invalid input?",
            "options": [
              "200",
              "301",
              "204",
              "422"
            ],
            "answer": 3,
            "explanation": "Default request validation errors use HTTP status 422."
          }
        ]
      },
      {
        "id": "fastapi-4",
        "title": "Errors and testing",
        "summary": "Return useful failures and verify API behavior.",
        "example": "from fastapi import HTTPException\n\n@app.get(\"/items/{item_id}\")\ndef get_item(item_id: int):\n    if item_id != 1:\n        raise HTTPException(status_code=404, detail=\"Item not found\")\n    return {\"id\": 1}",
        "points": [
          "404 communicates that the requested resource was not found.",
          "Raising HTTPException stops the handler with an HTTP error.",
          "Only item identifier 1 reaches the success return.",
          "API checks should assert response status and meaningful data."
        ],
        "questions": [
          {
            "prompt": "Which status represents a missing item?",
            "options": [
              "204",
              "404",
              "200",
              "201"
            ],
            "answer": 1,
            "explanation": "404 communicates that the requested resource was not found."
          },
          {
            "prompt": "How is the HTTP error triggered?",
            "options": [
              "raise HTTPException(...)",
              "return print(...)",
              "delete app",
              "import 404"
            ],
            "answer": 0,
            "explanation": "Raising HTTPException stops the handler with an HTTP error."
          },
          {
            "prompt": "Which input tests the success branch here?",
            "options": [
              "item_id = 2",
              "item_id = 99",
              "item_id = 0",
              "item_id = 1"
            ],
            "answer": 3,
            "explanation": "Only item identifier 1 reaches the success return."
          },
          {
            "prompt": "What should a useful API test check?",
            "options": [
              "Only filename length",
              "Only comment count",
              "Status code and response data",
              "Only button color"
            ],
            "answer": 2,
            "explanation": "API checks should assert response status and meaningful data."
          }
        ]
      }
    ]
  },
  {
    "id": "sql",
    "skill": "SQL",
    "title": "SQL for Backend Developers",
    "target": 70,
    "source": "https://www.postgresql.org/docs/current/tutorial-sql.html",
    "introVideo": "/videos/sql-intro.mp4",
    "slides": [
      {
        "id": "sql-1",
        "title": "Select, filter and sort",
        "summary": "Read only the student records your page needs.",
        "example": "SELECT name, score\nFROM students\nWHERE score >= 60\nORDER BY score DESC;",
        "points": [
          "SELECT specifies the output columns or expressions.",
          "WHERE keeps rows that satisfy its condition.",
          "DESC orders values in descending order.",
          "The >= comparison includes the boundary value."
        ],
        "questions": [
          {
            "prompt": "Which keyword chooses the returned columns?",
            "options": [
              "SELECT",
              "UPDATE",
              "DELETE",
              "INSERT"
            ],
            "answer": 0,
            "explanation": "SELECT specifies the output columns or expressions."
          },
          {
            "prompt": "Which clause filters rows before grouping?",
            "options": [
              "ORDER BY",
              "VALUES",
              "SET",
              "WHERE"
            ],
            "answer": 3,
            "explanation": "WHERE keeps rows that satisfy its condition."
          },
          {
            "prompt": "What does DESC request?",
            "options": [
              "Only duplicate rows",
              "No results",
              "Highest values first",
              "Lowest values first"
            ],
            "answer": 2,
            "explanation": "DESC orders values in descending order."
          },
          {
            "prompt": "Will a student scoring exactly 60 be included?",
            "options": [
              "Only with a JOIN",
              "Yes",
              "No",
              "Only if score is NULL"
            ],
            "answer": 1,
            "explanation": "The >= comparison includes the boundary value."
          }
        ]
      },
      {
        "id": "sql-2",
        "title": "Joins and relationships",
        "summary": "Connect applications to their student records.",
        "example": "SELECT s.name, a.company\nFROM students s\nINNER JOIN applications a ON a.student_id = s.id;",
        "points": [
          "A join combines related rows from different tables.",
          "INNER JOIN returns combinations satisfying the join condition.",
          "LEFT JOIN preserves unmatched rows from the left table.",
          "The application student identifier references the student identifier."
        ],
        "questions": [
          {
            "prompt": "Why join these tables?",
            "options": [
              "Encrypt all passwords",
              "Delete old columns",
              "Create a web route",
              "Combine related student and application records"
            ],
            "answer": 3,
            "explanation": "A join combines related rows from different tables."
          },
          {
            "prompt": "Which rows does an INNER JOIN return?",
            "options": [
              "Only unmatched rows",
              "Only NULL values",
              "Rows matching the join condition",
              "Every left row regardless of matches"
            ],
            "answer": 2,
            "explanation": "INNER JOIN returns combinations satisfying the join condition."
          },
          {
            "prompt": "Which join keeps all left-table students, even without applications?",
            "options": [
              "No join can do this",
              "LEFT JOIN",
              "INNER JOIN",
              "CROSS JOIN only"
            ],
            "answer": 1,
            "explanation": "LEFT JOIN preserves unmatched rows from the left table."
          },
          {
            "prompt": "What relationship does a.student_id = s.id express?",
            "options": [
              "An application belongs to that student",
              "The company is a password",
              "The score is always zero",
              "The tables must have identical columns"
            ],
            "answer": 0,
            "explanation": "The application student identifier references the student identifier."
          }
        ]
      },
      {
        "id": "sql-3",
        "title": "Grouping and aggregates",
        "summary": "Turn individual records into useful dashboard summaries.",
        "example": "SELECT company, COUNT(*) AS applications\nFROM applications\nGROUP BY company\nHAVING COUNT(*) >= 5;",
        "points": [
          "COUNT(*) counts rows, including those containing NULL fields.",
          "GROUP BY gathers rows with matching grouping values.",
          "HAVING filters groups after aggregation.",
          "HAVING COUNT(*) >= 5 includes a count of five."
        ],
        "questions": [
          {
            "prompt": "What does COUNT(*) count?",
            "options": [
              "Characters in names",
              "Only non-null scores",
              "Rows",
              "Only distinct companies"
            ],
            "answer": 2,
            "explanation": "COUNT(*) counts rows, including those containing NULL fields."
          },
          {
            "prompt": "What does GROUP BY company create?",
            "options": [
              "A new API per company",
              "One group per company",
              "One database per company",
              "A password per company"
            ],
            "answer": 1,
            "explanation": "GROUP BY gathers rows with matching grouping values."
          },
          {
            "prompt": "Which clause filters aggregate groups?",
            "options": [
              "HAVING",
              "VALUES",
              "SET",
              "LIMIT only"
            ],
            "answer": 0,
            "explanation": "HAVING filters groups after aggregation."
          },
          {
            "prompt": "Will a company with exactly five applications appear?",
            "options": [
              "No",
              "Only with ORDER BY",
              "Only with DISTINCT",
              "Yes"
            ],
            "answer": 3,
            "explanation": "HAVING COUNT(*) >= 5 includes a count of five."
          }
        ]
      },
      {
        "id": "sql-4",
        "title": "Updates and transactions",
        "summary": "Change data deliberately and treat related changes as a unit.",
        "example": "BEGIN;\nUPDATE students SET score = 80 WHERE id = 7;\nCOMMIT;",
        "points": [
          "UPDATE changes values in existing rows.",
          "WHERE restricts which rows are updated.",
          "COMMIT makes the transaction changes permanent.",
          "ROLLBACK discards changes in the current transaction."
        ],
        "questions": [
          {
            "prompt": "Which command changes existing row values?",
            "options": [
              "DESCRIBE",
              "UPDATE",
              "SELECT",
              "CREATE DATABASE"
            ],
            "answer": 1,
            "explanation": "UPDATE changes values in existing rows."
          },
          {
            "prompt": "Why include WHERE id = 7?",
            "options": [
              "Limit the update to the intended row",
              "Sort every student",
              "Create seven rows",
              "Disable transactions"
            ],
            "answer": 0,
            "explanation": "WHERE restricts which rows are updated."
          },
          {
            "prompt": "What does COMMIT do?",
            "options": [
              "Cancels all changes",
              "Deletes the database",
              "Starts a Python loop",
              "Finalizes the transaction"
            ],
            "answer": 3,
            "explanation": "COMMIT makes the transaction changes permanent."
          },
          {
            "prompt": "What cancels an uncommitted transaction?",
            "options": [
              "ORDER BY",
              "COUNT",
              "ROLLBACK",
              "COMMIT"
            ],
            "answer": 2,
            "explanation": "ROLLBACK discards changes in the current transaction."
          }
        ]
      }
    ]
  },
  {
    "id": "react",
    "skill": "React",
    "title": "React Frontend Foundations",
    "target": 60,
    "source": "https://react.dev/learn",
    "introVideo": "/videos/react-intro.mp4",
    "slides": [
      {
        "id": "react-1",
        "title": "Components and JSX",
        "summary": "Build a learning interface from reusable pieces.",
        "example": "function Welcome({ name }) {\n  return <h2>Hello, {name}</h2>;\n}\n// Usage: <Welcome name=\"Asha\" />",
        "points": [
          "React component names start with a capital letter.",
          "JSX braces embed JavaScript expressions in markup.",
          "Props pass data into a component.",
          "The supplied name replaces the JSX expression in the heading."
        ],
        "questions": [
          {
            "prompt": "Which name follows the React component naming convention?",
            "options": [
              "Welcome",
              "welcome",
              "welcome-card",
              "1Welcome"
            ],
            "answer": 0,
            "explanation": "React component names start with a capital letter."
          },
          {
            "prompt": "What do braces around name do in JSX?",
            "options": [
              "Start a SQL query",
              "Create a CSS file",
              "Declare an API route",
              "Insert a JavaScript expression"
            ],
            "answer": 3,
            "explanation": "JSX braces embed JavaScript expressions in markup."
          },
          {
            "prompt": "What does <Welcome name=\"Asha\" /> pass?",
            "options": [
              "An HTTP cookie automatically",
              "A global variable",
              "A name prop",
              "A SQL table"
            ],
            "answer": 2,
            "explanation": "Props pass data into a component."
          },
          {
            "prompt": "What does Welcome render in this example?",
            "options": [
              "The string undefined",
              "Hello, Asha",
              "Hello, name",
              "A blank heading"
            ],
            "answer": 1,
            "explanation": "The supplied name replaces the JSX expression in the heading."
          }
        ]
      },
      {
        "id": "react-2",
        "title": "State and events",
        "summary": "Store changing values and respond to user actions.",
        "example": "const [count, setCount] = useState(0);\nconst increment = () => setCount(previous => previous + 1);\n// <button onClick={increment}>{count}</button>",
        "points": [
          "useState provides a state value and its setter.",
          "A functional setter calculates the next value from previous state.",
          "Passing the function defers its execution until the event.",
          "A state update causes React to render the new count."
        ],
        "questions": [
          {
            "prompt": "Which hook stores count here?",
            "options": [
              "useRoute",
              "useCSS",
              "useSQL",
              "useState"
            ],
            "answer": 3,
            "explanation": "useState provides a state value and its setter."
          },
          {
            "prompt": "Which expression safely increments using previous state?",
            "options": [
              "setCount = 1",
              "count++ without a setter",
              "setCount(previous => previous + 1)",
              "count.push(1)"
            ],
            "answer": 2,
            "explanation": "A functional setter calculates the next value from previous state."
          },
          {
            "prompt": "How should a click handler be supplied?",
            "options": [
              "click={true}",
              "onClick={increment}",
              "onClick={increment()}",
              "onClick=\"increment SQL\""
            ],
            "answer": 1,
            "explanation": "Passing the function defers its execution until the event."
          },
          {
            "prompt": "What should happen after one click from zero?",
            "options": [
              "The displayed count becomes 1",
              "The browser closes",
              "The count stays zero forever",
              "A database is created"
            ],
            "answer": 0,
            "explanation": "A state update causes React to render the new count."
          }
        ]
      },
      {
        "id": "react-3",
        "title": "Lists and immutable updates",
        "summary": "Render stable records and update state predictably.",
        "example": "const nextSkills = [...skills, \"SQL\"];\nsetSkills(nextSkills);\n// students.map(student => <p key={student.id}>{student.name}</p>)",
        "points": [
          "map transforms each array item into an output value.",
          "Stable unique keys preserve list item identity across renders.",
          "Spread copies existing elements into a new array.",
          "Create a new state value instead of modifying the existing array."
        ],
        "questions": [
          {
            "prompt": "Which array method produces elements for a rendered list?",
            "options": [
              "push only",
              "pop only",
              "map",
              "join only"
            ],
            "answer": 2,
            "explanation": "map transforms each array item into an output value."
          },
          {
            "prompt": "Which key best identifies a student record?",
            "options": [
              "The current time each render",
              "A stable unique student.id",
              "Math.random() each render",
              "The same string for every row"
            ],
            "answer": 1,
            "explanation": "Stable unique keys preserve list item identity across renders."
          },
          {
            "prompt": "What does [...skills, \"SQL\"] create?",
            "options": [
              "A new array containing the existing skills and SQL",
              "A database",
              "A function",
              "A number"
            ],
            "answer": 0,
            "explanation": "Spread copies existing elements into a new array."
          },
          {
            "prompt": "Why avoid mutating a state array directly?",
            "options": [
              "To prevent all network requests",
              "To make SQL faster",
              "To disable rerenders permanently",
              "To preserve predictable state updates"
            ],
            "answer": 3,
            "explanation": "Create a new state value instead of modifying the existing array."
          }
        ]
      },
      {
        "id": "react-4",
        "title": "Effects and request states",
        "summary": "Connect the interface to data and handle loading failures.",
        "example": "useEffect(() => {\n  const controller = new AbortController();\n  fetch(\"/api/students\", { signal: controller.signal })\n    .catch(error => {\n      if (error.name !== \"AbortError\") console.error(error);\n    });\n  return () => controller.abort();\n}, []);",
        "points": [
          "Effects synchronize a component with external systems.",
          "An effect may return cleanup for its external work.",
          "AbortController can cancel an unnecessary fetch request.",
          "Show loading and error states as well as successful data."
        ],
        "questions": [
          {
            "prompt": "Which hook synchronizes with an external system?",
            "options": [
              "useDatabase",
              "useEffect",
              "useHTML",
              "useClass"
            ],
            "answer": 1,
            "explanation": "Effects synchronize a component with external systems."
          },
          {
            "prompt": "What is the returned function used for?",
            "options": [
              "Cleanup",
              "Rendering a button",
              "Defining a SQL schema",
              "Adding a prop"
            ],
            "answer": 0,
            "explanation": "An effect may return cleanup for its external work."
          },
          {
            "prompt": "Why abort this request during cleanup?",
            "options": [
              "Make a certificate verified",
              "Change all passwords",
              "Delete the API",
              "Stop work that is no longer needed"
            ],
            "answer": 3,
            "explanation": "AbortController can cancel an unnecessary fetch request."
          },
          {
            "prompt": "Which UI states should a data page handle?",
            "options": [
              "Only empty CSS",
              "Only a fixed percentage",
              "Loading, success and error",
              "Only success"
            ],
            "answer": 2,
            "explanation": "Show loading and error states as well as successful data."
          }
        ]
      }
    ]
  }
];

const ALL_SLIDES = MODULES.flatMap((module) => module.slides);
const blankRecord = () => ({ version: VERSION, slides: {}, syncedModules: {}, certificate: null });
const percent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

function readStore(studentId) {
  try {
    const text = localStorage.getItem(storageKey(studentId));
    if (!text) return { record: blankRecord(), error: "" };
    const record = JSON.parse(text);
    if (record?.version !== VERSION || !record.slides || !record.syncedModules ||
        typeof record.slides !== "object" || Array.isArray(record.slides)) {
      throw new Error("Invalid learning record");
    }
    return { record, error: "" };
  } catch {
    return { record: blankRecord(), error: "Your saved learning record could not be read. Check browser storage before continuing." };
  }
}

function useLearningRecord(studentId) {
  const [store, setStore] = useState(() => readStore(studentId));
  useEffect(() => {
      const refresh = () => setStore(readStore(studentId));
      refresh();
      const storageChanged = (event) => {
        if (event.key === storageKey(studentId) || event.key === null) refresh();
      };
      const localChanged = (event) => {
        if (event.detail === studentId) refresh();
      };
      window.addEventListener("storage", storageChanged);
      window.addEventListener(CHANGE_EVENT, localChanged);
      return () => {
        window.removeEventListener("storage", storageChanged);
        window.removeEventListener(CHANGE_EVENT, localChanged);
      };
    }, [studentId]);

    function commit(transform) {
      const latest = readStore(studentId);
      if (latest.error) { setStore(latest); return false; }
      try {
        const next = transform(latest.record);
        localStorage.setItem(storageKey(studentId), JSON.stringify(next));
        setStore({ record: next, error: "" });
        window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: studentId }));
        return true;
      } catch {
        setStore((previous) => ({ ...previous, error: "Progress could not be saved. Free browser storage or enable site storage, then retry." }));
        return false;
      }
    }
    return { ...store, commit };
  }

  function grade(slide, answers = {}) {
    return slide.questions.reduce((total, question, index) =>
      total + (answers[index] === question.answer ? 1 : 0), 0);
  }
  // A submitted slide is complete regardless of its individual score.
  function quizCompleted(record, slide) {
    const result = record.slides[slide.id];
    return result?.submitted === true && slide.questions.every((question, index) =>
      Number.isInteger(result.answers?.[index]) && result.answers[index] >= 0 &&
      result.answers[index] < question.options.length);
  }
  function moduleResult(record, module) {
    const submitted = module.slides.filter((slide) => quizCompleted(record, slide));
    const total = module.slides.reduce((sum, slide) => sum + slide.questions.length, 0);
    const correct = submitted.reduce((sum, slide) => sum + grade(slide, record.slides[slide.id].answers), 0);
    return { correct, total, submitted: submitted.length,
      complete: submitted.length === module.slides.length,
      percentage: total ? correct / total * 100 : 0 };
  }
  function modulePassed(record, module) {
    // Learning modules remain usable in sequence, but certificates have no
    // eligibility gate. Keep this function for existing progress behaviour.
    const result = moduleResult(record, module);
    return result.complete;
  }
  function unlocked(record, slide) {
    const moduleIndex = MODULES.findIndex((module) => module.slides.some((item) => item.id === slide.id));
    if (moduleIndex < 0 || !MODULES.slice(0, moduleIndex).every((module) => modulePassed(record, module))) return false;
    const module = MODULES[moduleIndex];
    const slideIndex = module.slides.findIndex((item) => item.id === slide.id);
    // A low quiz score does not block the next slide in the same module.
    return module.slides.slice(0, slideIndex).every((item) => quizCompleted(record, item));
  }
  function coursePassed(record) { return MODULES.every((module) => modulePassed(record, module)); }
  function courseScore(record) {
    const correct = MODULES.reduce((sum, module) => sum + moduleResult(record, module).correct, 0);
    const total = ALL_SLIDES.reduce((sum, slide) => sum + slide.questions.length, 0);
    return Number((correct / total * 100).toFixed(2));
  }
  const formatScore = (value) => `${Number(Number(value || 0).toFixed(2))}%`;
  function makeCertificate(record, name, studentId) {
    const cleanName = String(name || "").trim();
    if (!cleanName) throw new Error("The logged-in learner name could not be found.");

    // Reuse the certificate only when it belongs to this same logged-in user.
    // This also removes the old demo-name problem (for example, Lakshay).
    if (record.certificate && String(record.certificate.name || "").trim() === cleanName) {
      return record.certificate;
    }

    return {
      id: `SB-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
      studentId, name: cleanName.slice(0, 100), title: COURSE_TITLE,
      issuedAt: new Date().toISOString(), score: courseScore(record),
      skills: MODULES.map((module) => module.skill),
      verificationStatus: "learning-record",
    };
  }

  async function api(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { throw new Error("The server returned an invalid response."); }
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : `Request failed (${response.status}).`);
      return data;
    } finally { clearTimeout(timer); }
  }

  const button = "rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40";
  const secondary = "rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40";
  const card = "rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6";

  function ProgressBar({ value, label }) {
    return <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent(value)}%` }} />
    </div>;
  }

  function ModuleResults({ record, module }) {
    const result = moduleResult(record, module);
    const successful = modulePassed(record, module);
    return <div className="mt-5 space-y-3">
      <div className="flex flex-wrap justify-between gap-2">
        <h3 className="font-semibold text-white">{module.skill} quiz results</h3>
        <span className={successful ? "text-emerald-300" : "text-slate-400"}>{result.complete ? successful ? "Passed" : "Below 70% · Retry quizzes" : `${result.submitted}/4 submitted`}</span>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="text-xs text-slate-500"><tr><th className="py-2 pr-3">Quiz</th><th className="py-2 pr-3">Correct</th><th className="py-2">Score</th></tr></thead>
        <tbody>{module.slides.map((slide, index) => {
          const done = quizCompleted(record, slide);
          const correct = done ? grade(slide, record.slides[slide.id].answers) : null;
          return <tr key={slide.id} className="border-t border-slate-800 text-slate-300"><td className="py-2 pr-3">{index + 1}. {slide.title}</td><td className="py-2 pr-3">{done ? `${correct}/${slide.questions.length}` : "—"}</td><td className="py-2">{done ? formatScore(correct / slide.questions.length * 100) : "Pending"}</td></tr>;
        })}</tbody>
      </table></div>
      <p className={`rounded-lg p-3 text-sm ${successful ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-800/60 text-slate-300"}`}>
        {result.complete ? "Final module score" : "Points earned so far"}: {result.correct}/{result.total} · {formatScore(result.percentage)}
      </p>
      <p className="text-xs leading-5 text-slate-400">{result.complete ? successful ? "Module requirement met: all quizzes submitted and at least 70%." : "Retry a quiz to improve your module score. You need 12/16 correct overall." : "Submit all four quizzes before the module can pass. Unsubmitted quizzes earn no points yet."}</p>
    </div>;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }
  function downloadCertificate(certificate) {
    const esc = (value) => escapeHTML(value ?? "");
    const issuedDate = new Date(certificate.issuedAt);
    const dateText = Number.isNaN(issuedDate.getTime()) ? "" : issuedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const skillIcons = {
      Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      FastAPI: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
      SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    };
    const skillChips = (certificate.skills || []).map((skill) => {
      const icon = skillIcons[skill];
      return `<div class="skill">${icon ? `<img src="${icon}" alt="${esc(skill)}">` : `<span class="skill-fallback">◆</span>`}<span>${esc(skill)}</span></div>`;
    }).join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SkillBridge — Certificate of Completion</title>
  <style>
  @page{size:A4 landscape;margin:0}
  *{box-sizing:border-box}html,body{margin:0;padding:0;min-height:100%}
  body{background:#f5efe8;color:#25234a;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:24px}
  .instructions{width:min(1180px,100%);margin:0 auto 14px;padding:11px 15px;border-radius:10px;background:#fff8f4;color:#655d72;font:12px/1.5 Arial,sans-serif;border:1px solid #ead8df}
  .certificate{position:relative;width:min(1180px,100%);min-height:790px;margin:0 auto;overflow:hidden;background:radial-gradient(circle at 4% 5%,rgba(192,132,252,.26),transparent 23%),radial-gradient(circle at 97% 6%,rgba(244,114,182,.22),transparent 25%),radial-gradient(circle at 6% 96%,rgba(167,139,250,.30),transparent 27%),radial-gradient(circle at 96% 96%,rgba(244,114,182,.22),transparent 25%),linear-gradient(135deg,#fffaf5 0%,#fff7f2 48%,#fbf4f4 100%);border:1px solid #d9b9ca;box-shadow:0 28px 70px rgba(93,53,91,.16);padding:34px;color:#29264d}
  .grid{position:absolute;inset:0;background-image:radial-gradient(rgba(124,58,237,.055) 1px,transparent 1px);background-size:24px 24px;opacity:.42;pointer-events:none}
  .glow{position:absolute;width:260px;height:260px;border-radius:50%;filter:blur(70px);opacity:.34;pointer-events:none}.g1{background:#c084fc;top:-130px;left:-80px}.g2{background:#f9a8d4;bottom:-140px;right:-80px}
  .topline{position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#8b5cf6,#ec4899,#c084fc,#8b5cf6)}
  .frame{position:absolute;inset:18px;border:1px solid rgba(139,92,246,.34);pointer-events:none;border-radius:2px}.frame2{position:absolute;inset:28px;border:1px solid rgba(236,72,153,.20);pointer-events:none;border-radius:2px}
  .corner{position:absolute;width:105px;height:105px;pointer-events:none;z-index:3}.corner:before{content:"";position:absolute;inset:0;border-style:solid}.corner:after{content:"✦";position:absolute;font-size:18px;text-shadow:0 2px 12px rgba(139,92,246,.25)}
  .corner-tl{top:32px;left:32px}.corner-tl:before{border-width:3px 0 0 3px;border-color:#a78bfa}.corner-tl:after{top:7px;left:12px;color:#c084fc}
  .corner-tr{top:32px;right:32px}.corner-tr:before{border-width:3px 3px 0 0;border-color:#f0a3c6}.corner-tr:after{top:7px;right:12px;color:#ec4899}
  .corner-bl{bottom:32px;left:32px}.corner-bl:before{border-width:0 0 3px 3px;border-color:#c4b5fd}.corner-bl:after{bottom:7px;left:12px;color:#a78bfa}
  .corner-br{bottom:32px;right:32px}.corner-br:before{border-width:0 3px 3px 0;border-color:#f0a3c6}.corner-br:after{bottom:7px;right:12px;color:#ec4899}
  .ribbon{position:absolute;width:280px;height:55px;background:linear-gradient(135deg,rgba(236,72,153,.10),rgba(139,92,246,.10));transform:rotate(32deg);right:-70px;top:75px;border-top:1px solid rgba(236,72,153,.16);border-bottom:1px solid rgba(139,92,246,.16);pointer-events:none}
  .content{position:relative;z-index:4;text-align:center;padding:15px 55px 12px}
  .brand{display:flex;justify-content:center;align-items:center;gap:12px}.logo{width:58px;height:58px;border-radius:17px;background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;color:white;font-weight:950;font-size:25px;box-shadow:0 8px 28px rgba(139,92,246,.20)}
  .brand-name{text-align:left}.brand-name strong{display:block;color:#25234a;font-size:22px;letter-spacing:.18em}
  .eyebrow{margin-top:15px;color:#7653a8;font-size:9px;font-weight:950;letter-spacing:.34em;text-transform:uppercase}
  .celebrate{display:inline-block;margin-top:8px;padding:6px 17px;border:1px solid #e7bfd1;border-radius:999px;background:linear-gradient(90deg,rgba(244,114,182,.10),rgba(167,139,250,.12));color:#75407a;font-size:8px;font-weight:950;letter-spacing:.22em;box-shadow:0 6px 18px rgba(139,92,246,.07)}
  h1{margin:6px 0 0;color:#29264d;font-family:Georgia,"Times New Roman",serif;font-size:48px;letter-spacing:.01em}.rule{width:150px;height:3px;margin:10px auto 14px;background:linear-gradient(90deg,#c084fc,#ec4899,#a78bfa);border-radius:99px}
  .recognition{color:#6d6477;font:14px/1.6 Georgia,"Times New Roman",serif}.name{margin:2px 0;color:#6740a5;font-family:Georgia,"Times New Roman",serif;font-size:43px;font-weight:700;text-shadow:0 4px 18px rgba(139,92,246,.10)}
  .course{margin:6px auto 0;color:#302b55;font-size:24px;font-weight:850;max-width:820px}.subtitle{margin:6px auto 0;color:#776f82;font-size:10px;max-width:760px}
  .stats{display:flex;justify-content:center;margin:16px auto 12px;max-width:790px;border:1px solid #e4c8d6;border-radius:15px;overflow:hidden;background:rgba(255,250,247,.78);box-shadow:0 10px 28px rgba(105,63,105,.08)}
  .stat{min-width:150px;padding:9px 15px;border-right:1px solid #ead5df}.stat:last-child{border-right:0}.stat b{display:block;color:#6340b5;font-size:18px}.stat span{color:#81758b;font-size:8px;text-transform:uppercase;letter-spacing:.13em;font-weight:900}
  .skills-title{color:#806b88;font-size:8px;font-weight:950;letter-spacing:.2em;text-transform:uppercase}.skills{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-top:7px}
  .skill{display:flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid #e5cad9;border-radius:999px;background:rgba(255,255,255,.72);color:#4b4164;font-size:9px;font-weight:850;box-shadow:0 4px 12px rgba(91,59,100,.05)}.skill img{width:17px;height:17px;object-fit:contain}.skill-fallback{width:17px;height:17px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#8b5cf6;color:#fff;font-size:8px}
  .bottom{display:grid;grid-template-columns:1fr 240px 1fr;align-items:end;gap:30px;max-width:930px;margin:24px auto 0}
  .signature{text-align:center;padding-top:11px;border-top:1px solid #a99aaa;color:#746a7d;font-size:9px;position:relative}.signature:before{content:"✦";position:absolute;top:-9px;left:50%;transform:translateX(-50%);padding:0 8px;background:#fff8f4;color:#b779a9;font-size:10px}.signature strong{display:block;font-size:11px;color:#2e294e;letter-spacing:.04em}.signature span{display:block;color:#81758b;margin-top:3px}
  .congrats{align-self:center;text-align:center;color:#78458c}.congrats .laurel{font-size:27px;color:#c18b57;letter-spacing:7px}.congrats strong{display:block;margin-top:-2px;font-size:13px;letter-spacing:.25em;color:#75407a}.congrats span{display:block;margin-top:5px;color:#8a7189;font-size:8px;letter-spacing:.18em;text-transform:uppercase}
  .meta{margin-top:8px;display:flex;justify-content:center;gap:22px;flex-wrap:wrap;color:#81758b;font:8px/1.5 Arial,sans-serif}.meta b{color:#665873}.notice{margin-top:5px;color:#978c98;font:6.5px/1.4 Arial,sans-serif}
  @media print{body{background:#f5efe8;padding:0}.instructions{display:none}.certificate{width:297mm;height:210mm;min-height:0;box-shadow:none;border:0}}

  .verify-stamp{
    position:absolute;
    right:76px;
    bottom:108px;
    width:112px;
    height:112px;
    border:2px solid #9b72b6;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    transform:rotate(-9deg);
    color:#754b88;
    background:rgba(255,248,250,.72);
    box-shadow:0 5px 18px rgba(112,72,126,.10), inset 0 0 0 4px rgba(155,114,182,.10);
    z-index:6;
  }
  .verify-stamp:before{
    content:"";
    position:absolute;
    inset:7px;
    border:1px dashed #b58bc5;
    border-radius:50%;
  }
  .verify-stamp .stamp-inner{
    position:relative;
    text-align:center;
    line-height:1.25;
    font-family:Arial,sans-serif;
  }
  .verify-stamp .stamp-check{
    font-size:21px;
    font-weight:900;
    display:block;
    margin-bottom:2px;
  }
  .verify-stamp .stamp-title{
    display:block;
    font-size:8px;
    font-weight:950;
    letter-spacing:.14em;
  }
  .verify-stamp .stamp-sub{
    display:block;
    margin-top:4px;
    font-size:6.5px;
    letter-spacing:.08em;
    text-transform:uppercase;
  }
  </style></head><body><div class="instructions">Certificate ready. Use <b>Ctrl+P → Save as PDF</b> and choose A4 landscape.</div><main class="certificate"><div class="topline"></div><div class="ribbon"></div><div class="corner corner-tl"></div><div class="corner corner-tr"></div><div class="corner corner-bl"></div><div class="corner corner-br"></div><div class="grid"></div><div class="glow g1"></div><div class="glow g2"></div><div class="frame"></div><div class="frame2"></div><div class="verify-stamp" aria-label="Verified by Professor"><div class="stamp-inner"><span class="stamp-check">✓</span><span class="stamp-title">VERIFIED</span><span class="stamp-sub">BY PROFESSOR</span></div></div><section class="content"><div class="brand"><div class="logo">✦</div><div class="brand-name"><strong>SKILLBRIDGE</strong></div></div><div class="eyebrow">Learning Achievement · Digital Credential</div><div class="celebrate">✦ CONGRATULATIONS ✦</div><h1>Certificate of Completion</h1><div class="rule"></div><div class="recognition">This certificate is proudly presented to</div><div class="name">${esc(certificate.name)}</div><div class="recognition">for completing the learning program</div><div class="course">${esc(certificate.title)}</div><div class="subtitle">Recognizing the learner's completed learning record on the SkillBridge learning platform.</div><div class="stats"><div class="stat"><b>${esc(certificate.score)}%</b><span>Learning Score</span></div><div class="stat"><b>4</b><span>Skill Modules</span></div><div class="stat"><b>16</b><span>Learning Units</span></div><div class="stat"><b>✓</b><span>Completed</span></div></div><div class="skills-title">Technology Skills Covered</div><div class="skills">${skillChips}</div><div class="bottom"><div class="signature"><strong>Program Director</strong><span>SkillBridge</span></div><div class="congrats"><div class="laurel">❮ ✦ ❯</div><strong>CONGRATULATIONS</strong><span>Keep Learning · Keep Growing</span></div><div class="signature"><strong>Issue Date</strong><span>${esc(dateText)}</span></div></div><div class="meta"></div><div class="notice">Certificate details are generated from the learner's SkillBridge learning record · Verified by Professor</div></section></main></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SkillBridge-Certificate.html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  
const LEARNING_RESOURCES = {
  python: {
    title: "Python Backend Foundations & Official Sources",
    icon: "🐍",
    summary: "Python is the core language for backend services, scripting, automation, and AI workflows.",
    sources: [
      {
        title: "Python 3 Official Tutorial",
        provider: "Python.org",
        url: "https://docs.python.org/3/tutorial/",
        badge: "Official Language Guide",
        desc: "The definitive guide covering language syntax, standard library collections, and object models.",
      },
      {
        title: "Harvard CS50P: Programming with Python",
        provider: "Harvard University",
        url: "https://cs50.harvard.edu/python/",
        badge: "Harvard University",
        desc: "Comprehensive university curriculum teaching functions, loops, regex, exceptions, and OOP.",
      },
      {
        title: "freeCodeCamp Python Handbook",
        provider: "freeCodeCamp.org",
        url: "https://www.freecodecamp.org/news/the-python-guide-for-beginners/",
        badge: "Hands-on Handbook",
        desc: "Practical beginner-to-intermediate handbook with code patterns, libraries, and real examples.",
      },
      {
        title: "Python Backend Developer Roadmap",
        provider: "Roadmap.sh",
        url: "https://roadmap.sh/python",
        badge: "Interactive Roadmap",
        desc: "Visual career guide detailing core syntax, package managers, ORMs, and async backend APIs.",
      },
    ],
    cheatSheet: [
      {
        id: "py-dict-list",
        title: "Dictionaries & List Operations",
        desc: "Store structured student records and manipulate collections efficiently.",
        code: `# Dictionary with nested skills
student = {"name": "Candidate", "skills": ["Python"], "target": "Backend"}
student["skills"].append("SQL")  # Appends to end of list
print(len(student["skills"]))  # 2

# List comprehension: filter passed scores
scores = [55, 82, 60, 94, 48]
passed = [s for s in scores if s >= 60]  # [82, 60, 94]`,
      },
      {
        id: "py-func-params",
        title: "Functions & Default Parameters",
        desc: "Encapsulate business logic with typed parameters and return values.",
        code: `def is_ready_for_role(score: int, threshold: int = 70) -> bool:
    """Check if score meets certification minimum."""
    return score >= threshold

print(is_ready_for_role(75))  # True
print(is_ready_for_role(65))  # False (below default 70)`,
      },
      {
        id: "py-json-except",
        title: "Exception Handling & JSON Serialization",
        desc: "Safely parse incoming HTTP payloads and generate API responses.",
        code: `import json

raw_json = '{"student": "Alex", "score": 88}'

try:
    data = json.loads(raw_json)
    status_response = json.dumps({"status": "verified", "student": data["student"]})
    print(status_response)
except (json.JSONDecodeError, KeyError) as err:
    print(f"Invalid payload: {err}")`,
      },
    ],
  },
  git: {
    title: "Git Version Control & Collaboration",
    icon: "📦",
    summary: "Track code changes, manage feature branches, and collaborate effectively with industry engineering teams.",
    sources: [
      {
        title: "Pro Git Book (Complete)",
        provider: "Git-SCM Official",
        url: "https://git-scm.com/book/en/v2",
        badge: "Official Book",
        desc: "The complete, free reference on branching, rebasing, remotes, and internals.",
      },
      {
        title: "GitHub Skills & Interactive Labs",
        provider: "GitHub",
        url: "https://skills.github.com/",
        badge: "Interactive Labs",
        desc: "Learn commit workflows, pull requests, merge conflict resolution, and GitHub Actions.",
      },
    ],
    cheatSheet: [
      {
        id: "git-commit-branch",
        title: "Essential Branching & Committing",
        desc: "Create clean commits and isolated feature workflows.",
        code: `# Create and switch to new branch
git checkout -b feature/skill-analyzer

# Stage modified files and record commit
git add .
git commit -m "feat: implement student readiness scoring algorithm"

# Push branch to remote repository
git push -u origin feature/skill-analyzer`,
      },
    ],
  },
  sql: {
    title: "SQL & Relational Databases",
    icon: "🗄️",
    summary: "Query relational datasets, perform joins, and manage persistence for high-concurrency systems.",
    sources: [
      {
        title: "PostgreSQL Official Tutorial",
        provider: "PostgreSQL.org",
        url: "https://www.postgresql.org/docs/current/tutorial.html",
        badge: "Official Postgres Docs",
        desc: "Comprehensive database tutorial covering tables, indexing, foreign keys, and transactions.",
      },
      {
        title: "SQLBolt Interactive Lessons",
        provider: "SQLBolt",
        url: "https://sqlbolt.com/",
        badge: "Interactive Practice",
        desc: "Browser-based interactive exercises from SELECT statements to complex multi-table joins.",
      },
    ],
    cheatSheet: [
      {
        id: "sql-queries",
        title: "Filtering & Aggregations",
        desc: "Extract candidate benchmarks using WHERE, GROUP BY, and HAVING.",
        code: `-- Query certified students with readiness over 75%
SELECT name, college, readiness_score 
FROM students 
WHERE readiness_score >= 75.0 
ORDER BY readiness_score DESC;`,
      },
    ],
  },
  rest: {
    title: "REST APIs & Modern Web Protocols",
    icon: "⚡",
    summary: "Build scalable HTTP endpoints, serialize JSON models, and handle HTTP status codes.",
    sources: [
      {
        title: "FastAPI Official Documentation",
        provider: "FastAPI",
        url: "https://fastapi.tiangolo.com/tutorial/",
        badge: "FastAPI Docs",
        desc: "Modern Python web framework for building high-performance APIs with automatic OpenAPI docs.",
      },
      {
        title: "MDN Web Docs: HTTP & REST API Guide",
        provider: "Mozilla MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
        badge: "MDN Standard",
        desc: "Comprehensive guide to HTTP methods, headers, status codes, and security best practices.",
      },
    ],
    cheatSheet: [
      {
        id: "rest-fastapi",
        title: "FastAPI Endpoint Implementation",
        desc: "Define clean REST endpoints with Pydantic request validation.",
        code: `from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class StudentModel(BaseModel):
    name: str
    target_role: str

@router.post("/api/students")
def register_student(student: StudentModel):
    return {"status": "success", "data": student.name}`,
      },
    ],
  },
};

export default function LearningCenter({ currentUser, setActivePage }) {
    const studentId = LEARNING_STUDENT_ID;
    const { record, error: storageError, commit } = useLearningRecord(studentId);
    const [activeId, setActiveId] = useState(null);
    const [selectedResourceTab, setSelectedResourceTab] = useState("python");
    const [copiedCodeId, setCopiedCodeId] = useState(null);

    const getStoredUserName = () => {
      if (currentUser?.name) return currentUser.name.trim();

      try {
        const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
        if (session?.user?.name) return String(session.user.name).trim();
      } catch {}

      try {
        const profile = JSON.parse(localStorage.getItem("skillbridge_student_profile") || "{}");
        if (profile?.name) return String(profile.name).trim();
      } catch {}

      const keys = ["user", "currentUser", "loggedInUser", "student", "studentData", "authUser", "userData"];
      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        try {
          const data = JSON.parse(stored);
          const value = data?.name || data?.fullName || data?.username || data?.userName || data?.studentName;
          if (value) return String(value).trim();
        } catch {
          if (key === "user" && stored.trim()) return stored.trim();
        }
      }
      return (
        localStorage.getItem("username") ||
        localStorage.getItem("userName") ||
        localStorage.getItem("name") ||
        localStorage.getItem("loginName") ||
        "Student"
      ).trim();
    };

    const [loggedInUserName, setLoggedInUserName] = useState(() =>
      String(currentUser?.name || getStoredUserName() || record?.name || "Student").trim()
    );
    const [readiness, setReadiness] = useState(null);
    const [proficiency, setProficiency] = useState({});
    const [backendWarning, setBackendWarning] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [syncing, setSyncing] = useState(null);
    const busyRef = useRef(false);

    useEffect(() => {
      let mounted = true;
      api(`/api/skill-gap/${studentId}?role=Backend%20Developer`).then((data) => {
        if (!mounted) return;
        setReadiness(data.summary?.readiness == null ? null : percent(data.summary.readiness));
        const values = {};
        if (Array.isArray(data.skills)) data.skills.forEach((item) => { values[item.name] = percent(item.current); });
        setProficiency(values);
      }).catch(() => { if (mounted) setBackendWarning("Live skill data is unavailable. You can continue learning; progress is saved in this browser."); });
      api("/api/students/").then((data) => {
        let students = [];
        if (Array.isArray(data)) students = data;
        else if (Array.isArray(data?.data)) students = data.data;
        else if (Array.isArray(data?.students)) students = data.students;

        const student = students.find((item) => String(item?.id) === String(studentId));
        const apiName = String(
          student?.name ||
          student?.full_name ||
          student?.studentName ||
          ""
        ).trim();

        const storedName = getStoredUserName();
        const studentName = currentUser?.name || storedName || apiName || String(record?.name || "Student").trim();

        if (mounted && studentName) {
          setLoggedInUserName(studentName);

          commit((previous) => ({
            ...previous,
            name: studentName,
          }));
        }
      }).catch(() => {
        const fallbackName = currentUser?.name || getStoredUserName() || String(record?.name || "Student").trim();
        if (mounted && fallbackName) {
          setLoggedInUserName(fallbackName);
          commit((previous) => ({
            ...previous,
            name: fallbackName,
          }));
        }
      });
      return () => { mounted = false; };
    }, [studentId, currentUser]);

    const completedSlides = ALL_SLIDES.filter((slide) => quizCompleted(record, slide)).length;
    const completedModules = MODULES.filter((module) => modulePassed(record, module)).length;
    const allDone = coursePassed(record);
    const currentCourseScore = courseScore(record);
    const certificateEligible = allDone && currentCourseScore >= CERTIFICATE_MIN_PERCENT;
    const certificate = record?.certificate;
    const certificateMatchesLoggedInUser = !!certificate && !!loggedInUserName && certificate.name === loggedInUserName;
    const activeSlide = ALL_SLIDES.find((slide) => slide.id === activeId);
    const activeModule = MODULES.find((module) => module.slides.some((slide) => slide.id === activeId));
    const slideRecord = activeSlide ? record.slides[activeSlide.id] || { answers: {}, submitted: false, attempts: 0 } : null;
    const slideAvailable = activeSlide && unlocked(record, activeSlide);
    const activeModulePassed = activeModule ? modulePassed(record, activeModule) : false;

    function openSlide(slide) {
      if (!unlocked(record, slide)) return;
      setActiveId(slide.id); setMessage(""); setError("");
    }
    function answerQuestion(index, answer) {
      if (!activeSlide || !slideAvailable || slideRecord.submitted || activeModulePassed) return;
      commit((previous) => {
        const old = previous.slides[activeSlide.id] || { answers: {}, submitted: false, attempts: 0 };
        if (!unlocked(previous, activeSlide) || old.submitted || modulePassed(previous, activeModule)) return previous;
        return { ...previous, slides: { ...previous.slides, [activeSlide.id]: { ...old, answers: { ...old.answers, [index]: answer } } } };
      });
    }
    function submitQuiz(event) {
      event.preventDefault(); setError("");
      if (!activeSlide || !slideAvailable || slideRecord.submitted || activeModulePassed) return;
      if (!activeSlide.questions.every((question, index) => Number.isInteger(slideRecord.answers[index]) && slideRecord.answers[index] >= 0 && slideRecord.answers[index] < question.options.length)) {
        setError("Please answer all four questions before submitting."); return;
      }
      commit((previous) => {
        const old = previous.slides[activeSlide.id];
        if (!old || old.submitted || !unlocked(previous, activeSlide) || modulePassed(previous, activeModule)) return previous;
        if (!activeSlide.questions.every((question, index) => Number.isInteger(old.answers[index]) && old.answers[index] >= 0 && old.answers[index] < question.options.length)) return previous;
        return { ...previous, slides: { ...previous.slides, [activeSlide.id]: { ...old, submitted: true, attempts: (old.attempts || 0) + 1,
          history: [...(Array.isArray(old.history) ? old.history : []), {
            correct: grade(activeSlide, old.answers), total: activeSlide.questions.length,
            submittedAt: new Date().toISOString(),
          }] } } };
      });
    }
    function retryQuiz() {
      if (!activeSlide || !slideRecord.submitted || activeModulePassed || !slideAvailable) return;
      commit((previous) => {
        if (modulePassed(previous, activeModule) || !unlocked(previous, activeSlide)) return previous;
        const old = previous.slides[activeSlide.id] || {};
        const history = Array.isArray(old.history) && old.history.length ? old.history
          : old.submitted ? [{ correct: grade(activeSlide, old.answers), total: activeSlide.questions.length }] : [];
        return { ...previous, slides: { ...previous.slides, [activeSlide.id]: {
          answers: {}, submitted: false, attempts: old.attempts || 0, history,
        } } };
      });
      setMessage(""); setError("");
    }
    function resetAllLearningProgress() {
      const confirmed = window.confirm(
        "Reset all module quiz progress? This will erase all quiz answers, scores, attempts, module completion, synchronization status, and the local certificate record."
      );
      if (!confirmed) return;

      const ok = commit(() => blankRecord());
      setActiveId(null);
      setError("");
      setMessage(ok ? "All module quiz progress has been reset. You can start from zero." : "Progress could not be reset. Please try again.");
    }
    function issueCertificate() {
      setError(""); setMessage("");
      if (!loggedInUserName) { setError("Your logged-in learner name could not be found."); return; }
      const score = courseScore(record);
      if (!coursePassed(record)) {
        setError("Complete all 4 learning modules before requesting your certificate.");
        return;
      }
      if (score < CERTIFICATE_MIN_PERCENT) {
        setError(`Certificate eligibility requires ${CERTIFICATE_MIN_PERCENT}% or higher. Your current learning score is ${formatScore(score)}.`);
        return;
      }
      try {
        const ok = commit((previous) => ({
          ...previous,
          name: loggedInUserName,
          certificate: makeCertificate(previous, loggedInUserName, studentId),
        }));
        if (ok) {
          setMessage("Congratulations! You are eligible. Your certificate is ready to download.");
        } else {
          setError("Certificate could not be saved. Please check browser storage and try again.");
        }
      } catch (err) {
        setError(err?.message || "Certificate could not be created.");
      }
    }
    async function syncModule(module) {
      if (busyRef.current || !modulePassed(record, module) || record.syncedModules[module.id]) return;
      busyRef.current = true; setSyncing(module.id); setError(""); setMessage("");
      try {
        await api("/api/learning/complete", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId, skill: module.skill, completed: true,
            improved_proficiency: Math.max(proficiency[module.skill] || 0, module.target) }),
        });
        const persisted = commit((previous) => ({ ...previous, syncedModules: { ...previous.syncedModules, [module.id]: new Date().toISOString() } }));
        setMessage(persisted ? `${module.skill} completion was accepted by the existing skill API. Certificate verification is separate.` : "The server accepted completion, but the local sync status could not be saved.");
        try {
          const data = await api(`/api/skill-gap/${studentId}?role=Backend%20Developer`);
          setReadiness(data.summary?.readiness == null ? null : percent(data.summary.readiness));
          const values = {};
          if (Array.isArray(data.skills)) data.skills.forEach((item) => { values[item.name] = percent(item.current); });
          setProficiency(values); setBackendWarning("");
        } catch { setBackendWarning("Completion was accepted, but refreshed skill data is unavailable."); }
      } catch (err) {
        setError(`${err.message} Your local learning progress is retained. Check the backend and retry synchronization.`);
      } finally { busyRef.current = false; setSyncing(null); }
    }

    return <div className="space-y-7 pb-10 text-slate-200">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Personalized learning</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Learning Center</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Learn a concept, check your understanding, and build a record of completion.</p></div>
        {activeSlide && <button type="button" className={secondary} onClick={() => setActiveId(null)}>← Learning dashboard</button>}
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={card}><p className="text-sm text-slate-400">Modules passed</p><p className="mt-2 text-3xl font-bold text-white">{completedModules}<span className="text-lg text-slate-500"> / 4</span></p></div>
        <div className={card}><p className="text-sm text-slate-400">Learning progress</p><p className="mt-2 text-3xl font-bold text-cyan-300">{Math.round(completedSlides / ALL_SLIDES.length * 100)}%</p><ProgressBar value={completedSlides / ALL_SLIDES.length * 100} label="Course completion" /></div>
        <div className={card}><p className="text-sm text-slate-400">Backend Developer readiness</p><p className="mt-2 text-3xl font-bold text-white">{readiness === null ? "Unavailable" : `${Math.round(readiness)}%`}</p><p className="mt-2 text-xs text-slate-500">From the existing skill-gap API</p></div>
      </div>
      {storageError && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{storageError}</div>}
      {backendWarning && <div role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">{backendWarning}</div>}
      {error && <div role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-300">{error}</div>}
      {message && <div role="status" className="rounded-xl bg-emerald-500/10 p-4 text-emerald-300">{message}</div>}

      {!activeSlide ? <>
        <section className={`${card} border-cyan-900 bg-gradient-to-br from-cyan-950/40 to-slate-900`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Your learning pathway</p>
          <h2 className="mt-3 text-2xl font-bold text-white">{COURSE_TITLE}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">4 skill modules · 4 slides per module · 4 questions per slide. Submit each quiz to continue within the module. Complete each quiz to continue through the learning pathway. Retry quizzes in an unfinished or failed module; the latest submitted score counts.</p>
          <p className="mt-3 text-xs text-slate-500">Learning progress is tracked separately from skill proficiency. Your certificate is generated from your SkillBridge learning record.</p>
        </section>

        {/* ======================================================
            CURATED LEARNING SOURCES & MASTERCLASS GUIDES
        ====================================================== */}
        <section className={`${card} border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 shadow-xl`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Verified Learning Curricula & Reference Hub
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-white flex items-center gap-2">
                <span>Core Engineering Study Sources</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Featured: Python
                </span>
              </h2>
              <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                Access official university courses, freeCodeCamp manuals, and in-portal code references before taking module quizzes.
              </p>
            </div>

            {/* Technology Selector Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              {Object.entries(LEARNING_RESOURCES).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedResourceTab(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedResourceTab === key
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="capitalize">{key}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content */}
          {LEARNING_RESOURCES[selectedResourceTab] && (
            <div className="mt-6 space-y-6">
              {/* Overview & Description */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{LEARNING_RESOURCES[selectedResourceTab].icon}</span>
                    <span>{LEARNING_RESOURCES[selectedResourceTab].title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {LEARNING_RESOURCES[selectedResourceTab].summary}
                  </p>
                </div>
              </div>

              {/* Curated External Official Sources */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <span>Top Authoritative Learning Portals</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {LEARNING_RESOURCES[selectedResourceTab].sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                            {src.badge}
                          </span>
                          <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition">
                            ↗
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                          {src.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {src.desc}
                        </p>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-3 flex items-center gap-1">
                        <span>Provider: {src.provider}</span>
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* In-Portal Code CheatSheet & Examples */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <span>Interactive In-Portal Cheatsheet & Syntax Reference</span>
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {LEARNING_RESOURCES[selectedResourceTab].cheatSheet.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h4 className="font-bold text-white text-xs text-indigo-300">
                            {item.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.code);
                              setCopiedCodeId(item.id);
                              setTimeout(() => setCopiedCodeId(null), 2500);
                            }}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-indigo-400 transition cursor-pointer"
                          >
                            {copiedCodeId === item.id ? "✓ Copied" : "Copy Code"}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                          {item.desc}
                        </p>
                        <pre className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/90 p-3 text-xs text-indigo-200 font-mono leading-relaxed">
                          <code>{item.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/10"
            onClick={resetAllLearningProgress}
          >
            ↻ Reset all progress
          </button>
        </div>
        <section className="grid gap-5 lg:grid-cols-2" aria-label="Learning modules">
          {MODULES.map((module, index) => {
            const count = module.slides.filter((slide) => quizCompleted(record, slide)).length;
            const done = modulePassed(record, module);
            const available = unlocked(record, module.slides[0]);
            const next = module.slides.find((slide) => !quizCompleted(record, slide)) || module.slides[0];
            return <article key={module.id} className={card}>
              <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Module {index + 1} · {module.skill}</span><span className={`text-xs ${done ? "text-emerald-300" : "text-slate-400"}`}>{done ? "Passed" : available ? "Ready to learn" : "Locked"}</span></div>
              <h3 className="mt-3 text-xl font-bold text-white">{module.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{count}/4 quizzes submitted · {proficiency[module.skill] == null ? "Skill proficiency unavailable" : `Current proficiency: ${proficiency[module.skill]}%`}</p>
              <ProgressBar value={count / 4 * 100} label={`${module.skill} module progress`} />
              {module.introVideo && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">📹 Introduction Video</p>
                  <video
                    className="w-full rounded-xl border border-slate-700/60"
                    src={module.introVideo}
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <ul className="mt-5 space-y-2">{module.slides.map((slide, slideIndex) => <li key={slide.id} className="flex gap-2 text-sm text-slate-400"><span className={quizCompleted(record, slide) ? "text-emerald-400" : "text-slate-500"}>{quizCompleted(record, slide) ? "✓" : `${slideIndex + 1}.`}</span>{slide.title}</li>)}</ul>
              <button type="button" className={`${button} mt-6 w-full`} disabled={!available} onClick={() => openSlide(next)}>{done ? "Review module" : !available ? "Pass the previous module" : count === 4 ? "Review results and retry" : count ? "Continue module" : "Start module"}</button>
              <ModuleResults record={record} module={module} />
              {done && <button type="button" className={`${secondary} mt-3 w-full`} disabled={syncing !== null || Boolean(record.syncedModules[module.id])} onClick={() => syncModule(module)}>{record.syncedModules[module.id] ? "Skill completion synchronized" : syncing === module.id ? "Synchronizing…" : "Sync completion to skill profile"}</button>}
            </article>;
          })}
        </section>
        <section className={card}>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Certificate</p>
          <h2 className="mt-2 text-xl font-bold text-white">SkillBridge Certificate</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Certificate eligibility requires completion of all 4 modules and a learning score of <span className="font-semibold text-cyan-300">{CERTIFICATE_MIN_PERCENT}% or higher</span>.</p>
          <div className={`mt-4 rounded-xl border p-4 ${certificateEligible ? "border-emerald-500/30 bg-emerald-500/10" : "border-amber-500/25 bg-amber-500/5"}`}>
            <p className={`text-sm font-semibold ${certificateEligible ? "text-emerald-300" : "text-amber-300"}`}>
              {certificateEligible ? "✓ Certificate eligible" : "Certificate not yet eligible"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Current score: {formatScore(currentCourseScore)} · Modules completed: {completedModules}/4 · Minimum required: {CERTIFICATE_MIN_PERCENT}%
            </p>
          </div>

          {!certificateMatchesLoggedInUser && <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
            <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Certificate name</p>
              <p className="mt-1 text-sm font-semibold text-white">{loggedInUserName || "Logged-in learner"}</p>
              <p className="mt-1 text-xs text-slate-500">Automatically taken from your logged-in learning account.</p>
            </div>
            <button type="button" className={button} disabled={!loggedInUserName || !certificateEligible} onClick={issueCertificate}>
              {certificateEligible ? "Create Certificate" : `Need ${CERTIFICATE_MIN_PERCENT}% to Certify`}
            </button>
          </div>}

          {certificateMatchesLoggedInUser && certificateEligible && <div className="mt-5 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Certificate ready</p>
            <h3 className="mt-2 text-lg font-bold text-white">{certificate.title}</h3>
            <p className="mt-2 text-slate-200">{certificate.name}</p>
            <p className="mt-2 text-sm text-slate-400">Learning score: {certificate.score}% · Issued {new Date(certificate.issuedAt).toLocaleDateString()}</p>
            <div className="mt-4 flex flex-wrap gap-2">{MODULES.map((module) => <span key={module.id} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-300">{module.skill}</span>)}</div>
            <button type="button" className={`${button} mt-5`} onClick={() => downloadCertificate(certificate)}>Download Certificate</button>
          </div>}

          {!certificateEligible && <p className="mt-4 text-xs leading-5 text-slate-500">Learners scoring below {CERTIFICATE_MIN_PERCENT}% or who have not completed all 4 modules cannot create or download a certificate.</p>}
        </section>
      </> : <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={card} aria-label="Slide navigation">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">{activeModule.skill}</p><h2 className="mt-2 font-bold text-white">Module slides</h2>
          <div className="mt-4 space-y-2">{activeModule.slides.map((slide, index) => <button key={slide.id} type="button" disabled={!unlocked(record, slide)} aria-current={slide.id === activeId ? "step" : undefined} onClick={() => openSlide(slide)} className={`w-full rounded-xl border p-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40 ${slide.id === activeId ? "border-cyan-500 bg-cyan-500/10 text-cyan-200" : "border-slate-800 text-slate-400"}`}>{quizCompleted(record, slide) ? "✓" : index + 1} · {slide.title}</button>)}</div>
          <p className="mt-5 text-xs leading-5 text-slate-500">Progress and draft answers are saved in this browser. Clear site data only if you intend to remove them.</p>
        </aside>
        <div className="min-w-0 space-y-5">
          {!slideAvailable ? <section className={card}><p>Submit earlier slide quizzes and pass the previous module to unlock this lesson.</p></section> : <>
            <section className={card}>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Slide {activeModule.slides.findIndex((slide) => slide.id === activeId) + 1} of 4</p>
              <h2 className="mt-3 text-2xl font-bold text-white">{activeSlide.title}</h2><p className="mt-3 leading-7 text-slate-300">{activeSlide.summary}</p>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-300">{activeSlide.points.map((point) => <li key={point}>{point}</li>)}</ul>
              <pre className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-cyan-200"><code>{activeSlide.example}</code></pre>
              <a className="mt-4 inline-block text-sm text-cyan-300 underline" href={activeModule.source} target="_blank" rel="noreferrer">Explore the official {activeModule.skill} documentation ↗️</a>
            </section>
            <section className={card}><ModuleResults record={record} module={activeModule} /></section>
            <form onSubmit={submitQuiz} className={card}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className={secondary}
                  onClick={() => {
                    setActiveId(null);
                    setMessage("Returned to the learning modules. Your quiz progress is saved.");
                    setError("");
                  }}
                >
                  ← Back to Modules
                </button>
                <span className="text-xs text-slate-500">Your progress is saved automatically</span>
              </div>
              <h2 className="text-xl font-bold text-white">Check your understanding</h2><p className="mt-2 text-sm text-slate-400">Answer all 4 questions. Each quiz contributes to the module total; the module pass mark is 70%.</p>
              <div className="mt-6 space-y-7">{activeSlide.questions.map((question, questionIndex) => <fieldset key={`${activeId}-${questionIndex}`} disabled={slideRecord.submitted}>
                <legend className="mb-3 font-medium text-white">{questionIndex + 1}. {question.prompt}</legend>
                <div className="grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${slideRecord.answers[questionIndex] === optionIndex ? "border-cyan-400 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"}`}>
                  <input type="radio" name={`${activeId}-${questionIndex}`} value={optionIndex} checked={slideRecord.answers[questionIndex] === optionIndex} onChange={() => answerQuestion(questionIndex, optionIndex)} className="mt-1 accent-cyan-400" />{option}
                </label>)}</div>
                {slideRecord.submitted && <p className={`mt-3 text-sm leading-6 ${slideRecord.answers[questionIndex] === question.answer ? "text-emerald-300" : "text-amber-300"}`}>{slideRecord.answers[questionIndex] === question.answer ? "Correct. " : `Correct answer: ${question.options[question.answer]}. `}{question.explanation}</p>}
              </fieldset>)}</div>
              {!slideRecord.submitted ? <button type="submit" className={`${button} mt-7`}>Submit quiz</button> : <div className="mt-7 rounded-xl border border-slate-700 p-4" role="status">
                <p className="font-bold text-cyan-300">Quiz result: {grade(activeSlide, slideRecord.answers)}/{activeSlide.questions.length} correct · {formatScore(grade(activeSlide, slideRecord.answers) / activeSlide.questions.length * 100)}</p>
                <p className="mt-1 text-sm text-slate-300">{activeSlide.questions.length - grade(activeSlide, slideRecord.answers)} incorrect · Attempts: {slideRecord.attempts}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {!activeModulePassed && <button type="button" className={secondary} onClick={retryQuiz}>Retry this quiz</button>}
                  <button type="button" className={button} onClick={() => {
                    const next = ALL_SLIDES[ALL_SLIDES.findIndex((slide) => slide.id === activeId) + 1];
                    if (next && unlocked(record, next)) openSlide(next); else setActiveId(null);
                  }}>{(() => {
                    const next = ALL_SLIDES[ALL_SLIDES.findIndex((slide) => slide.id === activeId) + 1];
                    if (!next) return allDone ? "Finish course · Get certificate" : "Review module results";
                    if (!unlocked(record, next)) return "Review module results";
                    return activeModule.slides.some((slide) => slide.id === next.id) ? "Continue to next slide →" : "Module passed · Next module →";
                  })()}</button>
                </div>
                {activeModulePassed && <p className="mt-3 text-sm text-emerald-300">Module passed. Results are locked to preserve your completed module score.</p>}
              </div>}
              {Array.isArray(slideRecord.history) && slideRecord.history.length > 0 && <div className="mt-5 border-t border-slate-800 pt-4">
                <h3 className="font-semibold text-white">Quiz attempt results</h3>
                <p className="mt-1 text-xs text-slate-400">The latest submitted attempt counts toward the module score.</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">{slideRecord.history.map((attempt, index) => <li key={index}>Attempt {index + 1}: {attempt.correct}/{attempt.total} correct · {formatScore(attempt.correct / attempt.total * 100)}</li>)}</ul>
              </div>}
            </form>
          </>}
        </div>
      </div>}
    </div>;
  }