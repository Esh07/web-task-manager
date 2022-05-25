//onlick event .add-task-btn-on-menu jquery

$(document).ready(function () {
    $(".add-task-btn-on-menu").on("click", function () {
        console.log("add task button clicked");
        $("body").addClass("overflow");
        $("#addTaskBox").removeClass("hidden");
    }
    );

    //listen to click cancelTaskBtn
    $("#cancelTaskBtn").on("click", function () {
        console.log("cancel task button clicked");
        $("body").removeClass("overflow");
        $(".add-task-pop-box-body-content span.errorMsg").text("");
        $("#addTaskBox").addClass("hidden");
    }
    );

    //listo to click cancelTaskCrossBtn
    $("#cancelTaskCrossBtn").on("click", function () {
        console.log("cancel task button clicked");
        $("body").removeClass("overflow");
        $(".add-task-pop-box-body-content span.errorMsg").text("");

        $("#addTaskBox").addClass("hidden");
    }
    );
    $(".notes-add-note-link").on("click", function () {
        console.log("add note button clicked");
        $("body").addClass("overflow");
        $("#addNoteBox").removeClass("hidden");
    }
    );
    //listen to click cancelNoteBtn
    $("#cancelAddNoteBtn").on("click", function () {
        console.log("cancel note button clicked");
        $("body").removeClass("overflow");
        $(".add-task-pop-box-body-content span.errorMsg").text("");

        $("#addNoteBox").addClass("hidden");
    }
    );
    //listo to click cancelNoteCrossBtn
    $("#cancelAddNoteCrossBtn").on("click", function () {
        console.log("cancel note button clicked");
        $("body").removeClass("overflow");
        $("#addNoteBox").addClass("hidden");
    }
    );

    //listen to click cancelNoteBtn
    $(".small-calendar-add-task-btn-box-click").on("click", function () {
        console.log("add task button clicked");
        $("body").addClass("overflow");
        $("#addTaskBox").removeClass("hidden");
    }
    );

    $(" #editTaskBox #cancelTaskCrossBtn").on("click", function () {
        console.log("cancel task button clicked");
        $("body").removeClass("overflow");
        $(".add-task-pop-box-body-content span.errorMsg").text("");

        $("#editTaskBox").addClass("hidden");
    });

    //listen to click cancelTaskBtn
    $("#editTaskBox #cancelTaskBtn").on("click", function () {
        console.log("cancel task button clicked");
        $("body").removeClass("overflow");
        $("#editTaskBox").addClass("hidden");
    }
    );


    var taskList = JSON.parse(localStorage.getItem("taskList"));

    if (taskList.length > 0) {
        for (let i = 0; i < taskList.length; i++) {
            var taskTitle = taskList[i].taskTitle;
            var startTime = taskList[i].startTime;
            var category = taskList[i].category;

            var individualTaskItem = `<li class="work-tab-task-item">
                                        <div class="work-tab-task-item-content row ">
                                            <div class="work-task-item-left-content col-md-4 d-flex justify-content-evenly align-items-center">
                                                <div class="work-task-item-icon-container">
                                                    <!-- checkbox icon -->
                                                    <!-- <i class="fas fa-check-circle"></i>
                                                     -->
                                                     <div class="work-task-item-icon-content">
                                                         <div class="container work-task-item-icon-custom-content">
                                                             <input id="task-`+ i + `" type="checkbox" class="work-task-item-checkbox" />
                                                             <label for="task-`+ i + `" class="custome-check-box"></label>
                                                         </div>
                                                     </div>
                                                </div>
                                                <div class="work-task-item-time-container">
                                                    <span class="work-task-item-time fs-5">`+ startTime + `</span>
                                                </div>
                                            </div>
                                            <div class="work-task-item-right-content col-md-8 d-flex  justify-content-between align-items-center px-3 py-1">
                                                <div class="work-task-item-category-title-container d-flex flex-column align-items-start">
                                                <div class="work-task-item-category-container">
                                                    <span class="work-task-item-category fw-lighter fs-6">`+ category + `</span>
                                                </div>
                                                <div class="work-task-item-title-container">
                                                    <span class="work-task-item-title fs-4">`+ taskTitle + `</span>
                                                </div>
                                            </div>

                                                <!-- edit and delete icon by default display none -->
                                                <div class="work-task-item-edit-and-delete-container d-flex gap-4 justify-content-end pe-2">
                                                    <div class="work-task-item-edit-container ">
                                                        <!-- anchor tag with id editIcon id with value delete icon -->
                                                        <a href="#" id="editIcon" class="work-task-item-edit-icon fs-4 text-dark" data-toggle="modal" data-target="#editTaskModal">
                                                            <i class="fa-light fa-pen-to-square"></i>
                                                        </a>
                                                    </div>
                                                    <div class="work-task-item-delete-container">
                                                        <!-- anchor tag with id deleteIcon id with value delete icon -->
                                                        <a href="#" id="deleteIcon" class="work-task-item-delete-icon fs-4 text-dark" data-toggle="modal" data-target="#deleteTaskModal">
                                                            <i class="fa-light fa-trash-can"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>`
            $(".work-tab-list-of-task-items").append(individualTaskItem);
        }
    }

    //listen to click createTaskBtn and create task in local storage
    $("#createTaskBtn").on("click", function (event) {
        console.log("create task button clicked");
        var taskTitle = $("#task-name-input").val();
        var taskDesc = $("#task-desc-input").val();
        var taskDueDate = $("#task-date-input").val();
        var startTime = $("#task-start-input").val();
        var endTime = $("#task-end-input").val();
        var category = $("#task-category-input").val();
        var type = $("#task-type-input").val();
        var status = $("#task-status-input").val();

        var task = {
            taskTitle: taskTitle,
            taskDesc: taskDesc,
            taskDueDate: taskDueDate,
            startTime: startTime,
            endTime: endTime,
            category: category,
            type: type,
            status: status
        };
        console.log(task);

        //prevent empty task from being created
        if ((taskTitle === "") || (taskDesc === "") || (taskDueDate === "") || (startTime === "") || (endTime === "") || (category === "") || (type === "") || (status === "")) {
            //prevent default behaviour

            // event.preventDefault();
            console.log("empty task");
            // if
            if (taskTitle == "") {
                console.log("empty task title");
                $(".add-task-pop-box-body-content:nth-of-type(1) span.errorMsg").text("Task title cannot be empty");
            }
            if (taskDesc === "") {
                $(".add-task-pop-box-body-content:nth-of-type(2) span.errorMsg").text("Description is empty");

            }
            if (taskDueDate === "") {
                $(".add-task-pop-box-body-content:nth-of-type(3) span.errorMsg").text("Date is empty");
            }
            if (startTime === "") {
                $(".add-task-pop-box-body-content:nth-of-type(4) span.errorMsg").text("time is empty");

            }
            if (endTime === "") {
                $(".add-task-pop-box-body-content:nth-of-type(5) span.errorMsg").text("Time is empty");

            }
            if (category === "") {
                $(".add-task-pop-box-body-content:nth-of-type(6) span.errorMsg").text("Category is empty");

            }
            if (type === "") {
                $(".add-task-pop-box-body-content:nth-of-type(7) span.errorMsg").text("Type is empty");

            }
            if (status === "") {
                $(".add-task-pop-box-body-content:nth-of-type(8) span.errorMsg").text("Status is empty");
            }

        } else {
            //create task in local storage
            if (localStorage.getItem("taskList") != null) {
                var taskList = JSON.parse(localStorage.getItem("taskList"));
                taskList.push(task);
                localStorage.setItem("taskList", JSON.stringify(taskList));
                $(".add-task-pop-box-body-content span.errorMsg").text("");
                location.reload();

            }
            else {
                var taskList = [];
                taskList.push(task);
                localStorage.setItem("taskList", JSON.stringify(taskList));
                location.reload();

            }
            // localStorage.setItem("taskList", JSON.stringify(task));
            //clear form
            $("#task-name-input").val("");
            $("#task-desc-input").val("");
            $("#task-date-input").val("");
            $("#task-start-input").val("");
            $("#task-end-input").val("");
            $("#task-category-input").val("");
            $("#task-type-input").val("");
            $("#task-status-input").val("");
            //hide form
            $("body").removeClass("overflow");
            $("#addTaskBox").addClass("hidden");
            window.location.reload();
        }

        //---------------------------------------------------------------
        //show new task on screen


    });


    //--------------------------------------------------------

    $(".work-tab-task-item").on("click", "#deleteIcon", function (event) {
        var taskList = JSON.parse(localStorage.getItem("taskList"));
        var taskId = $(this).parent().parent().parent().parent().parent().index();
        console.log(taskId);
        taskList.splice(taskId, 1);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        $(this).parent().parent().parent().parent().parent().remove();
        location.reload();

    });



    $(".work-tab-task-item").on("click", "#editIcon", function (event) {
        $("#editTaskBox").removeClass("hidden");
        $("body").addClass("overflow");
        var taskList = JSON.parse(localStorage.getItem("taskList"));
        var taskIndex = $(this).parent().parent().parent().parent().parent().index();

        $("#edit-task-name-input").val(taskList[taskIndex].taskTitle);
        $("#edit-task-desc-input").val(taskList[taskIndex].taskDesc);
        $("#edit-task-date-input").val(taskList[taskIndex].taskDueDate);
        $("#edit-task-start-input").val(taskList[taskIndex].startTime);
        $("#edit-task-end-input").val(taskList[taskIndex].endTime);
        $("#edit-task-category-input").val(taskList[taskIndex].category);
        $("#edit-task-type-input").val(taskList[taskIndex].type);
        $("#edit-task-status-input").val(taskList[taskIndex].status);

        //click listern 
        $("#editTaskBox #createTaskBtn").on("click", function (event) {
            // event.preventDefault();
            var taskTitle = $("#edit-task-name-input").val();
            var taskDesc = $("#edit-task-desc-input").val();
            var taskDate = $("#edit-task-date-input").val();
            var startTime = $("#edit-task-start-input").val();
            var endTime = $("#edit-task-end-input").val();
            var category = $("#edit-task-category-input").val();
            var taskType = $("#edit-task-type-input").val();
            var taskStatus = $("#edit-task-status-input").val();

            //prevent empty task from being created
            if ((taskTitle === "") || (taskDesc === "") || (taskDate === "") || (startTime === "") || (endTime === "") || (category === "") || (taskType === "") || (taskStatus === "")) {
                //prevent default behaviour

                event.preventDefault();
                console.log("empty task");
                // if
                if (taskTitle == "") {
                    console.log("empty task title");
                    $(".add-task-pop-box-body-content:nth-of-type(1) span.errorMsg").text("Task title cannot be empty");
                    event.preventDefault();
                }
                if (taskDesc === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(2) span.errorMsg").text("Description is empty");
                    event.preventDefault();

                }
                if (taskDate === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(3) span.errorMsg").text("Date is empty");
                }
                if (startTime === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(4) span.errorMsg").text("time is empty");

                }
                if (endTime === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(5) span.errorMsg").text("Time is empty");

                }
                if (category === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(6) span.errorMsg").text("Category is empty");

                }
                if (taskType === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(7) span.errorMsg").text("Type is empty");

                }
                if (taskStatus === "") {
                    $(".add-task-pop-box-body-content:nth-of-type(8) span.errorMsg").text("Status is empty");
                }

            } else {




                taskList[taskIndex].taskTitle = taskTitle;
                taskList[taskIndex].taskDesc = taskDesc;
                taskList[taskIndex].taskDate = taskDate;
                taskList[taskIndex].startTime = startTime;
                taskList[taskIndex].endTime = endTime;
                taskList[taskIndex].category = category;
                taskList[taskIndex].taskType = taskType;
                taskList[taskIndex].taskStatus = taskStatus;

                localStorage.setItem("taskList", JSON.stringify(taskList));
                location.reload();
            }

        });

    });








    //listen to click createAddNoteBtn and create task in local storage
    $("#createAddNoteBtn").click(function (event) {
        var noteTitle = $("#add-note-name-input").val();
        var noteDesc = $("#add-note-desc-input").val();
        var note = {
            noteTitle: noteTitle,
            noteDesc: noteDesc
        }
        if (noteTitle === "" || noteDesc === "") {
            if (noteTitle === "") {
                $("#addNoteBox .add-task-pop-box .add-task-pop-box-body .add-task-pop-box-body-content:nth-of-type(1) span.errorMsg").text("Title is empty");
                console.log("title is empty");

            }
            if (noteDesc === "") {
                $("#addNoteBox .add-task-pop-box .add-task-pop-box-body .add-task-pop-box-body-content:nth-of-type(2) span.errorMsg").text("Description is empty");

            }
        }
        else {
            //create note in local storage
            if (localStorage.getItem("noteList") != null) {
                var noteList = JSON.parse(localStorage.getItem("noteList"));
                noteList.push(note);
                localStorage.setItem("noteList", JSON.stringify(noteList));

            }
            else {
                var noteList = [];
                noteList.push(note);
                localStorage.setItem("noteList", JSON.stringify(noteList));

            }
            // localStorage.setItem("noteList", JSON.stringify(note));
            //clear form
            $("#note-name-input").val("");
            $("#note-desc-input").val("");
            //hide form
            $("body").removeClass("overflow");
            $("#addNoteBox").addClass("hidden");
        }
    });



    // click listener for accessiblity icon
    var myModal = document.getElementById('accesiblity-icon');
    const currentTheme = localStorage.getItem("theme");
    // If the current theme in localStorage is "dark"...
    const theme = document.querySelector("#theme-link");
    if (currentTheme == "dark") {
        // ...then use the .dark-theme class
        theme.href = "assests/css/dark-style.css";
        document.querySelector("#toggleThemeSwitch").checked = true;

    }


    myModal.addEventListener("click", function (event) {

        let myModalEl = document.querySelector("#accesiblity-box");
        let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);// Returns a Bootstrap modal instance
        modal.show();
        //togle theme
        let themeToggle = document.querySelector("#toggleThemeSwitch");
        // Select the stylesheet <link>
        let themeState = "";
        themeToggle.addEventListener("click", function () {
            // If the current URL contains "ligh-theme.css"
            //toggle theme.href.toggle()

            if (theme.getAttribute("href") == "") {
                // ...then change the href to "dark-theme.css"
                theme.href = "assests/css/dark-style.css";
                // localStorage.setItem("theme", "dark");
                themeState = "dark";
            } else {
                // ...otherwise change the href to "light-theme.css"
                theme.href = "";
                // localStorage.setItem("theme", "light");
                themeState = "light";
            }
        }
            , false);


        let saveAccesiblity = document.querySelector("#saveAccesiblity");
        saveAccesiblity.addEventListener("click", function () {
            modal.hide();
            localStorage.setItem("theme", themeState);

        }, false);



    });





});
