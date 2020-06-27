function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

// Main
let updatedTask = null;

buildList()

// create or edit task on form submit
let form = document.getElementById('form');
form.addEventListener("submit", function (e) {
    e.preventDefault();

    title = document.getElementById("title").value;
    console.log(title);

    let url = "api/task-create/";
    if (updatedTask != null) {
        url = `api/task-update/${updatedTask.id}/`;
        updatedTask = null;
    }
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({ "title": title })
    }).then((response) => {
        buildList();
        form.reset();
    });
});

function buildList() {
    let listWrapper = document.getElementById("list-wrapper");

    // Don't put it here.
    // Clear the wrapper after fetching, unless there might be a refresh list glitch.
    // listWrapper.innerHTML = "";

    let url = "api/task-list/";
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log("Data:", data);

            listWrapper.innerHTML = "";

            for (let i in data) {
                let title = `<p class="title">${data[i].title}</p>`;
                if (data[i].completed) {
                    title = `<strike><p class="title">${data[i].title}</p></strike>`;
                }
                let item = `
                <div id="task-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex: 7;">
                        ${title}
                    </div>
                    <div style="flex: 1;">
                        <button class="btn btn-outline-info btn-sm edit-btn">Edit</button>
                    </div>
                    <div style="flex: 1;">
                        <button class="btn btn-outline-secondary btn-sm delete-btn">Delete</button>
                    </div>
                </div>
                `;
                listWrapper.innerHTML += item;
            }
            for (let i in data) {
                document.getElementsByClassName("edit-btn")[i].addEventListener("click", function () {
                    editTask(data[i]);
                });
                document.getElementsByClassName("delete-btn")[i].addEventListener("click", function () {
                    deleteTask(data[i]);
                });
                document.getElementsByClassName("title")[i].addEventListener("click", function () {
                    strikeUnstrike(data[i]);
                });
            }
        });
}

function editTask(task) {
    console.log("Update:", task);
    updatedTask = task;
    document.getElementById("title").value = task.title;
}

function deleteTask(task) {
    console.log("Delete:", task);
    let url = `api/task-delete/${task.id}/`;
    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        }
    }).then((response) => {
        buildList();
    });
}

function strikeUnstrike(task) {
    console.log("Complete:", task);
    let url = `api/task-update/${task.id}/`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({ "title": task.title, "completed": !task.completed })
    }).then((response) => {
        buildList();
    });
}
