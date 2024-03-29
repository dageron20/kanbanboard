const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;

const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:8080",
    },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
    pending: {
        title: "pending",
        items: [
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
            {
                id: fetchID(),
                title: "Review GitHub Denis",
                comments: [
                    {
                        name: "Denis",
                        text: "Test test",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
    work: {
        title: "work",
        items: [
            {
                id: fetchID(),
                title: "someone easy",
                comments: [
                    {
                        name: "Denis",
                        text: "Make sure you check the requirements",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
    completed: {
        title: "completed",
        items: [
            {
                id: fetchID(),
                title: "someone easy",
                comments: [
                    {
                        name: "Denis",
                        text: "Make sure you check the requirements",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
};


socketIO.on("connection", (socket) => {
    console.log(`${socket.id} user just connected!`);

    socket.on("createTask", (data) => {
        const newTask = { id: fetchID(), title: data.task, comments: [] };
        tasks["pending"].items.push(newTask);
        socket.emit("tasks", tasks);
    });

    socket.on("taskDragged", (data) => {
        const { source, destination } = data;
        const itemMoved = {
            ...tasks[source.droppableId].items[source.index],
        };
        console.log("ItemMoved>>> ", itemMoved);
        tasks[source.droppableId].items.splice(source.index, 1);
        tasks[destination.droppableId].items.splice(
            destination.index,
            0,
            itemMoved
        );
        console.log("Source >>>", tasks[source.droppableId].items);
        console.log("Destination >>>", tasks[destination.droppableId].items);
        socket.emit("tasks", tasks);
    });

    socket.on("fetchComments", (data) => {
        const taskItems = tasks[data.category].items;
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id === data.id) {
                socket.emit("comments", taskItems[i].comments);
            }
        }
    });
    socket.on("addComment", (data) => {
        const taskItems = tasks[data.category].items;
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id === data.id) {
                taskItems[i].comments.push({
                    name: data.userId,
                    text: data.comment,
                    id: fetchID(),
                });
                socket.emit("comments", taskItems[i].comments);
            }
        }
    });
    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔥: A user disconnected");
    });
});

app.get("/api", (req, res) => {
    res.json(tasks);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});