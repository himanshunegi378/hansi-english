Below is a practical breakdown of the **screens** and the **UI elements** for a quiz module.

I’ll split it into 2 sides because quiz systems usually have both:

* **Admin / Creator side**
* **Learner / User side**

That makes the module easier to design and build.

---

# 1. Admin / Creator screens

## 1. Quiz list screen

Purpose: show all quizzes and let admin manage them.

### UI elements

* page title
* create quiz button
* search input
* status filter dropdown
* sort dropdown
* quiz list / table
* quiz title
* description preview
* status badge
* total sections count
* total questions count
* time limit
* passing score
* created date
* updated date
* row action menu

  * edit
  * publish
  * archive
  * delete
* pagination

---

## 2. Create quiz screen

Purpose: create top-level quiz data.

### UI elements

* page title
* breadcrumb
* title input
* description textarea
* status selector
* time limit input
* passing score input
* save draft button
* save and continue button
* cancel button
* validation error messages

---

## 3. Edit quiz / Quiz builder screen

Purpose: main authoring screen for sections and questions.

### UI elements

* breadcrumb
* quiz title inline editable field
* description inline editable field
* status badge
* publish button
* archive button
* save changes button
* preview quiz button

### Section area

* section list sidebar or stacked layout
* add section button
* section card

  * section title
  * section description
  * reorder handle
  * edit button
  * delete button
  * collapse/expand toggle

### Question area

* question list inside each section
* add question button
* question card

  * question type badge
  * question text
  * points
  * required toggle
  * reorder handle
  * edit button
  * duplicate button
  * delete button

---

## 4. Add / edit question screen or drawer

Purpose: define one question in detail.

### UI elements

* question text textarea / rich text input
* question type dropdown
* explanation textarea
* points input
* required toggle
* order input or drag ordering support

### For objective questions

* options list
* option input
* correct answer checkbox / radio
* add option button
* delete option button
* drag handle for option ordering

### For short answer

* correct answer input
* grading mode selector

  * auto grade
  * manual review

### Actions

* save button
* save and add next button
* cancel button

---

## 5. Quiz preview screen

Purpose: preview quiz exactly as learner sees it.

### UI elements

* preview banner
* quiz title
* quiz description
* section blocks
* question cards
* option controls

  * radio buttons
  * checkboxes
  * text input
* navigation buttons
* back to builder button

---

## 6. Quiz analytics / results overview screen

Purpose: see performance across attempts.

### UI elements

* page title
* quiz summary cards

  * total attempts
  * average score
  * pass rate
  * completion rate
* filters

  * date range
  * user
  * score range
* attempts table

  * learner name
  * attempt number
  * status
  * score
  * passed
  * started at
  * submitted at
  * view details action
* export button

---

## 7. Attempt review / grading screen

Purpose: review one learner’s answers and manually grade where needed.

### UI elements

* learner info header
* quiz info header
* attempt status badge
* total score summary
* per-question answer cards

  * question text
  * learner answer
  * correct answer
  * correctness badge
  * awarded points input
  * feedback textarea
* previous / next question navigation
* save grading button
* finalize grading button

---

# 2. Learner / User screens

## 8. Quiz catalog / available quizzes screen

Purpose: show quizzes user can take.

### UI elements

* page title
* search input
* filter tabs

  * available
  * in progress
  * completed
* quiz cards / table

  * title
  * description
  * time limit
  * question count
  * passing score
  * status
  * start / resume button

---

## 9. Quiz instructions screen

Purpose: show quiz info before starting.

### UI elements

* quiz title
* quiz description
* instructions list
* time limit
* number of questions
* passing criteria
* rules / warning notice
* start quiz button
* back button

---

## 10. Quiz attempt screen

Purpose: actual answering experience.

### UI elements

* top progress bar
* timer
* question progress indicator
* section title
* question card
* question text
* question number
* points label
* required badge

### Answer controls

* radio group for single choice
* checkbox group for multiple choice
* true/false toggle
* text input / textarea for short answer

### Navigation

* previous button
* next button
* save and next button
* question palette / navigator
* submit quiz button
* confirmation modal before submit

### Support UI

* unsaved changes indicator
* autosave status
* marked for review toggle

---

## 11. Quiz submission success screen

Purpose: confirm attempt submitted.

### UI elements

* success icon
* confirmation message
* submitted time
* go to result button
* go to quizzes button

---

## 12. Quiz result screen

Purpose: show score and answer review.

### UI elements

* result summary card

  * score
  * max score
  * pass/fail badge
  * submitted at
* performance summary

  * correct count
  * incorrect count
  * unanswered count
* per-question review accordion

  * question text
  * selected answer
  * correct answer
  * explanation
  * awarded points
* retake button if allowed
* back to list button

---

## 13. My attempts history screen

Purpose: user sees all attempts for a quiz or all quizzes.

### UI elements

* page title
* filters

  * quiz
  * status
  * date
* attempts table / cards

  * quiz title
  * attempt number
  * status
  * score
  * passed
  * started at
  * submitted at
  * view result action
  * resume action for in-progress

---

# 3. Shared reusable UI components

These are the building blocks you’ll likely reuse across screens.

## Quiz-related components

* quiz card
* quiz status badge
* section card
* question card
* question type badge
* attempt status badge
* score badge
* pass/fail badge

## Form controls

* text input
* textarea
* number input
* dropdown / select
* multi-select
* radio group
* checkbox group
* toggle switch
* date picker
* time duration input

## Utility components

* breadcrumb
* tabs
* modal
* drawer
* accordion
* tooltip
* pagination
* empty state
* loading skeleton
* confirmation dialog
* toast notification

---

# 4. MVP screen list

If you want to keep version 1 small, build only these first:

## Admin

* Quiz list
* Create quiz
* Quiz builder
* Add/edit question

## Learner

* Quiz catalog
* Quiz instructions
* Quiz attempt
* Quiz result

That is enough for a usable first release.

---

# 5. Best way to group the module in frontend routes

A clean route structure could look like this:

```txt
/admin/quizzes
/admin/quizzes/new
/admin/quizzes/:quizId/edit
/admin/quizzes/:quizId/preview
/admin/quizzes/:quizId/results
/admin/attempts/:attemptId/review

/quizzes
/quizzes/:quizId
/quizzes/:quizId/start
/attempts/:attemptId
/attempts/:attemptId/result
/my-attempts
```

---

# 6. Suggested screen order for development

Build in this order:

1. Quiz list
2. Create quiz
3. Quiz builder
4. Add/edit question
5. Quiz catalog
6. Quiz instructions
7. Quiz attempt
8. Submit/result
9. Analytics/review

This order matches dependency flow. Authoring first, then taking quiz, then reporting.

---

# 7. Product note

The most important screen in this module is usually:

* **Quiz builder** on admin side
* **Quiz attempt screen** on learner side

Those two screens deserve the most design effort because they carry most of the module’s complexity.

If you want, I can next turn this into a **table with columns: Screen, Purpose, UI Elements, Priority (MVP / Later)**.
