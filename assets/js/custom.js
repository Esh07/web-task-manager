//onlick event .add-task-btn-on-menu jquery

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

function migrateNotes() {
    const noteList = JSON.parse(localStorage.getItem("noteList") || "[]");
    const upgraded = noteList.map(normalizeNote);
    localStorage.setItem("noteList", JSON.stringify(upgraded));
}


// NOTES: run only on pages that have the notes UI
if (document.querySelector(".notes-list")) {

    // 1) Seed once (if missing)
    if (!localStorage.getItem("noteList")) {
        localStorage.setItem("noteList", JSON.stringify(sampleNoteList));
    }

    // 2) Upgrade / fill missing fields (id, color, tag, pinned, timestamps)
    migrateNotes();
}


if (!localStorage.getItem("noteList")) {
    localStorage.setItem("noteList", JSON.stringify(sampleNoteList));
}
migrateNotes();



$(document).ready(function () {

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


    // Open Modals
    $(".add-task-btn-on-menu, .small-calendar-add-task-btn-box-click").click(() => toggleModal("#addTaskBox", true));
    $(".notes-add-note-link").click(() => toggleModal("#addNoteBox", true));

    // Close Modals (Cancel buttons & Cross icons)
    $("#cancelTaskBtn, #cancelTaskCrossBtn").click(() => toggleModal("#addTaskBox", false));
    $("#cancelAddNoteBtn, #cancelAddNoteCrossBtn").click(() => toggleModal("#addNoteBox", false));
    $("#editTaskBox #cancelTaskBtn, #editTaskBox #cancelTaskCrossBtn").click(() => toggleModal("#editTaskBox", false));
    $("#cancelEditNoteBtn, #cancelEditNoteCrossBtn").click(() => toggleModal("#editNoteBox", false));



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
            renderDashboardTasks(); // Re-render without reload
        }
    });


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




    // DELETE TASK (Delegated Event)
    $(document).on("click", ".deleteTaskBtn", function (e) {
        e.preventDefault();
        const index = Number($(this).closest(".work-tab-task-item").attr("data-index"));
        const taskList = JSON.parse(localStorage.getItem("taskList") || "[]");
        taskList.splice(index, 1);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        renderDashboardTasks();
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
        renderDashboardTasks();
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



    // --- 4. ACCESSIBILITY / THEME ---
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

    // --- 5. INITIAL RENDER ---
    renderDashboardTasks();
    renderNotes();

});
