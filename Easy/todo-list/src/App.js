import React, { useState, useMemo } from 'react';
import {
  CssBaseline,
  Container,
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Modal,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  // Ensure categories is defined. For example, as a static array:
  const categories = ['Work', 'Personal', 'Other']; // Added definition
  const [selectedCategory, setSelectedCategory] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Ensure this is defined
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newSubtaskName, setNewSubtaskName] = useState('');

  // Define modalStyle
  const modalStyle = { // Added definition
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

  const theme = useMemo(() => createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  }), [darkMode]);

  const handleToggleDarkMode = () => setDarkMode(!darkMode);

  const addTask = () => {
    if (!taskName || !dueDate || !taskDescription) return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      dueDate,
      priority,
      category: selectedCategory,
      description: taskDescription,
      subtasks: [],
      completed: false,
    };

    setTasks([...tasks, newTask]);
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setDueDate('');
    setPriority('Medium');
    setSelectedCategory('');
    setTaskDescription('');
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));

  const handleModalOpen = (id) => {
    setCurrentTaskId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false); // Added definition

  const calculateTimeLeft = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeLeft = due - now;
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Due!';
  };

  const toggleSubtaskCompletion = (taskId, subtaskId) => { // Added definition
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask => {
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

  const addNewSubtask = (subtaskName) => { // Added definition
    if (!subtaskName.trim()) return;
    const updatedTasks = tasks.map(task => {
      if (task.id === currentTaskId) {
        const newSubtask = { id: Date.now(), name: subtaskName, completed: false };
        return { ...task, subtasks: [...task.subtasks, newSubtask] };
      }
      return task;
    });
    setTasks(updatedTasks);
    setNewSubtaskName('');
  };

  const currentTask = tasks.find(task => task.id === currentTaskId);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ padding: '20px', marginTop: '20px', boxShadow: 3 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Todo List
        </Typography>
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
        </div>
        
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              dense
              style={{
                backgroundColor: darkMode ? '#555' : '#fff',
                color: darkMode ? '#fff' : '#000',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.id}` }}
              />
              <ListItemText
                id={`checkbox-list-label-${task.id}`}
                primary={task.name}
                secondary={`${calculateTimeLeft(task.dueDate)} - Priority: ${['High', 'Medium', 'Low'][priority]} - Category: ${task.category}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="details" onClick={() => handleModalOpen(task.id)}>
                  <MoreVertIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
  
        <Button onClick={handleToggleDarkMode} style={{ marginTop: '10px' }}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
  
        {openModal && (
          <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="task-details-modal" aria-describedby="task-details-description">
            <Box sx={modalStyle}>
              {currentTask && (
                <>
                  <Typography variant="h6">Task Details</Typography>
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
        )}
      </Container>
    </ThemeProvider>
  );  
}

export default App;