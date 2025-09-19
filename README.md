---
title: Quiz illustration
---


# quiz setup

This is a template for setting up web quiz for multiple-choice questions learning/training purpose. Below is details of the content organization for setting up your own quiz.

## Quiz Content

The quiz can be expressed as simple markdown. The content is divided into two files
  1. Quiz header
  2. Quiz questions

Quiz header, and Quiz questions are two files with same name, but in different folders. Say one has three quizzes, and files are named `quiz-01.md`, `quiz-02.md`, `quiz-03.md` then a set of these files should exist in `_quizzes` folder, with just following front-matter info:

```yml
---
layout: quiz-template
title: Quiz 1
description: Description 1
quizfile: /assets/quizzes/quiz-01.md
---
```
Where `layout` is `quiz-template`, common for all quizzes, the title and description can be whatever the quiz is about.

The quiz questions are in the same named files, as above, `quiz-01.md`, `quiz-02.md`, `quiz-03.md` and should be placed in `assets/quizzes/` folder, and should look like:

```markdown
### Question 1 — What is the capital of France?
- [ ] Berlin
- [x] Paris
- [ ] Madrid
- [ ] Rome

### Question 2 — Which of these are programming languages?
- [x] Python
- [x] C++
- [ ] Banana
- [x] Rust
```

Where the questions are placed in `###` heading, and multiple choice options are itemized lists. Inline latex with `$ $` sign should work well.

