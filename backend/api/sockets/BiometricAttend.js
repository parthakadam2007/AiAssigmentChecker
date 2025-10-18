const { createSession, markAttendanceForSession } = require("../models/studentModels"); 
// importing from student models
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Teacher will start session
    socket.on("startSession", async ({ classId }) => {
      try {
        // Use your existing DB function
        const session = await createSession(classId); // returns session object with session_id
        const sessionId = session.session_id;

        socket.join(classId); // group by class
        io.to(classId).emit("sessionStarted", { classId, session_id: sessionId });
      } catch (err) {
        console.error("Error starting session:", err);
        socket.emit("error", { message: "Failed to start session" });
      }
    });

    // Student marks attendance
    socket.on("markAttendance", async ({ classId, studentId, sessionId }) => {
      try {
        // Call your existing function instead of raw SQL
        await markAttendanceForSession(studentId, sessionId, "Present", "self_mark");

        io.to(classId).emit("attendanceMarked", { studentId, sessionId });
      } catch (err) {
        console.error("Error marking attendance:", err);
        socket.emit("error", { message: "Failed to mark attendance" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
