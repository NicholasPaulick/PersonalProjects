import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

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

  // Add a new task
  const addTask = () => {
    if (!taskName || !dueDate) return;
    const newTask = {
      id: Math.floor(Math.random() * 10000),
      name: taskName,
      dueDate: new Date(dueDate),
      priority: ['High', 'Medium', 'Low'].indexOf(priority), // Convert to numeric priority
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setDueDate('');
    setPriority('Medium');
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Calculate time left
  const calculateTimeLeft = (dueDate) => {
    const now = new Date();
    const timeLeft = dueDate - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Due!';
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
        <Button variant="contained" color="primary" onClick={addTask} fullWidth>
          Add Task
        </Button>
      </div>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} dense button onClick={() => toggleCompletion(task.id)} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <Checkbox
              edge="start"
              checked={task.completed}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.id}` }}
            />
            <ListItemText id={`checkbox-list-label-${task.id}`} primary={task.name} secondary={`${calculateTimeLeft(task.dueDate)} - Priority: ${['High', 'Medium', 'Low'][task.priority]}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;

