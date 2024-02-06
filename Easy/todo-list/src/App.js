import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Modal, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [categories, setCategories] = useState(['Work', 'Personal', 'Other']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newSubtaskName, setNewSubtaskName] = useState('');

  // Function to handle opening the modal for task details
  const handleOpenModal = (taskId) => {
    setCurrentTaskId(taskId);
    setOpenModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    // Sort tasks whenever there's a change
    const sortedTasks = tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        if (a.priority === b.priority) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return a.priority - b.priority;
      }
      return a.completed ? 1 : -1;
    });
    setTasks([...sortedTasks]);
  }, [tasks]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#303030' : '#FFFFFF';
    document.body.style.color = darkMode ? '#FFFFFF' : '#303030';
  }, [darkMode]);

  // Add a new task
  const addTask = () => {
    if (!taskName || !dueDate || !taskDescription) return;
    const newTask = {
      id: Math.floor(Math.random() * 10000),
      name: taskName,
      dueDate: new Date(dueDate),
      priority: ['High', 'Medium', 'Low'].indexOf(priority),
      category: selectedCategory,
      description: taskDescription,
      subtasks: [], 
      completed: false,
    };
    setTasks([...tasks, newTask]);
    // Reset form fields
    setTaskName('');
    setDueDate('');
    setPriority('Medium');
    setSelectedCategory('');
    setTaskDescription('');
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Function to add a new subtask
  const addNewSubtask = (subtaskName) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === currentTaskId) {
        const newSubtask = {
          id: Math.floor(Math.random() * 10000),
          name: subtaskName,
          completed: false,
        };
        return { ...task, subtasks: [...task.subtasks, newSubtask] };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Function to toggle subtask completion
  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask.id === subtaskId) {
            return { ...subtask, completed: !subtask.completed };
          }
          return subtask;
        });
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Calculate time left
  const calculateTimeLeft = (dueDate) => {
    const now = new Date();
    const timeLeft = dueDate - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Due!';
  };

  const currentTask = tasks.find(task => task.id === currentTaskId);

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Container maxWidth="sm">
      <h1>Todo List</h1>
      <div>
        <TextField
          label="Task Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </TextField>
        <div>
          <ReactQuill value={taskDescription} onChange={setTaskDescription} />
        </div>
        <Button variant="contained" color="primary" onClick={addTask} fullWidth>
          Add Task
        </Button>
        <Button onClick={() => setDarkMode(!darkMode)} style={{ marginTop: '10px' }}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} dense style={{ backgroundColor: darkMode ? '#555' : '#fff', color: darkMode ? '#fff' : '#000' }}>
            <Checkbox
              edge="start"
              checked={task.completed}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.id}` }}
              onClick={() => toggleCompletion(task.id)}
            />
            <ListItemText id={`checkbox-list-label-${task.id}`} primary={task.name} secondary={`${calculateTimeLeft(task.dueDate)} - Priority: ${['High', 'Medium', 'Low'][task.priority]}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="details" onClick={() => handleOpenModal(task.id)}>
                <MoreVertIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Task Details</Typography>
          {currentTask && (
            <>
              <Typography variant="subtitle1">{currentTask.name}</Typography>
              <ReactQuill theme="snow" value={currentTask.description || ''} readOnly={true} />
              <Typography variant="subtitle2" style={{ marginTop: '20px' }}>Subtasks:</Typography>
              <List>
                {currentTask.subtasks.map((subtask, index) => (
                  <ListItem key={index} dense>
                    <Checkbox
                      edge="start"
                      checked={subtask.completed}
                      onChange={() => toggleSubtaskCompletion(currentTask.id, subtask.id)}
                      tabIndex={-1}
                    />
                    <ListItemText primary={subtask.name} />
                  </ListItem>
                ))}
              </List>
              <TextField
                label="New Subtask"
                variant="outlined"
                fullWidth
                value={newSubtaskName}
                onChange={(e) => setNewSubtaskName(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addNewSubtask(newSubtaskName);
                  setNewSubtaskName('');
                }}
                fullWidth
              >
                Add Subtask
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default App;