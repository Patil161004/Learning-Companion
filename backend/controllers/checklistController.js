import ChecklistItem from '../models/ChecklistItem.js';

export const getChecklist = async (req, res) => {
  try {
    const checklist = await ChecklistItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching checklist', error: error.message });
  }
};

export const addChecklistItem = async (req, res) => {
  try {
    const newItem = new ChecklistItem({
      user: req.user.id,
      title: req.body.title,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error adding checklist item', error: error.message });
  }
};

export const updateChecklistItem = async (req, res) => {
  try {
    const updatedItem = await ChecklistItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { isCompleted: req.body.isCompleted } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating checklist item', error: error.message });
  }
};

export const deleteChecklistItem = async (req, res) => {
  try {
    const deletedItem = await ChecklistItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }
    res.json({ message: 'Checklist item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting checklist item', error: error.message });
  }
};