# 🧠 Syllaby – MVP Database Schema

## 📋 users

| Field       | Type        | Notes                                 |
|-------------|-------------|---------------------------------------|
| id          | TEXT (CUID) | Primary key                           |
| name        | TEXT        | User’s display name                   |
| email       | TEXT        | Must be unique                        |
| created_at  | DATETIME    | Timestamp of account creation         |
| updated_at  | DATETIME    | Timestamp of field change             |

---

## 🏫 classes

| Field       | Type        | Notes                                 |
|-------------|-------------|---------------------------------------|
| id          | TEXT (CUID) | Primary key                           |
| user_id     | TEXT        | FK to `users.id`, cascade on delete   |
| name        | TEXT        | Class name (e.g. “Organic Chem”)      |
| semester    | TEXT        | e.g. "Fall 2025"                      |
| archived    | BOOLEAN     | Soft delete / hide from dashboard     |
| created_at  | DATETIME    | Timestamp of account creation         |
| updated_at  | DATETIME    | Timestamp of field change             |

---

## 📄 files

| Field       | Type        | Notes                                  |
|-------------|-------------|----------------------------------------|
| id          | TEXT (CUID) | Primary key                            |
| class_id    | TEXT        | FK to `classes.id`                     |
| name        | TEXT        | File name                              |
| type        | TEXT        | File type (e.g., "pdf", "docx")        |
| size        | INTEGER     | File size in bytes                     |
| uploaded_at | DATETIME    | Upload timestamp                       |

---

## 📚 chunks

| Field        | Type        | Notes                                      |
|--------------|-------------|--------------------------------------------|
| id           | TEXT (CUID) | Primary key                                |
| file_id      | TEXT        | FK to `files.id`                           |
| class_id     | TEXT        | FK to `classes.id`                         |
| text         | TEXT        | Raw text content of chunk                  |
| embedding    | VECTOR/BLOB | Embedding vector for search                |
| chunk_index  | INTEGER     | Index to preserve chunk order              |
| created_at   | DATETIME    | Timestamp                                  |

---

## 💬 questions

| Field      | Type        | Notes                                 |
|------------|-------------|---------------------------------------|
| id         | TEXT (CUID) | Primary key                           |
| user_id    | TEXT        | FK to `users.id`                      |
| class_id   | TEXT        | FK to `classes.id`                    |
| question   | TEXT        | User query                            |
| answer     | TEXT        | LLM-generated response                |
| asked_at   | DATETIME    | Timestamp                             |

---

## 🧪 quizzes

| Field         | Type        | Notes                             |
|---------------|-------------|-----------------------------------|
| id            | TEXT (CUID) | Primary key                       |
| class_id      | TEXT        | FK to `classes.id`                |
| generated_by  | TEXT        | "manual" or "auto"                |
| created_at    | DATETIME    | Timestamp                         |

---

## ❓ quiz_questions

| Field           | Type        | Notes                         |
|------------------|-------------|-------------------------------|
| id               | TEXT (CUID) | Primary key                   |
| quiz_id          | TEXT        | FK to `quizzes.id`            |
| prompt           | TEXT        | Question prompt               |
| choices          | JSON        | Multiple choice options       |
| correct_choice   | TEXT        | Answer key                    |
| explanation      | TEXT        | Optional explanation          |

---

## 🧠 snapshots (optional)

| Field       | Type        | Notes                                 |
|-------------|-------------|---------------------------------------|
| id          | TEXT (CUID) | Primary key                           |
| class_id    | TEXT        | FK to `classes.id`                    |
| notes       | TEXT        | Optional notes from user              |
| created_at  | DATETIME    | Timestamp of snapshot                 |

---

## 🏷️ tags (optional)

| Field      | Type        | Notes                                 |
|------------|-------------|---------------------------------------|
| id         | TEXT (CUID) | Primary key                           |
| chunk_id   | TEXT        | FK to `chunks.id`                     |
| label      | TEXT        | Tag content (e.g., "date", "policy")  |
| confidence | REAL        | Tagging confidence score              |