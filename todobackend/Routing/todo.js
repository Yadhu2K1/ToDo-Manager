const express = require("express");
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { description, status, projectId } = req.body;
    const created_date = new Date();
    const updated_date = new Date();
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "INSERT INTO todo (description, status, created_date, updated_date, project_id) VALUES (?, ?, ?, ?, ?)",
      [description, status, created_date, updated_date, projectId]
    );

    res.json({
      message: "Todo created successfully",
      todoId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});


router.post("/fetch", async (req, res) => {
  try {
    const { projectId } = req.body;
    const connection = req.app.locals.connection;
    const [todos] = await connection.query(
      "SELECT * FROM todo WHERE project_id = ? ORDER BY created_date DESC",
      [projectId]
    );
    res.json({
      message: "Todos fetched successfully",
      todos: todos,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});


router.post("/update", async (req, res) => {
  try {
    const { id, description, status } = req.body;
    const updated_date = new Date();
    const connection = req.app.locals.connection;

  
    const updates = [];
    const params = [];

    if (description) {
      updates.push("description = ?");
      params.push(description);
    }

    if (status) {
      updates.push("status = ?");
      params.push(status);
    }

    updates.push("updated_date = ?");
    params.push(updated_date);

    params.push(id);

    const query = `UPDATE todo SET ${updates.join(", ")} WHERE id = ?`;

    const [result] = await connection.query(query, params);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No todo found with the given id" });
    } else {
      res.json({
        message: "Todo updated successfully",
        affectedRows: result.affectedRows,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});



router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const connection = req.app.locals.connection;
    const [result] = await connection.query("DELETE FROM todo WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No todo found with the given id" });
    } else {
      res.json({
        message: "Todo deleted successfully",
        affectedRows: result.affectedRows,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});


module.exports = router;
