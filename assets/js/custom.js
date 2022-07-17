
function getPage() {
    return document.body?.dataset?.page || "";
}

function initCommon() {

}







// Initialize sample data if empty
if (!localStorage.getItem("taskList")) {
    localStorage.setItem("taskList", JSON.stringify(sampleTaskList));
}

function normalizeNote(raw) {
    const nowIso = new Date().toISOString();

    return {
        id: raw.id ?? (Date.now() + Math.floor(Math.random() * 100000)),

        noteTitle: (raw.noteTitle ?? "").trim(),
        noteDesc: (raw.noteDesc ?? "").trim(),

        // keep both, but display updatedAt if it exists
        createdAt: raw.createdAt ?? nowIso,
        updatedAt: raw.updatedAt ?? raw.updateAt ?? null, // handles your earlier typo too

        tag: (raw.tag ?? "Quick note").trim(),
        color: (raw.color ?? "yellow").trim(),
        pinned: raw.pinned ?? false
    };
}

function normalizeTask(raw) {
    return {
        id: raw.id ?? Date.now() + Math.floor(Math.random() * 100000),
        taskTitle: raw.taskTitle ?? "",
        taskDesc: raw.taskDesc ?? "",
        taskDueDate: raw.taskDueDate ?? "",
        startTime: raw.startTime ?? "",
        endTime: raw.endTime ?? "",
        category: raw.category ?? "",
        type: raw.type ?? "",
        status: raw.status ?? "wait"
    };
}

function migrateNotes() {
    const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");
    const upgraded = noteList.map(normalizeNote);
    localStorage.setItem("noteList", JSON.stringify(upgraded));
}

function migrateTasks() {
    let taskList = JSON.parse(localStorage.getItem("taskList") || "[]");
    if (taskList.length === 0) {
        taskList = sampleTaskList.map(normalizeTask);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    } else {
        taskList = taskList.map(normalizeTask);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
}

// run only on pages that have the notes UI
if (document.querySelector(".notes-list")) {

    //Seed once (if missing)
    if (!localStorage.getItem("noteList")) {
        localStorage.setItem("noteList", JSON.stringify(sampleNoteList));
    }

    // Upgrade / fill missing fields (id, color, tag, pinned, timestamps)
    migrateNotes();
}


if (!localStorage.getItem("noteList")) {
    localStorage.setItem("noteList", JSON.stringify(sampleNoteList));
}


// Nav

function setNavActivate(currentPage) {
    // Set active nav item
    const navItems = $(".navbar-nav .nav-item");

    navItems.removeClass("nav-link-active");

    if (currentPage === "dashboard") {
        navItems.find("a[href='index.html']").closest(".nav-item").addClass("nav-link-active");
    } else if (currentPage === "task") {
        navItems.find("a[href='task.html']").closest(".nav-item").addClass("nav-link-active");
    } else if (currentPage === "calendar") {
        navItems.find("a[href='calendar.html']").closest(".nav-item").addClass("nav-link-active");
    }
}

$(document).ready(function () {
    migrateTasks();

    // --- ACCESSIBILITY / THEME ---
    const themeLink = document.querySelector("#theme-link");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        themeLink.href = "assets/css/dark-style.css";
        $("#toggleThemeSwitch").prop("checked", true);
    }

    $("#accesiblity-icon").click(() => {
        const modal = new bootstrap.Modal(document.getElementById('accesiblity-box'));
        modal.show();

        $("#saveAccesiblity").off("click").click(() => {
            const isDark = $("#toggleThemeSwitch").is(":checked");
            const newTheme = isDark ? "dark" : "light";

            themeLink.href = isDark ? "assets/css/dark-style.css" : "";
            localStorage.setItem("theme", newTheme);
            modal.hide();
        });
    });



    // Generic Validation Function
    function validateForm(fields, contextSelector) {
        let isValid = true;
        fields.forEach((field, i) => {
            if (field.val() === "") {
                $(`${contextSelector} .add-task-pop-box-body-content:nth-of-type(${i + 1}) span.errorMsg`).text("Field is required");
                isValid = false;
            }
        });
        return isValid;
    }






    // Toggle Modal Visibility & Body Scroll
    function toggleModal(modalId, show) {
        if (show) {
            $("body").addClass("overflow");
            $(modalId).removeClass("hidden");
        } else {
            $("body").removeClass("overflow");
            $(modalId).addClass("hidden");
            // Clear error messages
            $(`${modalId} .errorMsg`).text("");
        }
    }

    // Open Modals
    $(".add-task-btn-on-menu, .small-calendar-add-task-btn-box-click").click(() => toggleModal("#addTaskBox", true));
    $(".notes-add-note-link").click(() => toggleModal("#addNoteBox", true));

    // Close Modals (Cancel buttons & Cross icons)
    $("#cancelTaskBtn, #cancelTaskCrossBtn").click(() => toggleModal("#addTaskBox", false));
    $("#cancelAddNoteBtn, #cancelAddNoteCrossBtn").click(() => toggleModal("#addNoteBox", false));
    $("#editTaskBox #cancelTaskBtn, #editTaskBox #cancelTaskCrossBtn").click(() => toggleModal("#editTaskBox", false));
    $("#cancelEditNoteBtn, #cancelEditNoteCrossBtn").click(() => toggleModal("#editNoteBox", false));

    const page = getPage();

    if (page === "task") {
        $(document).on("click", ".add-task-btn-on-menu", function (e) {
            e.preventDefault();
            const status = $(this).data("defaultStatus"); // wait/progress/complete
            if (status) $("#task-status-input").val(status);
            toggleModal("#addTaskBox", true);
        });
    }


    // CREATE NOTE
    $("#createAddNoteBtn").on("click", function (e) {
        e.preventDefault();

        const title = $("#add-note-name-input").val().trim();
        const desc = $("#add-note-desc-input").val().trim();


        if (!title || !desc) return;

        const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");

        noteList.push(normalizeNote({
            noteTitle: title,
            noteDesc: desc,
            tag: $("#add-note-tag-input").val().trim(),
            color: $("#add-note-color-input").val(),
        }));

        localStorage.setItem("noteList", JSON.stringify(noteList));

        $("#add-note-name-input").val("");
        $("#add-note-desc-input").val("");
        $("#add-note-tag-input").val("");
        $("#add-note-color-input").val("warning"); // or any default you like
        $("#add-note-pinned-input").prop("checked", false);


        toggleModal("#addNoteBox", false);
        renderNotes();
    });


    // DELETE NOTE (Delegated Event)
    $(document).on("click", ".deleteNoteBtn", function (e) {
        e.preventDefault();

        const id = Number($(this).closest(".notes-list-item").attr("data-id"));
        const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");

        const updated = noteList.filter(n => Number(n.id) !== id);
        localStorage.setItem("noteList", JSON.stringify(updated));

        renderNotes();
    });

    // edit notes
    $(document).on("click", ".editNoteBtn", function (e) {
        e.preventDefault();

        const id = Number($(this).closest(".notes-list-item").attr("data-id"));
        const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");

        const note = noteList.find(n => Number(n.id) === id);
        if (!note) return;

        console.log(note);

        $("#edit-note-name-input").val(note.noteTitle);
        $("#edit-note-desc-input").val(note.noteDesc);
        $("#edit-note-tag-input").val(note.tag || "");
        $("#edit-note-color-input").val(note.color || "warning");
        $("#edit-note-pinned-input").prop("checked", !!note.pinned);


        $("#editAddNoteBtn").data("editId", id);
        toggleModal("#editNoteBox", true);
    });

    // Pin/unpi toggle
    $(document).on("click", ".pinNoteBtn", function (e) {
        e.preventDefault();

        const id = Number($(this).closest(".notes-list-item").attr("data-id"));
        const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");

        const note = noteList.find(n => Number(n.id) === id);
        if (!note) return;

        note.pinned = !note.pinned;

        localStorage.setItem("noteList", JSON.stringify(noteList));
        renderNotes();
    });

    // CREATE TASK
    $("#createTaskBtn").click(function () {
        const fields = [
            $("#task-name-input"), $("#task-desc-input"), $("#task-date-input"),
            $("#task-start-input"), $("#task-end-input"), $("#task-category-input"),
            $("#task-type-input"), $("#task-status-input")
        ];


        if (validateForm(fields, "#addTaskBox")) {
            const newTask = {
                taskTitle: fields[0].val(),
                taskDesc: fields[1].val(),
                taskDueDate: fields[2].val(),
                startTime: fields[3].val(),
                endTime: fields[4].val(),
                category: fields[5].val(),
                type: fields[6].val(),
                status: fields[7].val(),
                id: Date.now()
            };

            const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
            taskList.push(newTask);
            localStorage.setItem("taskList", JSON.stringify(taskList));

            // Clear Inputs
            fields.forEach(f => f.val(""));
            toggleModal("#addTaskBox", false);
            if (page === "dashboard") renderDashboardTasks();
            if (page === "task") renderTaskPageTasks();
        }
    });

    // DELETE TASK (Delegated Event)
    $(document).on("click", ".deleteTaskBtn", function (e) {
        e.preventDefault();
        const index = Number($(this).closest(".work-tab-task-item").attr("data-index"));
        const taskList = JSON.parse(localStorage.getItem("taskList") || "[]");
        taskList.splice(index, 1);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        if (page === "dashboard") renderDashboardTasks();
        if (page === "task") renderTaskPageTasks();


    });

    // EDIT TASK (Open Modal & Pre-fill)

    $(document).on("click", ".editTaskBtn", function (e) {
        e.preventDefault();
        const index = Number($(this).closest(".work-tab-task-item").attr("data-index"));
        const taskList = JSON.parse(localStorage.getItem("taskList") || "[]");
        const task = taskList[index];

        $("#edit-task-name-input").val(task.taskTitle);
        $("#edit-task-desc-input").val(task.taskDesc);
        $("#edit-task-date-input").val(task.taskDueDate);
        $("#edit-task-start-input").val(task.startTime);
        $("#edit-task-end-input").val(task.endTime);
        $("#edit-task-category-input").val(task.category);
        $("#edit-task-type-input").val(task.type);
        $("#edit-task-status-input").val(task.status);

        $("#editTaskBox #createTaskBtn").data("editId", index);
        toggleModal("#editTaskBox", true);
    });



    $("#editAddNoteBtn").on("click", function (e) {
        e.preventDefault();
        const id = $(this).data("editId");
        const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");
        console.log(id)

        const note = noteList.find(n => Number(n.id) === Number(id));
        if (!note) return;

        note.noteTitle = $("#edit-note-name-input").val().trim();
        note.noteDesc = $("#edit-note-desc-input").val().trim();
        note.tag = $("#edit-note-tag-input").val().trim();
        note.color = $("#edit-note-color-input").val();
        note.pinned = $("#edit-note-pinned-input").is(":checked");
        note.updatedAt = new Date().toISOString();

        const idx = noteList.findIndex(n => Number(n.id) === Number(id));
        noteList[idx] = normalizeNote(noteList[idx]);

        localStorage.setItem("noteList", JSON.stringify(noteList));

        toggleModal("#editNoteBox", false);
        renderNotes();
    });


    // SAVE EDITED TASK
    $("#editTaskBox #createTaskBtn").click(function () {
        const index = $(this).data("editId");
        const taskList = JSON.parse(localStorage.getItem("taskList"));

        // Update task object
        taskList[index].taskTitle = $("#edit-task-name-input").val();
        taskList[index].taskDesc = $("#edit-task-desc-input").val();
        taskList[index].taskDueDate = $("#edit-task-date-input").val();
        taskList[index].startTime = $("#edit-task-start-input").val();
        taskList[index].endTime = $("#edit-task-end-input").val();
        taskList[index].category = $("#edit-task-category-input").val();
        taskList[index].type = $("#edit-task-type-input").val();
        taskList[index].status = $("#edit-task-status-input").val();

        localStorage.setItem("taskList", JSON.stringify(taskList));
        toggleModal("#editTaskBox", false);
        if (page === "dashboard") renderDashboardTasks();
        if (page === "task") renderTaskPageTasks();
    });



    // === Home page calender (small functionality)

    const $monthSpan = $('.small-calendar-date-text-month');
    const $daySpan = $('.small-calendar-date-text-day');
    const $yearSpan = $('.small-calendar-date-text-year');
    const $dateNums = $('.small-calendar-date-text');  // 7 numbers
    const $dateontask = $('.calendar-with-arrow-date-text');//

    let currentDate = new Date();  // Today

    function updateSmallCalendar(date) {
        // Header ONLY: "Month Date, Year" 
        $monthSpan.text(date.toLocaleDateString('en-GB', { month: 'long' }));
        $daySpan.text(date.getDate() + ',');
        $yearSpan.text(date.getFullYear());

        // only applicable to Task plage
        const normalFullDate = date
            .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
            .toUpperCase();

        if ($dateontask) {
            $dateontask.text(normalFullDate);
        }

        // 7 dates Mon-Sun (numbers only)
        const monday = new Date(date);
        const dayOfWeek = date.getDay() || 7;
        monday.setDate(date.getDate() - dayOfWeek + 1);

        $dateNums.each(function (i) {
            const cellDate = new Date(monday);
            cellDate.setDate(monday.getDate() + i);
            $(this).text(cellDate.getDate());

            // Dynamic highlight
            $(this).parent().toggleClass('today-highlight',
                cellDate.getDate() === date.getDate() &&
                cellDate.getMonth() === date.getMonth());
        });
    }

    // Next week on Add Task click
    $('.small-calendar-add-task-btn-box-click').click(function (e) {
        e.preventDefault();
        currentDate.setDate(currentDate.getDate() + 7);
        updateSmallCalendar(currentDate);
    });


    function renderTaskPageTasks() {
        const taskList = JSON.parse(localStorage.getItem("taskList") || "[]");


        // Initialize sample data if empty
        if (taskList.length === 0) {
            localStorage.setItem('taskList', JSON.stringify(sampleTaskList));
            return; // Exit so it loads on next render
        }

        const pendingUl = document.getElementById("pendingList");
        const progressUl = document.getElementById("progressList");
        const completedUl = document.getElementById("completedList");
        if (!pendingUl || !progressUl || !completedUl) return;

        pendingUl.innerHTML = "";
        progressUl.innerHTML = "";
        completedUl.innerHTML = "";

        taskList.forEach((task, i) => {
            const li = document.createElement("li");
            li.className = "work-tab-task-item";
            li.setAttribute("data-index", i); // IMPORTANT: makes your edit/delete work

            li.innerHTML = `
      <div class="work-tab-task-item-content row">
        <div class="work-task-item-left-content col-5 col-md-4 col-sm-4 d-flex justify-content-evenly align-items-center">
          <div class="work-task-item-time-container">
                                                 <div class="work-task-item-icon-container">
                                                    <!-- checkbox icon -->
                                                    <!-- <i class="fas fa-check-circle"></i>
                                                     -->
                                                     <div class="work-task-item-icon-content">
                                                         <div class="container work-task-item-icon-custom-content">
                                                             <input id="task-${task.id}" type="checkbox" class="work-task-item-checkbox" />
                                                             <label for="task-${task.id}" class="custome-check-box"></label>
                                                         </div>
                                                     </div>
                                                </div>
            <div class="work-task-item-time-container">
                                                    <span class="work-task-item-time fs-5 fs-md-6 fs-sm-6">`+ task.startTime + `</span>
                                                </div>
          </div>
        </div>

        <div class="work-task-item-right-content col-7 col-md-8 col-sm-8 d-flex  justify-content-between align-items-center px-3 py-1">
          <div class="work-task-item-category-title-container d-flex flex-column align-items-start">
            <div class="work-task-item-category-container">
              <span class="work-task-item-category fw-lighter fs-6">${task.category || ""}</span>
            </div>
            <div class="work-task-item-title-container">
              <span class="work-task-item-title fs-4">${task.taskTitle || ""}</span>
            </div>
          </div>

          <div class="work-task-item-edit-and-delete-container d-flex gap-4 justify-content-end pe-2">
            <div class="work-task-item-edit-container ">
                                                        <!-- anchor tag with id editIcon id with value delete icon -->
                                                        <a href="#" id="editIcon" class=" editTaskBtn work-task-item-edit-icon fs-4 text-dark" data-toggle="modal" data-target="#editTaskModal">
                                                            <i class="fa-light fa-pen-to-square"></i>
                                                        </a>
                                                    </div>
                                                    <div class="work-task-item-delete-container">
                                                        <!-- anchor tag with id deleteIcon id with value delete icon -->
                                                        <a href="#" id="deleteIcon" class="deleteTaskBtn work-task-item-delete-icon fs-4 text-dark" data-toggle="modal" data-target="#deleteTaskModal">
                                                            <i class="fa-light fa-trash-can"></i>
                                                        </a>
                                                    </div>
          </div>
        </div>
      </div>
    `;

            if (task.status === "progress") progressUl.appendChild(li);
            else if (task.status === "complete") completedUl.appendChild(li);
            else pendingUl.appendChild(li); // wait/pending default
        });
    }


    updateSmallCalendar(currentDate);
    setNavActivate(page)

    if (document.getElementById("pendingList")) {
        renderTaskPageTasks();
    } else {
        renderDashboardTasks();
        renderNotes();
    }

});
