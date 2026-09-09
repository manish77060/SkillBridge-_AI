import { useEffect, useMemo, useRef, useState } from "react";
import {
  Brain,
  CheckCircle2,
  Clock3,
  Target,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Loader2,
  Trophy,
  Info,
  XCircle,
  Award,
  BriefcaseBusiness,
  BookOpen,
  Code2,
  Play,
  Send,
  Terminal,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

const STUDENT_ID = "e0bab151-ab49-42fe-b6f1-c4346834b1f1";

// ============================================================
// ROLE CONFIGURATION
// ============================================================

const APPLIED_ROLE = {
  role: "Software Engineer Intern",
  company: "InnovateLabs",
};

// ============================================================
// ASSESSMENT CONFIGURATION
// ============================================================

const TOTAL_TIME = 15 * 60; // 15 minutes

const MARKS_PER_CORRECT = 1;
const MARKS_PER_WRONG = 0.25;
// Skill-performance threshold and Round 2 eligibility cutoff.
const CUTOFF_PERCENTAGE = 60;

// ============================================================
// 25 QUESTION SKILL ASSESSMENT
// First 25 questions from the existing question bank
// ============================================================

const ALL_QUESTIONS = [
  // ==========================================================
  // PYTHON — 10 QUESTIONS
  // ==========================================================

  {
    id: 1,
    skill: "Python",
    question: "Which Python data structure stores key-value pairs?",
    options: ["List", "Tuple", "Dictionary", "Set"],
    answer: "Dictionary",
    difficulty: "Easy",
  },

  {
    id: 2,
    skill: "Python",
    question: "What is the output of len([10, 20, 30])?",
    options: ["2", "3", "4", "Error"],
    answer: "3",
    difficulty: "Easy",
  },

  {
    id: 3,
    skill: "Python",
    question: "Which keyword is used to define a function in Python?",
    options: ["function", "func", "def", "define"],
    answer: "def",
    difficulty: "Easy",
  },

  {
    id: 4,
    skill: "Python",
    question: "Which of the following is immutable in Python?",
    options: ["List", "Dictionary", "Set", "Tuple"],
    answer: "Tuple",
    difficulty: "Easy",
  },

  {
    id: 5,
    skill: "Python",
    question: "What does the append() method do to a list?",
    options: [
      "Removes an item",
      "Adds an item to the end",
      "Sorts the list",
      "Reverses the list",
    ],
    answer: "Adds an item to the end",
    difficulty: "Easy",
  },

  {
    id: 6,
    skill: "Python",
    question: "Which symbol is used for a single-line comment in Python?",
    options: ["//", "#", "/*", "--"],
    answer: "#",
    difficulty: "Easy",
  },

  {
    id: 7,
    skill: "Python",
    question: "What is the output of 10 // 3 in Python?",
    options: ["3", "3.33", "1", "4"],
    answer: "3",
    difficulty: "Medium",
  },

  {
    id: 8,
    skill: "Python",
    question: "Which keyword is used to handle exceptions?",
    options: ["catch", "error", "try", "exception"],
    answer: "try",
    difficulty: "Medium",
  },

  {
    id: 9,
    skill: "Python",
    question: "Which function returns the number of items in an object?",
    options: ["count()", "size()", "length()", "len()"],
    answer: "len()",
    difficulty: "Easy",
  },

  {
    id: 10,
    skill: "Python",
    question: "What does range(5) generate?",
    options: [
      "1, 2, 3, 4, 5",
      "0, 1, 2, 3, 4",
      "0, 1, 2, 3, 4, 5",
      "5 only",
    ],
    answer: "0, 1, 2, 3, 4",
    difficulty: "Medium",
  },

  // ==========================================================
  // SQL — 10 QUESTIONS
  // ==========================================================

  {
    id: 11,
    skill: "SQL",
    question: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "SELECT", "UPDATE", "DELETE"],
    answer: "SELECT",
    difficulty: "Easy",
  },

  {
    id: 12,
    skill: "SQL",
    question: "Which clause is used to filter rows in SQL?",
    options: ["ORDER BY", "GROUP BY", "WHERE", "JOIN"],
    answer: "WHERE",
    difficulty: "Easy",
  },

  {
    id: 13,
    skill: "SQL",
    question: "Which command is used to add a new record to a table?",
    options: ["ADD", "INSERT", "CREATE", "UPDATE"],
    answer: "INSERT",
    difficulty: "Easy",
  },

  {
    id: 14,
    skill: "SQL",
    question: "Which command modifies existing records?",
    options: ["CHANGE", "MODIFY", "UPDATE", "ALTER"],
    answer: "UPDATE",
    difficulty: "Easy",
  },

  {
    id: 15,
    skill: "SQL",
    question: "Which command removes records from a table?",
    options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
    answer: "DELETE",
    difficulty: "Easy",
  },

  {
    id: 16,
    skill: "SQL",
    question: "Which keyword removes duplicate rows from a SELECT result?",
    options: ["UNIQUE", "DISTINCT", "ONLY", "FILTER"],
    answer: "DISTINCT",
    difficulty: "Medium",
  },

  {
    id: 17,
    skill: "SQL",
    question: "Which clause is used to sort query results?",
    options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE BY"],
    answer: "ORDER BY",
    difficulty: "Easy",
  },

  {
    id: 18,
    skill: "SQL",
    question: "Which function returns the number of rows?",
    options: ["SUM()", "COUNT()", "TOTAL()", "NUMBER()"],
    answer: "COUNT()",
    difficulty: "Easy",
  },

  {
    id: 19,
    skill: "SQL",
    question: "Which JOIN returns matching records from both tables?",
    options: ["INNER JOIN", "LEFT JOIN", "FULL JOIN", "CROSS JOIN"],
    answer: "INNER JOIN",
    difficulty: "Medium",
  },

  {
    id: 20,
    skill: "SQL",
    question: "Which constraint uniquely identifies each row in a table?",
    options: ["FOREIGN KEY", "UNIQUE", "PRIMARY KEY", "CHECK"],
    answer: "PRIMARY KEY",
    difficulty: "Medium",
  },

  // ==========================================================
  // REACT — 10 QUESTIONS
  // ==========================================================

  {
    id: 21,
    skill: "React",
    question: "Which hook is commonly used to manage state in React?",
    options: ["useState", "useRoute", "useStyle", "usePage"],
    answer: "useState",
    difficulty: "Easy",
  },

  {
    id: 22,
    skill: "React",
    question:
      "Which syntax is commonly used to render a JavaScript expression in JSX?",
    options: ["[]", "{}", "()", "<>"],
    answer: "{}",
    difficulty: "Easy",
  },

  {
    id: 23,
    skill: "React",
    question: "Which hook is commonly used for side effects?",
    options: ["useEffect", "useAction", "useSide", "useEvent"],
    answer: "useEffect",
    difficulty: "Easy",
  },

  {
    id: 24,
    skill: "React",
    question: "What does JSX allow developers to write?",
    options: [
      "SQL inside JavaScript",
      "HTML-like syntax inside JavaScript",
      "Python inside HTML",
      "CSS inside SQL",
    ],
    answer: "HTML-like syntax inside JavaScript",
    difficulty: "Easy",
  },

  {
    id: 25,
    skill: "React",
    question:
      "What is used to pass data from a parent component to a child?",
    options: ["State", "Props", "Hooks", "Events"],
    answer: "Props",
    difficulty: "Easy",
  },

  {
    id: 26,
    skill: "React",
    question: "Which method is commonly used to render a list of elements?",
    options: ["forEach()", "map()", "filter()", "reduce()"],
    answer: "map()",
    difficulty: "Easy",
  },

  {
    id: 27,
    skill: "React",
    question: "Why is a key prop used when rendering lists?",
    options: [
      "To style elements",
      "To identify elements efficiently",
      "To create routes",
      "To store passwords",
    ],
    answer: "To identify elements efficiently",
    difficulty: "Medium",
  },

  {
    id: 28,
    skill: "React",
    question: "What happens when React state is updated?",
    options: [
      "The component can re-render",
      "The browser closes",
      "The database is deleted",
      "The server restarts",
    ],
    answer: "The component can re-render",
    difficulty: "Medium",
  },

  {
    id: 29,
    skill: "React",
    question:
      "Which command commonly creates a new React project with Vite?",
    options: [
      "npm create vite@latest",
      "npm react new",
      "react create app",
      "npm start-react",
    ],
    answer: "npm create vite@latest",
    difficulty: "Medium",
  },

  {
    id: 30,
    skill: "React",
    question:
      "Which hook is commonly used to access a DOM element or store a mutable value?",
    options: ["useRef", "useDOM", "useElement", "useValue"],
    answer: "useRef",
    difficulty: "Medium",
  },

  // ==========================================================
  // FASTAPI — 10 QUESTIONS
  // ==========================================================

  {
    id: 31,
    skill: "FastAPI",
    question: "FastAPI is primarily used for building what?",
    options: [
      "Mobile applications",
      "Web APIs",
      "Operating systems",
      "Databases",
    ],
    answer: "Web APIs",
    difficulty: "Easy",
  },

  {
    id: 32,
    skill: "FastAPI",
    question: "Which decorator is commonly used for a GET endpoint?",
    options: [
      "@app.get()",
      "@app.fetch()",
      "@api.read()",
      "@route.getdata()",
    ],
    answer: "@app.get()",
    difficulty: "Easy",
  },

  {
    id: 33,
    skill: "FastAPI",
    question: "Which decorator is commonly used for a POST endpoint?",
    options: [
      "@app.send()",
      "@app.post()",
      "@app.create()",
      "@api.postdata()",
    ],
    answer: "@app.post()",
    difficulty: "Easy",
  },

  {
    id: 34,
    skill: "FastAPI",
    question:
      "Which Python server is commonly used to run FastAPI applications?",
    options: ["Apache", "Uvicorn", "MySQL", "MongoDB"],
    answer: "Uvicorn",
    difficulty: "Easy",
  },

  {
    id: 35,
    skill: "FastAPI",
    question:
      "Which library is commonly used by FastAPI for data validation?",
    options: ["Pydantic", "NumPy", "Pandas", "Matplotlib"],
    answer: "Pydantic",
    difficulty: "Medium",
  },

  {
    id: 36,
    skill: "FastAPI",
    question:
      "Which HTTP status code normally indicates a successful request?",
    options: ["200", "404", "500", "301"],
    answer: "200",
    difficulty: "Easy",
  },

  {
    id: 37,
    skill: "FastAPI",
    question:
      "Which HTTP status code usually means 'Not Found'?",
    options: ["200", "201", "404", "500"],
    answer: "404",
    difficulty: "Easy",
  },

  {
    id: 38,
    skill: "FastAPI",
    question:
      "What is the purpose of a Pydantic model in FastAPI?",
    options: [
      "Database backup",
      "Request/response data validation",
      "CSS styling",
      "Git management",
    ],
    answer: "Request/response data validation",
    difficulty: "Medium",
  },

  {
    id: 39,
    skill: "FastAPI",
    question:
      "Which command starts a FastAPI application using Uvicorn?",
    options: [
      "python start fastapi",
      "uvicorn app.main:app --reload",
      "fastapi start server",
      "npm run fastapi",
    ],
    answer: "uvicorn app.main:app --reload",
    difficulty: "Medium",
  },

  {
    id: 40,
    skill: "FastAPI",
    question:
      "Which HTTP method is generally used to partially update a resource?",
    options: ["GET", "POST", "PATCH", "HEAD"],
    answer: "PATCH",
    difficulty: "Medium",
  },

  // ==========================================================
  // GIT — 10 QUESTIONS
  // ==========================================================

  {
    id: 41,
    skill: "Git",
    question: "Which command creates a new Git repository?",
    options: ["git start", "git init", "git create", "git new"],
    answer: "git init",
    difficulty: "Easy",
  },

  {
    id: 42,
    skill: "Git",
    question:
      "Which command uploads committed changes to a remote repository?",
    options: ["git upload", "git push", "git send", "git deploy"],
    answer: "git push",
    difficulty: "Easy",
  },

  {
    id: 43,
    skill: "Git",
    question:
      "Which command downloads changes from a remote repository?",
    options: [
      "git download",
      "git pull",
      "git fetch-all",
      "git receive",
    ],
    answer: "git pull",
    difficulty: "Easy",
  },

  {
    id: 44,
    skill: "Git",
    question: "Which command creates a commit?",
    options: [
      "git save",
      "git commit",
      "git store",
      "git snapshot",
    ],
    answer: "git commit",
    difficulty: "Easy",
  },

  {
    id: 45,
    skill: "Git",
    question:
      "Which command shows the current working tree status?",
    options: [
      "git check",
      "git status",
      "git state",
      "git info",
    ],
    answer: "git status",
    difficulty: "Easy",
  },

  {
    id: 46,
    skill: "Git",
    question: "Which command creates a new branch?",
    options: [
      "git branch branch-name",
      "git new branch-name",
      "git create branch-name",
      "git branch-new branch-name",
    ],
    answer: "git branch branch-name",
    difficulty: "Medium",
  },

  {
    id: 47,
    skill: "Git",
    question: "Which command switches to another branch?",
    options: [
      "git switch",
      "git move",
      "git change",
      "git branch-change",
    ],
    answer: "git switch",
    difficulty: "Medium",
  },

  {
    id: 48,
    skill: "Git",
    question: "Which command shows previous commits?",
    options: [
      "git history",
      "git commits",
      "git log",
      "git previous",
    ],
    answer: "git log",
    difficulty: "Easy",
  },

  {
    id: 49,
    skill: "Git",
    question:
      "Which command stages a file before committing?",
    options: [
      "git stage file",
      "git add file",
      "git prepare file",
      "git commit file",
    ],
    answer: "git add file",
    difficulty: "Easy",
  },

  {
    id: 50,
    skill: "Git",
    question: "What is GitHub primarily used for?",
    options: [
      "Hosting and collaborating on Git repositories",
      "Running SQL databases",
      "Creating Python virtual environments",
      "Designing websites",
    ],
    answer: "Hosting and collaborating on Git repositories",
    difficulty: "Easy",
  },
];

// Round 1 uses exactly 25 questions.
const QUESTIONS = ALL_QUESTIONS.slice(0, 25);

// ============================================================
// COMPONENT
// ============================================================

function Assessment({ currentUser }) {
  const [student, setStudent] = useState(null);

  const activeStudentName = useMemo(() => {
    if (currentUser?.name) return currentUser.name;
    if (student?.name) return student.name;
    try {
      const session = JSON.parse(localStorage.getItem("skillbridge_auth_session") || "{}");
      if (session?.user?.name) return session.user.name;
      const profile = JSON.parse(localStorage.getItem("skillbridge_student_profile") || "{}");
      if (profile?.name) return profile.name;
    } catch {}
    return "Student";
  }, [currentUser, student]);

  const [assessmentStarted, setAssessmentStarted] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(TOTAL_TIME);

  // ==========================================================
  // ROUND 2 - CODING QUESTION
  // ==========================================================

  const [round2Started, setRound2Started] =
    useState(false);

  // Shared execution lock for the currently selected Round 2 question.
  // This prevents language/question changes while code is compiling or running.
  const [round2Running, setRound2Running] = useState(false);

  // Round 2 supports four compiled languages. Each language keeps its
  // own editor contents so switching languages never destroys the user's work.
  const ROUND_TWO_LANGUAGES = [
    { id: "java", label: "Java", judge0Id: 62, version: "OpenJDK" },
    { id: "python", label: "Python", judge0Id: 71, version: "Python 3" },
    { id: "c", label: "C", judge0Id: 50, version: "GCC" },
    { id: "cpp", label: "C++", judge0Id: 54, version: "G++" },
  ];

  const ROUND_TWO_TEMPLATES = {
    1: {
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        System.out.println(lengthOfLongestSubstring(s));
    }
}`,

      python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    return 0

s = input() if True else ""
print(lengthOfLongestSubstring(s))`,

      c: `#include <stdio.h>
#include <string.h>

int lengthOfLongestSubstring(const char *s) {
    // Write your solution here
    return 0;
}

int main(void) {
    char s[10005];
    if (fgets(s, sizeof(s), stdin) == NULL) s[0] = '\\0';
    s[strcspn(s, "\\r\\n")] = '\\0';
    printf("%d\\n", lengthOfLongestSubstring(s));
    return 0;
}`,

      cpp: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(const string& s) {
    // Write your solution here
    return 0;
}

int main() {
    string s;
    getline(cin, s);
    cout << lengthOfLongestSubstring(s) << "\\n";
    return 0;
}`,
    },

    2: {
      java: `import java.io.*;
import java.util.*;

public class Main {
    // Production inventory processor.
    public static Map<String, Integer> processInventory(List<String[]> events) {
        Map<String, Integer> inventory = new HashMap<>();
        Set<String> processedEvents = new HashSet<>();

        for (String[] event : events) {
            String eventId = event[0];
            String eventType = event[1];
            String sku = event[2];
            int quantity = Integer.parseInt(event[3]);

            if (processedEvents.contains(eventId)) continue;
            processedEvents.add(eventId);
            inventory.putIfAbsent(sku, 0);

            if (eventType.equals("RESERVE")) {
                inventory.put(sku, inventory.get(sku) - quantity);
            } else if (eventType.equals("RELEASE")) {
                // Apply the event to the current inventory.
                inventory.put(sku, inventory.get(sku) - quantity);
            }
        }

        return inventory;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        List<String[]> events = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            events.add(br.readLine().trim().split("\\\\s+"));
        }

        Map<String, Integer> inventory = processInventory(events);
        List<String> skus = new ArrayList<>(inventory.keySet());
        Collections.sort(skus);

        for (String sku : skus) {
            System.out.println(sku + " " + inventory.get(sku));
        }
    }
}`,

      python: `def process_inventory(events):
    inventory = {}
    processed_events = set()

    for event_id, event_type, sku, quantity in events:
        # Ignore duplicate deliveries.
        if event_id in processed_events:
            continue
        processed_events.add(event_id)

        if sku not in inventory:
            inventory[sku] = 0

        if event_type == "RESERVE":
            inventory[sku] -= quantity
        elif event_type == "RELEASE":
            # Apply the release event to the current inventory.
            inventory[sku] -= quantity

    return inventory

n = int(input().strip())
events = [input().split() for _ in range(n)]

inventory = process_inventory(events)
for sku in sorted(inventory):
    print(sku, inventory[sku])`,

      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SKUS 100000
#define MAX_LEN 64

typedef struct {
    char id[MAX_LEN];
    char type[MAX_LEN];
    char sku[MAX_LEN];
    int quantity;
} Event;

// Production inventory processor.
// Apply each event to the current inventory.
void processInventory(Event events[], int n) {
    char processed[MAX_SKUS][MAX_LEN];
    int processedCount = 0;

    char skuNames[MAX_SKUS][MAX_LEN];
    int inventory[MAX_SKUS];
    int skuCount = 0;

    for (int i = 0; i < n; i++) {
        int duplicate = 0;
        for (int j = 0; j < processedCount; j++) {
            if (strcmp(processed[j], events[i].id) == 0) {
                duplicate = 1;
                break;
            }
        }
        if (duplicate) continue;

        strcpy(processed[processedCount++], events[i].id);

        int index = -1;
        for (int j = 0; j < skuCount; j++) {
            if (strcmp(skuNames[j], events[i].sku) == 0) {
                index = j;
                break;
            }
        }

        if (index == -1) {
            index = skuCount++;
            strcpy(skuNames[index], events[i].sku);
            inventory[index] = 0;
        }

        if (strcmp(events[i].type, "RESERVE") == 0) {
            inventory[index] -= events[i].quantity;
        } else if (strcmp(events[i].type, "RELEASE") == 0) {
            // Apply the event to the current inventory.
            inventory[index] -= events[i].quantity;
        }
    }

    // Sort SKUs lexicographically for output.
    for (int i = 0; i < skuCount; i++) {
        for (int j = i + 1; j < skuCount; j++) {
            if (strcmp(skuNames[i], skuNames[j]) > 0) {
                char tempName[MAX_LEN];
                strcpy(tempName, skuNames[i]);
                strcpy(skuNames[i], skuNames[j]);
                strcpy(skuNames[j], tempName);

                int tempValue = inventory[i];
                inventory[i] = inventory[j];
                inventory[j] = tempValue;
            }
        }
    }

    for (int i = 0; i < skuCount; i++) {
        printf("%s %d\\n", skuNames[i], inventory[i]);
    }
}

int main(void) {
    int n;
    scanf("%d", &n);

    Event *events = malloc(sizeof(Event) * n);
    for (int i = 0; i < n; i++) {
        scanf("%63s %63s %63s %d", events[i].id, events[i].type, events[i].sku, &events[i].quantity);
    }

    processInventory(events, n);
    free(events);
    return 0;
}`,

      cpp: `#include <bits/stdc++.h>
using namespace std;

// Production inventory processor.
// Apply each event to the current inventory.
map<string, int> processInventory(const vector<array<string, 4>>& events) {
    map<string, int> inventory;
    set<string> processedEvents;

    for (const auto& event : events) {
        const string& eventId = event[0];
        const string& eventType = event[1];
        const string& sku = event[2];
        int quantity = stoi(event[3]);

        if (processedEvents.count(eventId)) continue;
        processedEvents.insert(eventId);

        if (!inventory.count(sku)) inventory[sku] = 0;

        if (eventType == "RESERVE") {
            inventory[sku] -= quantity;
        } else if (eventType == "RELEASE") {
            // Apply the release event to the current inventory.
            inventory[sku] -= quantity;
        }
    }

    return inventory;
}

int main() {
    int n;
    cin >> n;

    vector<array<string, 4>> events(n);
    for (auto& event : events) {
        cin >> event[0] >> event[1] >> event[2] >> event[3];
    }

    auto inventory = processInventory(events);
    for (const auto& [sku, quantity] : inventory) {
        cout << sku << " " << quantity << "\\n";
    }

    return 0;
}`,
    },
  };

  const [round2Question, setRound2Question] = useState(1);

  const createInitialRound2QuestionStates = () => ({
    1: {
      language: "java",
      codeByLanguage: { ...ROUND_TWO_TEMPLATES[1] },
      testResults: [],
      submitted: false,
    },
    2: {
      language: "java",
      codeByLanguage: { ...ROUND_TWO_TEMPLATES[2] },
      testResults: [],
      submitted: false,
    },
  });

  const [round2QuestionStates, setRound2QuestionStates] = useState(
    createInitialRound2QuestionStates
  );

  const activeRound2State = round2QuestionStates[round2Question];
  const round2Language = activeRound2State.language;
  const round2CodeByLanguage = activeRound2State.codeByLanguage;
  const round2Code = round2CodeByLanguage[round2Language];
  const round2TestResults = activeRound2State.testResults;
  const round2Submitted = activeRound2State.submitted;

  const setRound2Language = (languageId) => {
    setRound2QuestionStates((previous) => ({
      ...previous,
      [round2Question]: {
        ...previous[round2Question],
        language: languageId,
        testResults: [],
      },
    }));
  };

  const setRound2CodeByLanguage = (updater) => {
    setRound2QuestionStates((previous) => {
      const currentCodes = previous[round2Question].codeByLanguage;
      const nextCodes =
        typeof updater === "function" ? updater(currentCodes) : updater;

      return {
        ...previous,
        [round2Question]: {
          ...previous[round2Question],
          codeByLanguage: nextCodes,
        },
      };
    });
  };

  const setRound2TestResults = (results) => {
    setRound2QuestionStates((previous) => ({
      ...previous,
      [round2Question]: {
        ...previous[round2Question],
        testResults: results,
      },
    }));
  };

  const setRound2Submitted = (value) => {
    setRound2QuestionStates((previous) => ({
      ...previous,
      [round2Question]: {
        ...previous[round2Question],
        submitted:
          typeof value === "function"
            ? value(previous[round2Question].submitted)
            : value,
      },
    }));
  };

  // Round 2 is an independent 60-minute coding assessment.
  const ROUND_TWO_TOTAL_TIME = 60 * 60;
  const [round2TimeLeft, setRound2TimeLeft] =
    useState(ROUND_TWO_TOTAL_TIME);

  // Prevent timer from submitting more than once.
  const submitTriggeredRef = useRef(false);

  // Always keep the latest submit function available
  // to the timer.
  const submitAssessmentRef = useRef(null);

  // ==========================================================
  // FETCH STUDENT
  // ==========================================================

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/students/`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load student"
          );
        }

        const data =
          await response.json();

        if (
          data.status === "success" &&
          data.data?.length
        ) {
          const currentStudent =
            data.data.find(
              (item) =>
                item.id === STUDENT_ID
            ) || data.data[0];

          setStudent(currentStudent);
        }
      } catch (err) {
        console.error(
          "Student loading error:",
          err
        );
      }
    };

    fetchStudent();
  }, []);

  // ==========================================================
  // HANDLE ANSWER
  // ==========================================================

  const selectAnswer = (answer) => {
    if (
      !assessmentStarted ||
      submitted ||
      saving
    ) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [QUESTIONS[currentQuestion].id]:
        answer,
    }));
  };

  // ==========================================================
  // NEXT QUESTION
  // ==========================================================

  const nextQuestion = () => {
    if (
      currentQuestion <
      QUESTIONS.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  // ==========================================================
  // PREVIOUS QUESTION
  // ==========================================================

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  // ==========================================================
  // CALCULATE RESULTS
  // ==========================================================

  const results = useMemo(() => {
    const skillResults = {};

    QUESTIONS.forEach((question) => {
      if (!skillResults[question.skill]) {
        skillResults[question.skill] = {
          skill: question.skill,
          correct: 0,
          wrong: 0,
          unanswered: 0,
          total: 0,
          score: 0,
          percentage: 0,
          marksLost: 0,
        };
      }

      const item =
        skillResults[question.skill];

      item.total += 1;

      const selectedAnswer =
        answers[question.id];

      if (!selectedAnswer) {
        item.unanswered += 1;
      } else if (
        selectedAnswer ===
        question.answer
      ) {
        item.correct += 1;
      } else {
        item.wrong += 1;
      }
    });

    Object.values(skillResults).forEach(
      (item) => {
        const rawScore =
          (item.correct * MARKS_PER_CORRECT) -
          (item.wrong * MARKS_PER_WRONG);

        item.marksLost =
          item.wrong * MARKS_PER_WRONG;

        item.score = Math.max(
          0,
          Math.round(
            rawScore * 100
          ) / 100
        );

        item.percentage = Math.max(
          0,
          Math.round(
            (item.score / item.total) *
              10000
          ) / 100
        );
      }
    );

    const correctAnswers =
      QUESTIONS.filter(
        (question) =>
          answers[question.id] ===
          question.answer
      ).length;

    const answeredQuestions =
      Object.keys(answers).length;

    const wrongAnswers =
      answeredQuestions -
      correctAnswers;

    const unansweredQuestions =
      QUESTIONS.length -
      answeredQuestions;

    const rawScore =
      (correctAnswers * MARKS_PER_CORRECT) -
      (wrongAnswers * MARKS_PER_WRONG);

    const negativeMarks =
      wrongAnswers * MARKS_PER_WRONG;

    const finalScore = Math.max(
      0,
      Math.round(
        rawScore * 100
      ) / 100
    );

    const percentage = Math.max(
      0,
      Math.round(
        (finalScore /
          QUESTIONS.length) *
          10000
      ) / 100
    );

    // Round 2 unlocks only after Round 1 is completed
    // and the final score reaches the 60% cutoff.
    const passed =
      percentage >= CUTOFF_PERCENTAGE;

    return {
      correctAnswers,
      wrongAnswers,
      unansweredQuestions,
      answeredQuestions,
      finalScore,
      negativeMarks,
      percentage,
      passed,
      totalQuestions:
        QUESTIONS.length,
      skills:
        Object.values(skillResults),
    };
  }, [answers]);

  // ==========================================================
  // SUBMIT ASSESSMENT
  // ==========================================================

  const submitAssessment = async () => {
    if (
      submitted ||
      saving
    ) {
      return;
    }

    /*
     * IMPORTANT:
     * Show the calculated result immediately.
     * Backend saving happens after the result is
     * calculated so the candidate never gets stuck
     * on the assessment screen.
     */

    setSubmitted(true);
    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      // ------------------------------------------------------
      // LOAD ALL DATABASE SKILLS ONCE
      // ------------------------------------------------------

      const skillResponse =
        await fetch(
          `${API_BASE_URL}/api/skills/`
        );

      let databaseSkills = [];

      if (skillResponse.ok) {
        const skillData =
          await skillResponse.json();

        databaseSkills =
          skillData.data || [];
      }

      // ------------------------------------------------------
      // SAVE EACH SKILL RESULT
      // ------------------------------------------------------

      for (
        const item of results.skills
      ) {
        const skill =
          databaseSkills.find(
            (databaseSkill) =>
              databaseSkill.name
                ?.toLowerCase() ===
              item.skill.toLowerCase()
          );

        if (!skill) {
          console.warn(
            `Skill ${item.skill} not found in database`
          );

          continue;
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/assessments/`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                student_id:
                  STUDENT_ID,

                skill_id:
                  skill.id,

                score: Math.round(
                  item.percentage
                ),

                total_score: 100,
              }),
            }
          );

        if (!response.ok) {
          console.warn(
            `Failed to save ${item.skill} assessment`
          );
        }
      }

      setSaveMessage(
        "Assessment completed successfully. Your eligibility result has been calculated."
      );
    } catch (err) {
      console.error(
        "Assessment save error:",
        err
      );

      /*
       * The candidate still sees the result
       * even if backend saving fails.
       */

      setError(
        "Your result was calculated successfully. Server synchronization could not be completed."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // ROUND 2 CODING LOGIC
  // ==========================================================

  const ROUND_TWO_TEST_CASES_BY_QUESTION = {
    1: [
      { input: "abcabcbb", expected: 3 },
      { input: "bbbbb", expected: 1 },
      { input: "pwwkew", expected: 3 },
      { input: "", expected: 0 },
      { input: "dvdf", expected: 3 },
      { input: "abba", expected: 2 },
    ],
    2: [
      {
        input: "6\nE1 RESERVE LAPTOP 5\nE2 RESERVE PHONE 3\nE1 RESERVE LAPTOP 5\nE3 RELEASE LAPTOP 2\nE4 RELEASE PHONE 1\nE5 RESERVE PHONE 2",
        expected: "LAPTOP -3\nPHONE -4",
      },
      {
        input: "7\nA1 RESERVE MOUSE 10\nA2 RELEASE MOUSE 3\nA3 RESERVE KEYBOARD 5\nA2 RELEASE MOUSE 3\nA4 RESERVE MOUSE 2\nA5 RELEASE KEYBOARD 1\nA1 RESERVE MOUSE 10",
        expected: "KEYBOARD -4\nMOUSE -9",
      },
      {
        input: "5\nX1 RESERVE MONITOR 4\nX2 RELEASE MONITOR 1\nX3 RELEASE MONITOR 2\nX4 RESERVE MONITOR 3\nX3 RELEASE MONITOR 2",
        expected: "MONITOR -4",
      },
      {
        input: "4\nR1 RELEASE CAMERA 8\nR2 RESERVE CAMERA 3\nR1 RELEASE CAMERA 8\nR3 RESERVE CAMERA 2",
        expected: "CAMERA 3",
      },
      {
        input: "8\nP1 RESERVE TABLET 12\nP2 RELEASE TABLET 4\nP3 RESERVE PHONE 7\nP4 RELEASE PHONE 2\nP2 RELEASE TABLET 4\nP5 RELEASE TABLET 1\nP6 RESERVE PHONE 3\nP3 RESERVE PHONE 7",
        expected: "PHONE -8\nTABLET -7",
      },
      {
        input: "3\nZ1 RELEASE WATCH 5\nZ2 RELEASE LAPTOP 2\nZ3 RESERVE WATCH 1",
        expected: "LAPTOP 2\nWATCH 4",
      },
    ],
  };

  const ROUND_TWO_TEST_CASES =
    ROUND_TWO_TEST_CASES_BY_QUESTION[round2Question];

  const ROUND_TWO_QUESTION_DETAILS = {
    1: {
      type: "LeetCode Medium",
      title: "Longest Substring Without Repeating Characters",
      summary:
        'Given a string s, return the length of the longest substring that contains no repeated characters.',
      scenario:
        "This is a standard algorithmic screening problem. Aim for an O(n) sliding-window solution rather than repeatedly checking every substring.",
      examples: [
        { input: '"abcabcbb"', output: "3" },
        { input: '"bbbbb"', output: "1" },
        { input: '"pwwkew"', output: "3" },
      ],
      inputFormat:
        "A single line containing the string s.",
      outputFormat:
        "Print one integer: the length of the longest substring without repeating characters.",
      constraints: [
        "0 <= length(s) <= 100000",
        "The string may contain letters, digits, symbols, and spaces.",
      ],
      requirements: [
        "Return only the maximum length.",
        "Function name must be lengthOfLongestSubstring.",
        "Your program must compile and produce the expected output.",
      ],
    },
    2: {
      type: "Scenario + Debugging",
      title: "Production Incident: Inventory Reservation Bug",
      summary:
        "You are a backend engineer for an e-commerce platform. During a flash sale, an inventory service processes RESERVE and RELEASE events. A production incident shows that available-stock numbers are incorrect because the current event processor contains a logic bug.",
      scenario:
        "Each event has a unique event_id, but network retries can deliver the same event more than once. A RESERVE event decreases available inventory, while a RELEASE event increases it. Duplicate event_ids must be processed only once, events must be handled in arrival order, and the final SKUs must be printed in lexicographical order. Debug the provided starter code and fix the production logic without changing the input/output format.",
      examples: [
        { input: "6 events → E1 RESERVE LAPTOP 5; E2 RESERVE PHONE 3; E1 duplicate; E3 RELEASE LAPTOP 2; E4 RELEASE PHONE 1; E5 RESERVE PHONE 2", output: "LAPTOP -3\nPHONE -4" },
        { input: "7 events → A1 RESERVE MOUSE 10; A2 RELEASE MOUSE 3; A3 RESERVE KEYBOARD 5; A2 duplicate; A4 RESERVE MOUSE 2; A5 RELEASE KEYBOARD 1; A1 duplicate", output: "KEYBOARD -4\nMOUSE -9" },
        { input: "5 events → X1 RESERVE MONITOR 4; X2 RELEASE MONITOR 1; X3 RELEASE MONITOR 2; X4 RESERVE MONITOR 3; X3 duplicate", output: "MONITOR -4" },
      ],
      inputFormat:
        "First line: N. Next N lines: event_id event_type sku quantity. event_type is RESERVE or RELEASE.",
      outputFormat:
        "Print one line per SKU as SKU FINAL_INVENTORY. SKUs must be printed in lexicographical order.",
      constraints: [
        "1 <= N <= 100000",
        "1 <= quantity <= 10000",
        "1 <= length(event_id), length(sku) <= 30",
        "The same event_id may appear multiple times and duplicates may occur anywhere.",
      ],
      requirements: [
        "Process every unique event_id exactly once.",
        "RESERVE decreases available inventory by quantity.",
        "RELEASE increases available inventory by quantity.",
        "Do not sort or reorder events while processing them.",
        "Keep inventory independently for every SKU.",
        "Print every encountered SKU in lexicographical order.",
        "Do not change the input/output format.",
        "Debug the provided starter code and make it work for visible and hidden test cases.",
      ],
    },
  };

  const activeRound2Question = ROUND_TWO_QUESTION_DETAILS[round2Question];

  const round2Completed =
    round2QuestionStates[1].submitted && round2QuestionStates[2].submitted;

  const selectRound2Question = (questionNumber) => {
    if (round2Running) return;
    setRound2Question(questionNumber);
  };

  // Round 2 exam integrity: block copy, cut, paste, context-menu paste,
  // keyboard paste/copy shortcuts, and dragged-in text while coding.
  const showRound2Violation = (action) => {
    window.alert(
      `You are trying to violate the rules by ${action}.\n\nCopying and pasting are not allowed during Round 2.`
    );
  };

  const blockRound2ClipboardAction = (event, action) => {
    event.preventDefault();
    event.stopPropagation();
    showRound2Violation(action);
  };

  const handleRound2EditorKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;

    if (
      (modifier && (key === "c" || key === "v" || key === "x")) ||
      (event.shiftKey && key === "insert")
    ) {
      event.preventDefault();
      event.stopPropagation();

      const action =
        key === "c"
          ? "copying"
          : key === "x"
            ? "cutting"
            : "pasting";

      showRound2Violation(action);
    }
  };

  const handleRound2EditorDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    showRound2Violation("pasting content by drag and drop");
  };

  const updateRound2Code = (code) => {
    setRound2CodeByLanguage((previous) => ({
      ...previous,
      [round2Language]: code,
    }));
    setRound2TestResults([]);
    setRound2Submitted(false);
  };

  const selectRound2Language = (languageId) => {
    if (round2Running || round2Submitted) return;
    setRound2Language(languageId);
    setRound2TestResults([]);
  };

  const buildJudgeSource = (languageId, code) => {
    if (languageId === "java" || languageId === "python" || languageId === "c" || languageId === "cpp") {
      return code;
    }
    return code;
  };

  // Judge0 compiles and executes Java, Python, C and C++ in isolated
  // sandboxes. Run Code and Submit Code both use the same real compiler.
  const runSingleJudgeCase = async (testCase) => {
    const language = ROUND_TWO_LANGUAGES.find(
      (item) => item.id === round2Language
    );

    if (!language) {
      throw new Error("Unsupported programming language.");
    }

    // Create a real Judge0 compilation/execution job. We intentionally do
    // not use wait=true because the official hosted service may disable it.
    const createResponse = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: language.judge0Id,
          source_code: buildJudgeSource(round2Language, round2Code),
          stdin: `${testCase.input}\n`,
          expected_output: `${testCase.expected}\n`,
          cpu_time_limit: 3,
          wall_time_limit: 5,
          memory_limit: 128000,
        }),
      }
    );

    if (!createResponse.ok) {
      const message = await createResponse.text();
      throw new Error(
        `Code execution service returned HTTP ${createResponse.status}. ${message}`
      );
    }

    const created = await createResponse.json();
    const token = created.token;

    if (!token) {
      throw new Error("The code execution service did not return a submission token.");
    }

    let data = null;

    // Poll until the compiler/executor finishes. Status 1 = queued, 2 = processing.
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const resultResponse = await fetch(
        `https://ce.judge0.com/submissions/${token}?base64_encoded=false`,
        { method: "GET" }
      );

      if (!resultResponse.ok) {
        throw new Error(
          `Unable to read compilation result (HTTP ${resultResponse.status}).`
        );
      }

      data = await resultResponse.json();

      if (data.status?.id !== 1 && data.status?.id !== 2) {
        break;
      }
    }

    if (!data || data.status?.id === 1 || data.status?.id === 2) {
      throw new Error("Compilation/execution timed out while waiting for the judge.");
    }

    const stdout = (data.stdout || "").trim();
    const compileOutput = (data.compile_output || "").trim();
    const stderr = (data.stderr || "").trim();
    const statusId = data.status?.id;
    const passed = statusId === 3;

    let actual = stdout === "" ? "No output" : stdout;
    if (/^-?\d+(\.\d+)?$/.test(stdout)) {
      actual = Number(stdout);
    }

    let error = "";
    if (!passed) {
      error = compileOutput || stderr || data.message || "Execution failed.";
    }

    return {
      actual,
      passed,
      error,
      status: data.status?.description || "Unknown",
      time: data.time || null,
      memory: data.memory || null,
    };
  };

  const runRound2Code = async () => {
    if (round2Running || round2Submitted) return false;

    setRound2Running(true);
    setRound2TestResults([]);

    const results = [];

    try {
      for (let index = 0; index < ROUND_TWO_TEST_CASES.length; index += 1) {
        const testCase = ROUND_TWO_TEST_CASES[index];

        try {
          const execution = await runSingleJudgeCase(testCase);
          results.push({
            index: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: execution.actual,
            passed: execution.passed,
            error: execution.error,
            status: execution.status,
            time: execution.time,
            memory: execution.memory,
          });
        } catch (testError) {
          results.push({
            index: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: "Execution Error",
            passed: false,
            error: testError.message,
          });
        }

        // Stop after the first failure, just like a coding judge.
        if (!results[results.length - 1].passed) break;
      }
    } finally {
      setRound2TestResults(results);
      setRound2Running(false);
    }

    return (
      results.length === ROUND_TWO_TEST_CASES.length &&
      results.every((item) => item.passed)
    );
  };

  const submitRound2Code = async () => {
    if (round2Running || round2Submitted) return;

    const passed = await runRound2Code();

    if (passed) {
      setRound2Submitted(true);
    }
  };

  // Always expose latest submit function to timer.
  submitAssessmentRef.current =
    submitAssessment;

  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    if (
      !assessmentStarted ||
      submitted
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) => {
            if (previous <= 1) {
              clearInterval(timer);

              if (
                !submitTriggeredRef.current
              ) {
                submitTriggeredRef.current =
                  true;

                setTimeout(() => {
                  if (
                    submitAssessmentRef.current
                  ) {
                    submitAssessmentRef.current();
                  }
                }, 0);
              }

              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    assessmentStarted,
    submitted,
  ]);

  // ==========================================================
  // ROUND 2 TIMER
  // ==========================================================

  useEffect(() => {
    // The Round 2 timer belongs to the whole round, not to one question.
    // Submitting Q1 must never pause/lock Q2, and vice versa.
    if (!round2Started || round2Completed || round2TimeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRound2TimeLeft((previous) =>
        previous <= 1 ? 0 : previous - 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [round2Started, round2Completed, round2TimeLeft]);

  // ==========================================================
  // FORMAT TIMER
  // ==========================================================

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  const formattedTime =
    `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;

  const round2Minutes = Math.floor(round2TimeLeft / 60);
  const round2Seconds = round2TimeLeft % 60;
  const round2FormattedTime =
    `${String(round2Minutes).padStart(2, "0")}:${String(round2Seconds).padStart(2, "0")}`;

  // ==========================================================
  // START ASSESSMENT
  // ==========================================================

  const startAssessment = () => {
    setAssessmentStarted(true);

    setTimeLeft(TOTAL_TIME);

    setCurrentQuestion(0);

    setAnswers({});

    setSubmitted(false);

    setSaving(false);

    setSaveMessage("");

    setError("");

    // A new Round 1 attempt must lock Round 2 again
    // until this attempt is completed and the cutoff is cleared.
    setRound2Started(false);
    setRound2TimeLeft(ROUND_TWO_TOTAL_TIME);

    // Round 2 question/code state is preserved.

    submitTriggeredRef.current =
      false;
  };

  const startRound2 = () => {
    if (!submitted || !results.passed || round2Submitted) return;
    setRound2Started(true);
    if (round2TimeLeft <= 0) {
      setRound2TimeLeft(ROUND_TWO_TOTAL_TIME);
    }
  };

  // ==========================================================
  // RESET / RETAKE
  // ==========================================================

  const resetAssessment = () => {
    setAssessmentStarted(false);

    setAnswers({});

    setCurrentQuestion(0);

    setSubmitted(false);

    setSaving(false);

    setSaveMessage("");

    setError("");

    setTimeLeft(TOTAL_TIME);

    setRound2Started(false);
    setRound2Question(1);
    setRound2QuestionStates(createInitialRound2QuestionStates());
    setRound2Running(false);
    setRound2TimeLeft(ROUND_TWO_TOTAL_TIME);

    submitTriggeredRef.current =
      false;
  };

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const answeredCount =
    Object.keys(answers).length;

  const progress =
    (answeredCount /
      QUESTIONS.length) *
    100;

  const question =
    QUESTIONS[currentQuestion];

  // ==========================================================
  // ROADMAP
  // ==========================================================

  const getRoadmap = () => {
    return results.skills
      .filter(
        (item) =>
          item.percentage < 70
      )
      .sort(
        (a, b) =>
          a.percentage -
          b.percentage
      )
      .map((item) => {
        const roadmapMap = {
          Python:
            "Strengthen Python fundamentals, functions, data structures, exception handling and problem solving.",

          SQL:
            "Practice SQL queries, filtering, joins, aggregation, subqueries and database design.",

          React:
            "Practice React state, props, hooks, JSX, component design and API integration.",

          FastAPI:
            "Build REST APIs using FastAPI, Pydantic, HTTP methods, validation and backend integration.",

          Git:
            "Practice Git branching, commits, pull/push workflow, merge conflicts and GitHub collaboration.",
        };

        return {
          skill: item.skill,
          percentage:
            item.percentage,
          recommendation:
            roadmapMap[
              item.skill
            ],
        };
      });
  };

  // ==========================================================
  // DUAL ROUND WORKSPACE
  // Round 1 stays on the left and Round 2 stays on the right.
  // Both rounds are independent so the student can start either one.
  // ==========================================================

  if (!submitted) {
    const round2PassedTests = round2TestResults.filter(
      (item) => item.passed
    ).length;

    const allTestsPassed =
      round2TestResults.length > 0 &&
      round2PassedTests === ROUND_TWO_TEST_CASES.length;

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              AI-powered evaluation • {APPLIED_ROLE.company}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Skill Assessment — Round 1 & Round 2
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
              Both rounds are available on the same screen. You can start either round independently. Round 2 can be tested directly without completing Round 1 in this demo.
            </p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-slate-300">
            <span className="text-slate-500">Role:</span>{" "}
            <span className="font-semibold text-white">{APPLIED_ROLE.role}</span>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          {/* ==================================================
              ROUND 1 — LEFT
          ================================================== */}
          <section className="min-w-0 rounded-2xl border border-violet-500/20 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
                  <Brain size={22} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Round 1
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    Skill Assessment
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-sm font-semibold text-cyan-300">
                <Clock3 size={16} />
                {assessmentStarted && !submitted ? formattedTime : "15:00"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Questions</p>
                <p className="mt-1 text-xl font-bold text-white">25</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Time</p>
                <p className="mt-1 text-xl font-bold text-white">15 Min</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Negative</p>
                <p className="mt-1 text-xl font-bold text-red-400">-0.25</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Cutoff</p>
                <p className="mt-1 text-xl font-bold text-amber-400">60%</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
              <p><span className="font-semibold text-white">Marking:</span> Correct +1, wrong -0.25, unanswered 0.</p>
              <p className="mt-1"><span className="font-semibold text-white">Eligibility:</span> score at least 60% (15/25) to unlock Round 2.</p>
            </div>

            {!assessmentStarted || submitted ? (
              <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
                {submitted ? (
                  <>
                    <p className="text-sm font-medium text-emerald-400">Round 1 completed</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {results.finalScore}/{QUESTIONS.length} marks
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Score: {results.percentage}% • Round 2 remains available.
                    </p>
                    <button
                      type="button"
                      onClick={startAssessment}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
                    >
                      <RotateCcw size={16} />
                      Restart Round 1
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-white">Ready to begin?</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Start Round 1 when you are ready. The 15-minute timer begins immediately.
                    </p>
                    <button
                      type="button"
                      onClick={startAssessment}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                    >
                      <Brain size={17} />
                      Start Round 1
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Question {currentQuestion + 1} of {QUESTIONS.length}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {answeredCount}/{QUESTIONS.length} answered
                    </p>
                  </div>
                  <div className="w-28">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-950/25 to-slate-950/50 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
                    <Target size={15} />
                    {question.skill} • {question.difficulty}
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-7 text-white">
                    {question.question}
                  </h3>

                  <div className="mt-4 grid gap-2">
                    {question.options.map((option, index) => {
                      const selected = answers[question.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectAnswer(option)}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                            selected
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-slate-800 bg-slate-950/40 hover:border-violet-500/30"
                          }`}
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            selected ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className={`text-sm ${selected ? "font-semibold text-white" : "text-slate-300"}`}>
                            {option}
                          </span>
                          {selected && <CheckCircle2 size={17} className="ml-auto text-violet-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    className="flex-1 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>
                  {currentQuestion < QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextQuestion}
                      disabled={!answers[question.id]}
                      className="flex-1 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Question <ArrowRight size={15} className="ml-1 inline" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitAssessment}
                      disabled={saving || submitted}
                      className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? "Calculating..." : "Complete Round 1"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ==================================================
              ROUND 2 — RIGHT
          ================================================== */}
          <section className="min-w-0 rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                  <Code2 size={22} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Round 2
                  </p>
                  <h2 className="text-2xl font-bold text-white">Technical Coding</h2>
                </div>
              </div>
              <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${
                round2TimeLeft <= 300
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-cyan-500/20 bg-cyan-500/5 text-cyan-300"
              }`}>
                <Clock3 size={16} />
                {round2Started ? round2FormattedTime : "60:00"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Questions</p>
                <p className="mt-1 text-xl font-bold text-white">2</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Time</p>
                <p className="mt-1 text-xl font-bold text-white">60 Min</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Questions</p>
                <p className="mt-1 text-sm font-bold text-emerald-400">1 Algorithmic • 1 Debugging</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-500">Languages</p>
                <p className="mt-1 text-sm font-bold text-violet-300">Java • Python • C • C++</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
              <p>You can solve either question first. Question order is completely up to the candidate.</p>
            </div>

            {!round2Started ? (
              <div className={`mt-5 rounded-xl border p-5 ${
                results.passed
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-slate-800 bg-slate-950/30"
              }`}>
                <p className="text-sm font-semibold text-white">
                  {results.passed ? "Round 2 Unlocked" : "Round 2 Locked"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {results.passed
                    ? "You cleared the 60% Round 1 cutoff. Start Round 2 to open both coding questions."
                    : submitted
                      ? `You scored ${results.percentage}%. You need at least 60% to unlock Round 2.`
                      : "Complete Round 1 first and score at least 60% to unlock Round 2."}
                </p>
                <button
                  type="button"
                  onClick={startRound2}
                  disabled={!submitted || !results.passed}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <Code2 size={17} />
                  {results.passed ? "Start Round 2" : "🔒 Locked — Complete Round 1"}
                </button>
              </div>
            ) : (
              <div className="mt-5">
                {/* QUESTION SELECTOR */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Choose a question
                    </p>
                    <p className="text-xs text-slate-500">Solve in any order</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map((questionNumber) => {
                      const questionState = round2QuestionStates[questionNumber];
                      const isActive = round2Question === questionNumber;
                      return (
                        <button
                          key={questionNumber}
                          type="button"
                          onClick={() => selectRound2Question(questionNumber)}
                          disabled={round2Running}
                          className={`rounded-xl border p-3 text-left transition ${
                            isActive
                              ? "border-emerald-500/50 bg-emerald-500/10"
                              : "border-slate-700 bg-slate-900 hover:border-slate-600"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm font-bold ${isActive ? "text-emerald-300" : "text-slate-300"}`}>
                              Question {questionNumber}
                            </span>
                            {questionState.submitted ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                <CheckCircle2 size={14} /> Submitted
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">Open</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {ROUND_TWO_QUESTION_DETAILS[questionNumber].type}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVE QUESTION */}
                <div className="mt-4 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-950/25 to-slate-950/50 p-5">
                  <div className="flex items-start gap-2">
                    <Terminal size={17} className="mt-0.5 shrink-0 text-violet-300" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-violet-400">
                        Question {round2Question} • {activeRound2Question.type}
                      </p>
                      <h3 className="mt-1 text-lg font-bold leading-7 text-white">
                        {activeRound2Question.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {activeRound2Question.summary}
                  </p>

                  {round2Question === 2 && (
                    <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-amber-200/80">
                      <span className="font-semibold text-amber-300">Production scenario:</span>{" "}
                      {activeRound2Question.scenario}
                    </div>
                  )}

                  {round2Question === 1 && (
                    <p className="mt-4 text-xs leading-5 text-slate-400">
                      <span className="font-semibold text-slate-200">Approach hint:</span>{" "}
                      {activeRound2Question.scenario}
                    </p>
                  )}

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Input Format</p>
                      <p className="mt-2 text-xs leading-5 text-slate-300">{activeRound2Question.inputFormat}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Output Format</p>
                      <p className="mt-2 text-xs leading-5 text-slate-300">{activeRound2Question.outputFormat}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Constraints</p>
                    <div className="mt-2 space-y-1 text-xs leading-5 text-slate-400">
                      {activeRound2Question.constraints.map((constraint) => (
                        <p key={constraint}>• {constraint}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Sample Test Cases</p>
                    <div className="grid gap-2">
                      {activeRound2Question.examples.map((example, index) => (
                        <div key={index} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                          <p className="text-xs font-semibold text-slate-400">Sample {index + 1}</p>
                          <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-slate-950 p-2 text-xs leading-5 text-slate-400">{example.input}</pre>
                          <p className="mt-2 font-semibold text-emerald-400">Expected Output:</p>
                          <pre className="mt-1 whitespace-pre-wrap break-words rounded-md bg-slate-950 p-2 text-xs leading-5 text-emerald-300">{example.output}</pre>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Candidate Instructions</p>
                    <div className="mt-2 space-y-1.5 text-xs leading-5 text-slate-400">
                      {activeRound2Question.requirements.map((requirement) => (
                        <p key={requirement}>• {requirement}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LANGUAGE */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Choose Language</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {ROUND_TWO_LANGUAGES.map((language) => (
                      <button
                        key={language.id}
                        type="button"
                        onClick={() => selectRound2Language(language.id)}
                        disabled={round2Running || round2Submitted || round2TimeLeft === 0}
                        className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                          round2Language === language.id
                            ? "border-violet-500 bg-violet-600/20 text-violet-200"
                            : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-white"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {language.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EDITOR */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Code2 size={17} className="text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Your Solution</p>
                        <p className="text-xs text-slate-500">
                          {ROUND_TWO_LANGUAGES.find((item) => item.id === round2Language)?.label} • {ROUND_TWO_LANGUAGES.find((item) => item.id === round2Language)?.version}
                        </p>
                      </div>
                    </div>
                    <span className="hidden rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-500 sm:inline">
                      {round2Question === 2 ? "debug + implement" : "function required"}
                    </span>
                  </div>

                  <textarea
                    value={round2Code}
                    onChange={(event) => updateRound2Code(event.target.value)}
                    onCopy={(event) => blockRound2ClipboardAction(event, "copying")}
                    onCut={(event) => blockRound2ClipboardAction(event, "cutting")}
                    onPaste={(event) => blockRound2ClipboardAction(event, "pasting")}
                    onContextMenu={(event) => blockRound2ClipboardAction(event, "using the context menu") }
                    onKeyDown={handleRound2EditorKeyDown}
                    onDrop={handleRound2EditorDrop}
                    onDragOver={(event) => event.preventDefault()}
                    spellCheck={false}
                    disabled={round2Submitted || round2Running || round2TimeLeft === 0}
                    className="mt-3 min-h-[330px] w-full resize-y rounded-xl border border-slate-700 bg-[#050816] p-4 font-mono text-xs leading-5 text-slate-200 outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
                  />

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={runRound2Code}
                      disabled={round2Running || round2Submitted || round2TimeLeft === 0}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/20 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-600/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {round2Running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      {round2Running ? "Compiling..." : "Run Code"}
                    </button>
                    <button
                      type="button"
                      onClick={submitRound2Code}
                      disabled={round2Running || round2Submitted || !allTestsPassed || round2TimeLeft === 0}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send size={16} />
                      {round2Submitted ? "Submitted" : "Submit Code"}
                    </button>
                  </div>
                </div>

                {/* TEST RESULTS */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">Test Results</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {round2TestResults.length === 0 ? "Ready to run" : `${round2PassedTests}/${ROUND_TWO_TEST_CASES.length} passed`}
                      </p>
                    </div>
                    <Target size={19} className="text-cyan-400" />
                  </div>

                  {round2TestResults.length === 0 ? (
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Run Code compiles the selected Java, Python, C, or C++ program and executes it against the test suite for this question.
                    </p>
                  ) : (
                    <div className="mt-3 max-h-[300px] space-y-2 overflow-y-auto pr-1">
                      {round2TestResults.map((test) => (
                        <div key={test.index} className={`rounded-lg border p-3 ${test.passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">Test Case {test.index}</span>
                            {test.passed ? <CheckCircle2 size={15} className="text-emerald-400" /> : <XCircle size={15} className="text-red-400" />}
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div><p className="text-slate-500">Expected</p><p className="font-semibold text-slate-200">{String(test.expected)}</p></div>
                            <div><p className="text-slate-500">Actual</p><p className={`font-semibold ${test.passed ? "text-emerald-400" : "text-red-400"}`}>{String(test.actual)}</p></div>
                          </div>
                          {test.error && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-red-400">{test.error}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {allTestsPassed && !round2Submitted && (
                    <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-400">
                      ✓ All test cases passed. Submit Code is now enabled for Question {round2Question}.
                    </div>
                  )}

                  {round2Submitted && (
                    <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <p className="text-sm font-semibold text-emerald-400">Question {round2Question} submitted successfully.</p>
                      <p className="mt-1 text-xs text-slate-400">
                        You can still switch to the other Round 2 question and solve it.
                      </p>
                    </div>
                  )}
                </div>

                {/* ROUND 2 STATUS */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Round 2 Progress</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[1, 2].map((questionNumber) => (
                      <div key={questionNumber} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                        {round2QuestionStates[questionNumber].submitted ? (
                          <CheckCircle2 size={15} className="text-emerald-400" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                        )}
                        <span className="text-xs text-slate-300">Q{questionNumber}</span>
                        <span className="ml-auto text-xs text-slate-500">
                          {round2QuestionStates[questionNumber].submitted ? "Done" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {round2Completed && (
                    <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                      ✓ Both Round 2 questions have been submitted successfully.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs leading-5 text-slate-500">
          <span className="font-semibold text-slate-300">Testing note:</span> Round 2 is visible on the same screen but unlocks only after Round 1 is completed and the 60% cutoff is cleared.
        </div>
      </div>
    );
  }

  // ==========================================================
  // INSTRUCTIONS SCREEN
  // ==========================================================

  if (
    !assessmentStarted &&
    !submitted
  ) {
    return (
      <div className="space-y-8">

        {/* HEADER */}

        <div>
          <p className="text-sm font-medium text-violet-400">
            AI-powered evaluation
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">
            Skill Assessment
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Welcome{" "}
            {activeStudentName}
            . Please complete the
            assessment for your applied
            role.
          </p>
        </div>

        {/* ROLE CARD */}

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">

              <BriefcaseBusiness
                size={24}
                className="text-violet-300"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-violet-400">
                Applied Role
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {APPLIED_ROLE.role}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {APPLIED_ROLE.company}
              </p>

            </div>

          </div>

          <div className="mt-5 rounded-xl border border-violet-500/10 bg-slate-950/30 p-4">

            <p className="text-sm leading-6 text-slate-400">

              Complete Round 1 to become{" "}
              <span className="font-semibold text-emerald-400">
                eligible for Round 2
              </span>. Your Round 1 score does not affect Round 2 eligibility.

            </p>

          </div>

        </div>

        {/* INSTRUCTIONS CARD */}

        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/60 to-slate-900 p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/20">

              <Brain
                size={28}
                className="text-violet-300"
              />

            </div>

            <div>

              <p className="text-sm font-medium text-violet-400">
                Assessment Instructions
              </p>

              <h2 className="mt-1 text-3xl font-bold text-white">
                Before You Start
              </h2>

            </div>

          </div>

          {/* RULES */}

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* QUESTIONS */}

            <div className="rounded-xl border border-slate-800 bg-slate-950/25 p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">

                <Target
                  size={20}
                  className="text-blue-400"
                />

              </div>

              <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                Questions
              </p>

              <p className="mt-1 text-3xl font-bold text-white">
                25
              </p>

              <p className="mt-1 text-sm text-slate-500">
                5 questions per skill
              </p>

            </div>

            {/* TIME */}

            <div className="rounded-xl border border-slate-800 bg-slate-950/25 p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">

                <Clock3
                  size={20}
                  className="text-cyan-400"
                />

              </div>

              <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                Time Limit
              </p>

              <p className="mt-1 text-3xl font-bold text-white">
                15 Min
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Timer starts after Start
              </p>

            </div>

            {/* CORRECT */}

            <div className="rounded-xl border border-slate-800 bg-slate-950/25 p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">

                <CheckCircle2
                  size={20}
                  className="text-emerald-400"
                />

              </div>

              <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                Correct Answer
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-400">
                +1
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Marks per correct answer
              </p>

            </div>

            {/* WRONG */}

            <div className="rounded-xl border border-slate-800 bg-slate-950/25 p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">

                <XCircle
                  size={20}
                  className="text-red-400"
                />

              </div>

              <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                Wrong Answer
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-400">
                0
              </p>

              <p className="mt-1 text-sm text-slate-500">
                No marks deducted
              </p>

            </div>

          </div>

          {/* DETAILED RULES */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6">

              <div className="flex items-center gap-3">

                <Info
                  size={20}
                  className="text-violet-400"
                />

                <h3 className="font-semibold text-white">
                  Assessment Rules
                </h3>

              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-400">

                <p>
                  • Total of{" "}
                  <span className="font-semibold text-white">
                    25 questions
                  </span>{" "}
                  covering Python, SQL,
                  React, FastAPI and Git.
                </p>

                <p>
                  • You have{" "}
                  <span className="font-semibold text-white">
                    15 minutes
                  </span>{" "}
                  to complete the
                  assessment.
                </p>

                <p>
                  • Each correct answer:
                  {" "}
                  <span className="font-semibold text-emerald-400">
                    +1 mark
                  </span>
                </p>

                <p>
                  • Wrong answers: {" "}
                  <span className="font-semibold text-white">
                    -0.25 marks
                  </span>
                </p>

                <p>
                  • Unanswered:
                  {" "}
                  <span className="font-semibold text-white">
                    0 marks
                  </span>
                </p>

              </div>

            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">

              <div className="flex items-center gap-3">

                <AlertTriangle
                  size={20}
                  className="text-amber-400"
                />

                <h3 className="font-semibold text-white">
                  Round 2 Eligibility
                </h3>

              </div>

              <div className="mt-4">

                <p className="text-sm text-slate-400">
                  Round 2 Eligibility:
                </p>

                <div className="mt-3 flex items-end gap-2">

                  <span className="text-5xl font-bold text-amber-400">
                    100%
                  </span>

                  <span className="mb-2 text-sm text-slate-500">
                    / 25 marks
                  </span>

                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">

                  Any score{" "}
                  <span className="text-emerald-400 font-semibold">
                    → Qualified for Round 2
                  </span>.

                  <br />

                  Round 1 marks are recorded for performance tracking only; they do not affect Round 2 eligibility.

                </p>

              </div>

            </div>

          </div>

          {/* SKILLS */}

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-6">

            <p className="text-sm font-semibold text-white">
              Skills Covered
            </p>

            <div className="mt-4 flex flex-wrap gap-3">

              {[
                "Python",
                "SQL",
                "React",
                "FastAPI",
                "Git",
              ].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          </div>

          {/* START */}

          <div className="mt-8 flex justify-center">

            <button
              type="button"
              onClick={startAssessment}
              className="flex items-center justify-center gap-3 rounded-xl bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500"
            >

              <ArrowRight
                size={20}
              />

              Start Assessment

            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ROUND 2 CODING SCREEN
  // ==========================================================

  if (submitted && round2Started) {
    const passedTests = round2TestResults.filter(
      (item) => item.passed
    ).length;

    const allTestsPassed =
      round2TestResults.length > 0 &&
      passedTests === ROUND_TWO_TEST_CASES.length;

    return (
      <div className="space-y-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Technical Coding Evaluation • Round 2
            </p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">
              Coding Challenge
            </h1>
            <p className="mt-3 max-w-4xl text-slate-400">
              Solve the problem using Java, Python, C, or C++. Select a language above the editor, write your solution from the provided template, run it through the compiler and test cases, then submit only after every test case passes.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <Code2 size={19} className="text-emerald-400" />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Round 2 • Question 1
              </p>
              <p className="text-sm font-semibold text-emerald-400">
                LeetCode Medium
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">

          {/* QUESTION */}
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-slate-900 p-7 xl:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20">
                <Terminal size={22} className="text-violet-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-400">
                  Problem 1
                </p>
                <p className="text-sm font-semibold text-white">
                  Medium Difficulty
                </p>
              </div>
            </div>

            <h2 className="mt-7 text-2xl font-bold leading-8 text-white">
              Longest Substring Without Repeating Characters
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Given a string <code className="rounded bg-slate-800 px-1.5 py-0.5 text-violet-300">s</code>, find the length of the longest substring without repeating characters.
            </p>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Examples
              </p>

              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Input</p>
                  <code className="text-slate-200">s = "abcabcbb"</code>
                  <p className="mt-1 text-emerald-400">Output: 3</p>
                </div>
                <div>
                  <p className="text-slate-500">Input</p>
                  <code className="text-slate-200">s = "bbbbb"</code>
                  <p className="mt-1 text-emerald-400">Output: 1</p>
                </div>
                <div>
                  <p className="text-slate-500">Input</p>
                  <code className="text-slate-200">s = "pwwkew"</code>
                  <p className="mt-1 text-emerald-400">Output: 3</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <p>• Return only the maximum length.</p>
              <p>• Aim for an O(n) sliding-window solution.</p>
              <p>• Function name must be <span className="font-semibold text-white">lengthOfLongestSubstring</span>.</p>
            </div>
          </div>

          {/* CODE EDITOR */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 xl:col-span-5">
            <div className="mb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Choose Language
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ROUND_TWO_LANGUAGES.map((language) => (
                  <button
                    key={language.id}
                    type="button"
                    onClick={() => selectRound2Language(language.id)}
                    disabled={round2Running || round2Submitted}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      round2Language === language.id
                        ? "border-violet-500 bg-violet-600/20 text-violet-200"
                        : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-white"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Code2 size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Your Solution
                  </p>
                  <p className="text-xs text-slate-500">
                    {ROUND_TWO_LANGUAGES.find((item) => item.id === round2Language)?.label} • {ROUND_TWO_LANGUAGES.find((item) => item.id === round2Language)?.version}
                  </p>
                </div>
              </div>

              <span className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-400">
                function required
              </span>
            </div>

            <textarea
              value={round2Code}
              onChange={(event) => updateRound2Code(event.target.value)}
              onCopy={(event) => blockRound2ClipboardAction(event, "copying")}
              onCut={(event) => blockRound2ClipboardAction(event, "cutting")}
              onPaste={(event) => blockRound2ClipboardAction(event, "pasting")}
              onContextMenu={(event) => blockRound2ClipboardAction(event, "using the context menu")}
              onKeyDown={handleRound2EditorKeyDown}
              onDrop={handleRound2EditorDrop}
              onDragOver={(event) => event.preventDefault()}
              spellCheck={false}
              disabled={round2Submitted}
              className="mt-5 min-h-[480px] w-full resize-y rounded-xl border border-slate-700 bg-[#050816] p-5 font-mono text-sm leading-6 text-slate-200 outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={runRound2Code}
                disabled={round2Running || round2Submitted}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/20 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-600/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {round2Running ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Play size={17} />
                )}
                {round2Running ? "Running..." : "Run Code"}
              </button>

              <button
                type="button"
                onClick={submitRound2Code}
                disabled={round2Running || round2Submitted || !allTestsPassed}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
                {round2Submitted ? "Code Submitted" : "Submit Code"}
              </button>
            </div>

            {round2Submitted && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <div>
                    <p className="font-semibold text-emerald-400">
                      All test cases passed
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Round 2 Question 1 has been submitted successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TEST RESULTS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 xl:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Test Results
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {round2TestResults.length === 0
                    ? "Ready to run"
                    : `${passedTests}/${ROUND_TWO_TEST_CASES.length} passed`}
                </h2>
              </div>
              <Target size={21} className="text-cyan-400" />
            </div>

            <div className="mt-5 space-y-3">
              {round2TestResults.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-sm leading-6 text-slate-500">
                    Click <span className="font-semibold text-slate-300">Run Code</span> to compile your selected language and execute the solution against every test case.
                  </p>
                </div>
              ) : (
                round2TestResults.map((test) => (
                  <div
                    key={test.index}
                    className={`rounded-xl border p-4 ${
                      test.passed
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-red-500/20 bg-red-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">
                        Test Case {test.index}
                      </span>
                      {test.passed ? (
                        <CheckCircle2 size={17} className="text-emerald-400" />
                      ) : (
                        <XCircle size={17} className="text-red-400" />
                      )}
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      Input
                    </p>
                    <code className="mt-1 block break-all text-xs text-slate-300">
                      {test.input === "" ? '""' : `"${test.input}"`}
                    </code>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Expected</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {String(test.expected)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Actual</p>
                        <p className={`mt-1 font-semibold ${test.passed ? "text-emerald-400" : "text-red-400"}`}>
                          {String(test.actual)}
                        </p>
                      </div>
                    </div>

                    {test.status && (
                      <p className="mt-3 text-xs text-slate-500">
                        Status: <span className={test.passed ? "text-emerald-400" : "text-red-400"}>{test.status}</span>
                        {test.time ? ` • ${test.time}s` : ""}
                      </p>
                    )}

                    {test.error && (
                      <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-red-400">
                        {test.error}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {allTestsPassed && !round2Submitted && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-sm font-semibold text-emerald-400">
                  ✓ All test cases passed
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  You can now submit your solution.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Info size={19} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Submission Rules
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your solution must compile successfully and produce the expected output for every test case. Submit Code runs the complete compiled test suite again and accepts the solution only when every test case passes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RESULT SCREEN
  // ==========================================================

  if (submitted) {
    const roadmap =
      getRoadmap();

    return (
      <div className="space-y-8">

        {/* HEADER */}

        <div>
          <p className="text-sm font-medium text-violet-400">
            AI Skill Assessment
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">
            Assessment Result
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Your assessment has been
            evaluated for{" "}
            <span className="font-semibold text-white">
              {APPLIED_ROLE.role}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-white">
              {APPLIED_ROLE.company}
            </span>
            .
          </p>
        </div>

        {/* ====================================================
            QUALIFICATION RESULT
        ==================================================== */}

        <div
          className={`rounded-2xl border p-8 ${
            results.passed
              ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 to-slate-900"
              : "border-red-500/30 bg-gradient-to-br from-red-950/25 to-slate-900"
          }`}
        >

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
                  results.passed
                    ? "bg-emerald-500/20"
                    : "bg-red-500/20"
                }`}
              >

                {results.passed ? (
                  <Award
                    size={34}
                    className="text-emerald-400"
                  />
                ) : (
                  <XCircle
                    size={34}
                    className="text-red-400"
                  />
                )}

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  {APPLIED_ROLE.company}
                  {" • "}
                  {APPLIED_ROLE.role}
                </p>

                <h2
                  className={`mt-1 text-3xl font-bold ${
                    results.passed
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {results.passed
                    ? "QUALIFIED"
                    : "DISQUALIFIED"}
                </h2>

                <p className="mt-2 text-sm text-slate-400">

                  You completed Round 1.
                  {results.passed
                    ? " You cleared the 60% cutoff and can continue to Round 2."
                    : " You did not clear the 60% cutoff, so Round 2 remains locked."}

                </p>

              </div>

            </div>

            {/* BIG SCORE */}

            <div className="text-left md:text-right">

              <p className="text-sm text-slate-500">
                Your Final Marks (out of 25)
              </p>

              <p
                className={`mt-1 text-5xl font-bold ${
                  results.passed
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {results.finalScore}
                <span className="text-2xl text-slate-500">
                  /25
                </span>
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {results.percentage}% score
              </p>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>
                  <span className="text-slate-400">Total Marks:</span> 25
                </p>
                <p>
                  <span className="text-slate-400">Cutoff:</span> 60% (15/25)
                </p>
                <p>
                  <span className="text-slate-400">Cutoff Reached:</span>{" "}
                  <span className={results.passed ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                    {results.passed ? "YES" : "NO"}
                  </span>
                </p>
              </div>

            </div>

          </div>

          {/* SCORE BAR */}

          <div className="mt-8 border-t border-slate-800/80 pt-6">

            <div className="flex items-center justify-between text-sm">

              <span className="text-slate-400">
                Your Score
              </span>

              <span className="font-semibold text-white">
                {results.percentage}%
              </span>

            </div>

            <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-slate-800">

              <div
                className={`h-full rounded-full ${
                  results.passed
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    results.percentage
                  )}%`,
                }}
              />

              {/* SCORE REFERENCE */}

              <div
                className="absolute top-0 h-full w-1 bg-emerald-400"
                style={{
                  left: "0%",
                }}
              />

            </div>

            <div className="mt-2 flex justify-between text-xs">

              <span className="text-slate-500">
                0%
              </span>

              <span className="font-semibold text-amber-400">
                Round 2: 60% Cutoff
              </span>

              <span className="text-slate-500">
                100%
              </span>

            </div>

          </div>

        </div>

        {/* ====================================================
            ROUND 1 SCORE BREAKDOWN
        ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-500">Correct Answers</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {results.correctAnswers}
            </p>
            <p className="mt-1 text-xs text-slate-500">× +1</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-500">Wrong Answers</p>
            <p className="mt-1 text-2xl font-bold text-red-400">
              {results.wrongAnswers}
            </p>
            <p className="mt-1 text-xs text-slate-500">× −0.25</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-500">Unanswered</p>
            <p className="mt-1 text-2xl font-bold text-slate-300">
              {results.unanswered}
            </p>
            <p className="mt-1 text-xs text-slate-500">× 0</p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-xs text-slate-500">Cutoff Status</p>
            <p className={`mt-1 text-2xl font-bold ${results.passed ? "text-emerald-400" : "text-red-400"}`}>
              {results.passed ? "QUALIFIED" : "DISQUALIFIED"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {results.percentage}% / 60% required
            </p>
          </div>
        </div>

        {/* ====================================================
            SUCCESS / FAILURE MESSAGE
        ==================================================== */}

        {results.passed ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

            <div className="flex items-start gap-4">

              <CheckCircle2
                size={25}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>

                <h3 className="text-lg font-bold text-emerald-400">
                  You qualified for Round 2
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">

                  You completed Round 1 with a score of{" "}
                  <span className="font-semibold text-white">
                    {results.finalScore}/25
                  </span>{" "}
                  ({results.percentage}%).

                  <br />

                  You are now{" "}
                  <span className="font-semibold text-emerald-400">
                    qualified for Round 2
                  </span>{" "}
                  for the {APPLIED_ROLE.role} position at {APPLIED_ROLE.company}.

                </p>

              </div>

            </div>

          </div>
        ) : (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

            <div className="flex items-start gap-4">

              <XCircle
                size={25}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>

                <h3 className="text-lg font-bold text-red-400">
                  Round 2 Locked
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your final Round 1 score is below the 60% cutoff.
                  You need at least 15/25 marks to unlock Round 2.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* ====================================================
            SAVE STATUS
        ==================================================== */}

        {saveMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">

            <CheckCircle2
              size={20}
            />

            {saveMessage}

          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-400">

            <AlertTriangle
              size={20}
            />

            {error}

          </div>
        )}

        {/* ====================================================
            SCORE CARDS
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* FINAL MARKS */}

          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/60 to-slate-900 p-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">

              <Trophy
                size={25}
                className="text-violet-300"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Final Marks
            </p>

            <div className="mt-2">

              <span className="text-6xl font-bold text-white">
                {results.finalScore}
              </span>

              <span className="text-xl text-slate-500">
                /25
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-400">

              Percentage:{" "}
              <span className="font-semibold text-white">
                {results.percentage}%
              </span>

            </p>

          </div>

          {/* ANSWER BREAKDOWN */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">

              <Target
                size={25}
                className="text-blue-400"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Answer Breakdown
            </p>

            <div className="mt-4 space-y-2 text-sm">

              <p className="text-emerald-400">
                Correct:{" "}
                <span className="font-bold">
                  {results.correctAnswers}
                </span>
              </p>

              <p className="text-red-400">
                Wrong:{" "}
                <span className="font-bold">
                  {results.wrongAnswers}
                </span>
              </p>

              <p className="text-slate-400">
                Unanswered:{" "}
                <span className="font-bold text-white">
                  {results.unansweredQuestions}
                </span>
              </p>

            </div>

          </div>

          {/* CUTOFF */}

          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/80 p-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">

              <Target
                size={25}
                className="text-amber-400"
              />

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Round 2 Eligibility
            </p>

            <p className="mt-2 text-5xl font-bold text-amber-400">
              QUALIFIED
            </p>

            <p className="mt-3 text-sm text-slate-400">

              A final Round 1 score of 60% or higher qualifies for Round 2.

            </p>

            <p
              className={`mt-3 text-sm font-semibold ${
                results.passed
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              ✓ Ready for Round 2
            </p>

          </div>

        </div>

        {/* ====================================================
            MARKING SUMMARY
        ==================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-7">

          <div className="flex items-center gap-3">

            <Brain
              size={25}
              className="text-violet-400"
            />

            <div>

              <h2 className="text-2xl font-bold text-white">
                Scoring Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Correct answers receive +1 mark, wrong answers receive -0.25 mark,
                and unanswered questions receive 0 marks.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

              <p className="text-sm text-slate-500">
                Correct Answers
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                +{results.correctAnswers}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {results.correctAnswers}
                {" × +1"}
              </p>

            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

              <p className="text-sm text-slate-500">
                Negative Marks
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                -{results.negativeMarks}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {results.wrongAnswers} × -0.25
              </p>

            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">

              <p className="text-sm text-slate-500">
                Final Score
              </p>

              <p className="mt-2 text-3xl font-bold text-violet-400">
                {results.finalScore}/25
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {results.percentage}%
                overall
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            SKILL PERFORMANCE
        ==================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-7">

          <div className="flex items-center gap-3">

            <Brain
              size={25}
              className="text-violet-400"
            />

            <div>

              <h2 className="text-2xl font-bold text-white">
                Skill-wise Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your performance across all
                five technical skills.
              </p>

            </div>

          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            {results.skills.map(
              (item) => {

                const skillPassed =
                  item.percentage >=
                  CUTOFF_PERCENTAGE;

                return (
                  <div
                    key={item.skill}
                    className="rounded-xl border border-slate-800 bg-slate-950/25 p-5"
                  >

                    <div className="flex items-center justify-between gap-2">

                      <span className="font-semibold text-white">
                        {item.skill}
                      </span>

                      <span
                        className={`font-bold ${
                          item.percentage >=
                          70
                            ? "text-emerald-400"
                            : item.percentage >=
                              25
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.percentage}%
                      </span>

                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          item.percentage >=
                          70
                            ? "bg-emerald-500"
                            : item.percentage >=
                              25
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            item.percentage
                          )}%`,
                        }}
                      />

                    </div>

                    <div className="mt-3 space-y-1 text-xs">

                      <p className="text-emerald-400">
                        Correct:{" "}
                        {item.correct}
                      </p>

                      <p className="text-red-400">
                        Wrong:{" "}
                        {item.wrong}
                      </p>

                      <p className="text-slate-500">
                        Unanswered:{" "}
                        {item.unanswered}
                      </p>

                      <p
                        className={
                          skillPassed
                            ? "pt-2 font-semibold text-emerald-400"
                            : "pt-2 font-semibold text-amber-400"
                        }
                      >
                        {skillPassed
                          ? "✓ Strong"
                          : "Improve"}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* ====================================================
            ROADMAP
        ==================================================== */}

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900 p-7">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">

              <BookOpen
                size={25}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-sm font-medium text-cyan-400">
                Personalized Improvement
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Your Role Roadmap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Use your assessment result to
                improve before reassessment.
              </p>

            </div>

          </div>

          {roadmap.length > 0 ? (
            <div className="mt-6 space-y-4">

              {roadmap.map(
                (item, index) => (
                  <div
                    key={item.skill}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 p-5"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-300">
                        {index + 1}
                      </div>

                      <div className="flex-1">

                        <div className="flex items-center justify-between gap-4">

                          <h3 className="font-semibold text-white">
                            {item.skill}
                          </h3>

                          <span className="text-sm font-bold text-amber-400">
                            {item.percentage}%
                          </span>

                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {item.recommendation}
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

              <p className="font-semibold text-emerald-400">
                Excellent skill profile
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Your current performance is
                strong across all assessed
                skills. Continue practicing and
                prepare for the next recruitment
                stage.
              </p>

            </div>
          )}

        </div>

        {/* ====================================================
            NEXT STEP
        ==================================================== */}

        <div
          className={`rounded-2xl border p-7 ${
            results.passed
              ? "border-emerald-500/20 bg-gradient-to-r from-emerald-950/25 to-slate-900"
              : "border-violet-500/20 bg-gradient-to-r from-violet-950/70 to-slate-900"
          }`}
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/20">

                {results.passed ? (
                  <Award
                    size={28}
                    className="text-emerald-300"
                  />
                ) : (
                  <RotateCcw
                    size={28}
                    className="text-violet-300"
                  />
                )}

              </div>

              <div>

                <p className="text-sm font-medium text-violet-400">
                  {results.passed
                    ? "Eligibility Cleared"
                    : "Improve & Reassess"}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">

                  {results.passed
                    ? "You are eligible for this role"
                    : "Build your skills and try again"}

                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {results.passed
                    ? "You cleared the 60% cutoff and can continue to Round 2."
                    : "You did not clear the 60% cutoff. Round 2 remains locked."}
                </p>

              </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={startRound2}
                disabled={!results.passed}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
              >
                <Code2 size={17} />
                {results.passed ? "Continue to Round 2" : "🔒 Round 2 Locked"}
                {results.passed && <ArrowRight size={17} />}
              </button>

              <button
                type="button"
                onClick={resetAssessment}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
              >
                <RotateCcw size={17} />
                Retake Assessment
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ASSESSMENT SCREEN
  // ==========================================================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

        <div>

          <p className="text-sm font-medium text-violet-400">
            AI-powered evaluation
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">
            Skill Assessment
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">

            {student?.name ||
              "Student"}
            , evaluate your current
            technical skills for{" "}
            <span className="font-semibold text-white">
              {APPLIED_ROLE.role}
            </span>
            .

          </p>

        </div>

        {/* QUESTION COUNT + TIMER */}

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-400">

            <Target
              size={17}
              className="text-violet-400"
            />

            {answeredCount}/25

          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
              timeLeft <= 300
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
            }`}
          >

            <Clock3
              size={17}
            />

            {formattedTime}

          </div>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-400">
            Assessment Progress
          </span>

          <span className="font-semibold text-white">

            {answeredCount}/
            {QUESTIONS.length}

          </span>

        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* ROLE INFO */}

      <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-5 py-4">

        <BriefcaseBusiness
          size={19}
          className="text-violet-400"
        />

        <p className="text-sm text-slate-400">

          Assessment for{" "}
          <span className="font-semibold text-white">
            {APPLIED_ROLE.role}
          </span>
          {" • "}
          {APPLIED_ROLE.company}

          {" • "}

          Round 2:{" "}
          <span className="font-semibold text-emerald-400">
            60% Cutoff
          </span>

        </p>

      </div>

      {/* QUESTION */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT */}

        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/25 to-slate-900 p-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">

            <Brain
              size={25}
              className="text-violet-300"
            />

          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-violet-400">

            Question{" "}
            {currentQuestion + 1}

          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">

            {question.skill}

          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">

            Technical skill evaluation

          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">

            <Target
              size={14}
            />

            Difficulty:{" "}
            {question.difficulty}

          </div>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/40 p-4">

            <p className="text-xs text-slate-500">
              Skill Coverage
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
              10 questions
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Dedicated evaluation for{" "}
              {question.skill}
            </p>

          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">

            <p className="text-xs text-slate-500">
              Marking
            </p>

            <div className="mt-2 space-y-1 text-xs">

              <p className="text-emerald-400">
                Correct: +1
              </p>

              <p className="text-red-400">
                Wrong: -0.25
              </p>

              <p className="text-slate-500">
                Unanswered: 0
              </p>

            </div>

          </div>

        </div>

        {/* QUESTION CONTENT */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-7 lg:col-span-2">

          <p className="text-sm text-slate-500">

            Question{" "}
            {currentQuestion + 1} of{" "}
            {QUESTIONS.length}

          </p>

          <h2 className="mt-3 text-2xl font-bold leading-9 text-white">

            {question.question}

          </h2>

          <div className="mt-7 grid gap-3">

            {question.options.map(
              (option, index) => {

                const selected =
                  answers[
                    question.id
                  ] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      selectAnswer(option)
                    }
                    className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-slate-800 bg-slate-950/30 hover:border-violet-500/25 hover:bg-violet-500/5"
                    }`}
                  >

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        selected
                          ? "bg-violet-600 text-white"
                          : "bg-slate-800 text-slate-400 group-hover:bg-violet-500/20 group-hover:text-violet-300"
                      }`}
                    >

                      {String.fromCharCode(
                        65 + index
                      )}

                    </span>

                    <span
                      className={`text-sm font-medium ${
                        selected
                          ? "text-white"
                          : "text-slate-300"
                      }`}
                    >

                      {option}

                    </span>

                    {selected && (
                      <CheckCircle2
                        size={19}
                        className="ml-auto text-violet-400"
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>

          {/* NAVIGATION */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={
                previousQuestion
              }
              disabled={
                currentQuestion === 0
              }
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >

              Previous

            </button>

            {currentQuestion <
            QUESTIONS.length - 1 ? (

              <button
                type="button"
                onClick={
                  nextQuestion
                }
                disabled={
                  !answers[
                    question.id
                  ]
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Next Question

                <ArrowRight
                  size={17}
                />

              </button>

            ) : (

              <button
                type="button"
                onClick={
                  submitAssessment
                }
                disabled={
                  saving ||
                  submitted
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Calculating Result...

                  </>
                ) : (
                  <>
                    Complete Assessment

                    <CheckCircle2
                      size={17}
                    />

                  </>
                )}

              </button>

            )}

          </div>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">

            <AlertTriangle
              size={19}
              className="text-amber-400"
            />

          </div>

          <div>

            <h3 className="font-semibold text-white">
              Marking
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">

              Each correct answer awards{" "}
              <span className="text-emerald-400">
                +1 mark
              </span>
              . Wrong answers receive{" "}
              <span className="text-white">
                -0.25 marks
              </span>
              . Unanswered questions receive
              zero marks. A score of at least 60% qualifies for Round 2.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Assessment;
