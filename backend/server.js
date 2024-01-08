//'mongodb://127.0.0.1:27017/PCPMOBILE'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'PCP'); // Use your secret key here
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


app.use(bodyParser.json());

// Enable CORS for the React Native app
app.use(cors({
  origin: 'exp://192.168.0.101:8081',
}));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/PCPMOBILE', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sairajdeep1454@gmail.com', // Your Gmail email address
    pass: 'jdoyyiqzrupcspkc', // Your Gmail password or an app-specific password
  },
});
// Define a user schema
// Define a user schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  employeeId: String,
  password: String,
  role: String,
  assignedTeamLead: {
    teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
  },

  assignedSurveys: [
    {
      surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
      title: String,
    },
  ],
  surveyResponses: [
    {
      surveyTitle: String,
      responses: [
        {
          question: String,
          answer: String,
        },
      ],
      reviews: [
        {
          rating: { type: Number, min: 1, max: 5 }, // Add rating field
          reviewText: String,
        },
      ],// Add a reviews field to store team lead reviews
    },
  ],

  
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangeCount: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', UserSchema);




// Survey Schema
// Survey Schema
const SurveySchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      type: { type: String, enum: ['text', 'mcq'] }, // Updated enum values
      options: [String],
      answer: String,
    },
  ],
  accessibleUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


const Survey = mongoose.model('Survey', SurveySchema);
const suggestionSchema = new mongoose.Schema({
  content: String,
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);
app.post('/surveyresponse', async (req, res) => {
  try {
    const { userId, surveyTitle, responses } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has responses for this surveyTitle
    const existingSurveyResponseIndex = user.surveyResponses.findIndex(
      (response) => response.surveyTitle === surveyTitle
    );

    if (existingSurveyResponseIndex !== -1) {
      // Update existing survey response
      user.surveyResponses[existingSurveyResponseIndex].responses = responses;
    } else {
      // Add new survey response
      user.surveyResponses.push({ surveyTitle, responses });
    }

    // Save the user document
    await user.save();

    // Remove the user from the accessibleUsers list for the survey
    const survey = await Survey.findOne({ title: surveyTitle });
    if (survey) {
      // Remove the user's ID from the accessibleUsers array
      survey.accessibleUsers = survey.accessibleUsers.filter((id) => id.toString() !== userId);
      await survey.save();
    }

    res.status(200).json({ message: 'Survey response saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving survey response' });
  }
});
app.post('/submit-suggestion', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const newSuggestion = new Suggestion({ content });
    await newSuggestion.save();

    res.status(200).json({ message: 'Suggestion submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/get-suggestions', async (req, res) => {
  try {
    const suggestions = await Suggestion.find();
    res.status(200).json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to handle team lead submission of reviews
// ... (existing code)
// Add this route to fetch saved surveys
app.get('/admin/savedsurveys', async (req, res) => {
  try {
    const savedSurveys = await Survey.find();
    res.status(200).json(savedSurveys);
  } catch (error) {
    console.error('Error fetching saved surveys:', error.message);
    res.status(500).json({ message: 'Error fetching saved surveys' });
  }
});

// Route to handle submitting a review
app.post('/submitreview', async (req, res) => {
  try {
    const { username, surveyTitle, review } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the survey response for the given title
    const surveyResponse = user.surveyResponses.find(
      (response) => response.surveyTitle === surveyTitle
    );

    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }

    // Add the review to the survey response
    surveyResponse.reviews.push(review);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Backend: Add a route to fetch user profile details

// Import necessary modules and libraries (already imported in your code)

// ... (existing code)

// Fetch user profile details
app.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      username: user.username,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      assignedTeamLead: user.assignedTeamLead,
      assignedSurveys: user.assignedSurveys,
      surveyResponses: user.surveyResponses,
      // Add any other fields you want to include in the profile
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// ... (existing code)

// Route to handle deleting a review
app.post('/deletereview', async (req, res) => {
  try {
    const { username, surveyTitle } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the survey response for the given title
    const surveyResponse = user.surveyResponses.find(
      (response) => response.surveyTitle === surveyTitle
    );

    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }

    // Clear the reviews array for the survey response
    surveyResponse.reviews = [];

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

// ... (existing code)

// Inside your existing Express app

// ... (existing code)

// Add this route to handle deleting surveys from both User and Survey schemas

// ... (existing code)

// Route to handle survey upload
// Updated backend code
// Add this route to delete a survey
app.delete('/admin/surveys/:surveyId', async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    // Check if the survey exists
    const existingSurvey = await Survey.findById(surveyId);
    if (!existingSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Delete the survey from the Survey schema
    await Survey.findByIdAndDelete(surveyId);

    // Update the assignedSurveys field for each user
    const usersToUpdate = await User.find({ 'assignedSurveys.surveyId': surveyId });

    usersToUpdate.forEach(async (user) => {
      user.assignedSurveys = user.assignedSurveys.filter((survey) => survey.surveyId.toString() !== surveyId);
      await user.save();
    });

    res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ message: 'Error deleting survey' });
  }
});



// ... (existing code)
// Add this route to support searching team leads
app.get('/teamleads', async (req, res) => {
  try {
    const { search } = req.query;
   // Log the search query
    const query = search ? { username: { $regex: search, $options: 'i' } } : {};
    const teamLeads = await User.find({ ...query, role: 'teamlead' });
     // Log the fetched team leads
    res.status(200).json(teamLeads);
  } catch (error) {
    console.error('Error fetching team leads:', error.message);
    res.status(500).json({ message: 'Error fetching team leads' });
  }
});

// ... (existing code)
// Add this route to fetch survey responses and calculate percentages
app.get('/admin/surveys/:surveyId/responses', async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const survey = await Survey.findById(surveyId);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Get all survey responses
    const surveyResponses = await User.find({ 'surveyResponses.surveyTitle': survey.title });

    // Calculate percentages for each question
    const percentages = survey.questions.map((question) => {
      const totalResponses = surveyResponses.length;
      const optionCounts = {};
      
      // Count the number of times each option is chosen
      surveyResponses.forEach((response) => {
        const userResponse = response.surveyResponses.find((sr) => sr.surveyTitle === survey.title);
        if (userResponse) {
          const userAnswer = userResponse.responses.find((r) => r.question === question.question);
          if (userAnswer) {
            optionCounts[userAnswer.answer] = (optionCounts[userAnswer.answer] || 0) + 1;
          }
        }
      });

      // Calculate percentages
      const percentagesForQuestion = {};
      Object.keys(optionCounts).forEach((option) => {
        percentagesForQuestion[option] = (optionCounts[option] / totalResponses) * 100;
      });

      return {
        question: question.question,
        percentages: percentagesForQuestion,
      };
    });

    res.status(200).json({ surveyTitle: survey.title, percentages });
  } catch (error) {
    console.error('Error fetching survey responses:', error.message);
    res.status(500).json({ message: 'Error fetching survey responses' });
  }
});

// Fetch assigned users for a team lead
app.get('/teamleads/:teamLeadId', async (req, res) => {
  try {
    const teamLeadId = req.params.teamLeadId;
    const teamLead = await User.findById(teamLeadId);

    if (!teamLead || teamLead.role !== 'teamlead') {
      return res.status(404).json({ message: 'Team Lead not found' });
    }

    const assignedUsers = await User.find({ 'assignedTeamLead.teamLeadId': teamLead._id });
    res.status(200).json(assignedUsers);
  } catch (error) {
    console.error('Error fetching assigned users for team lead:', error.message);
    res.status(500).json({ message: 'Error fetching assigned users for team lead' });
  }
});

// ... (existing code)

// Route to handle team lead assignment
app.post('/assignteamlead', async (req, res) => {
  try {
    const { username, teamLeadUsername } = req.body;

    // Find the user and team lead by their usernames
    const user = await User.findOne({ username });
    const teamLead = await User.findOne({ username: teamLeadUsername, role: 'teamlead' });

    if (!user || !teamLead) {
      return res.status(404).json({ message: 'User or Team Lead not found' });
    }

    // Assign the team lead to the user (you can customize this logic based on your data structure)
    user.assignedTeamLead = { teamLeadId: teamLead._id, username: teamLead.username };
    await user.save();

    res.status(200).json({ message: 'Team Lead assigned successfully' });
  } catch (error) {
    console.error('Error assigning team lead:', error.message);
    res.status(500).json({ message: 'Error assigning team lead' });
  }
});

// ... (existing code)



// Add this route to handle team lead assignment
// Add this route to handle team lead assignment
app.post('/assignteamlead', async (req, res) => {
  try {
    const { username, teamLeadUsername } = req.body;

    // Find the user and team lead by their usernames
    const user = await User.findOne({ username });
    const teamLead = await User.findOne({ username: teamLeadUsername, role: 'teamlead' });

    if (!user || !teamLead) {
      return res.status(404).json({ message: 'User or Team Lead not found' });
    }

    // Assign the team lead to the user (you can customize this logic based on your data structure)
    user.assignedTeamLead = { teamLeadId: teamLead._id, username: teamLead.username };
    await user.save();

    res.status(200).json({ message: 'Team Lead assigned successfully' });
  } catch (error) {
    console.error('Error assigning team lead:', error.message);
    res.status(500).json({ message: 'Error assigning team lead' });
  }
});

// Route to handle survey upload
app.post('/surveys', async (req, res) => {
  try {
    const { title, questions, accessibleUsers } = req.body;

    if (!title || !questions || questions.length === 0 || !accessibleUsers) {
      return res.status(400).json({ message: 'Title, questions, and accessibleUsers are required' });
    }

  // When assigning a survey to a user
const newSurvey = new Survey({ title, questions, accessibleUsers });
await newSurvey.save();

// Update the assignedSurveys field for each user
const usersToUpdate = await User.find({ _id: { $in: accessibleUsers } });

usersToUpdate.forEach(async (user) => {
  user.assignedSurveys.push({ surveyId: newSurvey._id, title: newSurvey.title });
  await user.save();
});

// Respond with success message
res.status(201).json({ message: 'Survey uploaded successfully' });

  } catch (error) {
    console.error('Error uploading survey:', error.message);
    res.status(500).json({ message: 'Error uploading survey' });
  }
});


// ... (existing code)
// Updated backend code

// ... (existing code)

// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ... (existing code)
// Modify the '/userdetails/:userId' endpoint in your backend code

// Modify the '/userdetails/:username' endpoint in your backend code

app.get('/userdetails/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Include survey responses in the response
    const userDetails = {
      username: user.username,
      employeeId: user.employeeId,
      email: user.email,
      surveyResponses: user.surveyResponses,
      
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});


app.get('/usersadmin', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Add this route to fetch assigned team lead details
app.get('/userdetails/:username/assignedteamlead', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const assignedTeamLeadDetails = {
      teamLeadId: user.assignedTeamLead.teamLeadId,
      teamLeadUsername: user.assignedTeamLead.username,
    };

    res.status(200).json(assignedTeamLeadDetails);
  } catch (error) {
    console.error('Error fetching assigned team lead details:', error.message);
    res.status(500).json({ message: 'Error fetching assigned team lead details' });
  }
});



const secretKey = 'PCP';

// Admin Signup
app.post('/auth/adminsignup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await User.findOne({ username, role: 'admin' });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({ username, password: hashedPassword, role: 'admin' });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// User Signup
// User Signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, employeeId, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }, { employeeId }] });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, employeeId, password: hashedPassword, role: 'user' });
    await user.save();

    // Send confirmation email to the user
    const mailOptions = {
      from: 'hr@example.com', // HR's email address
      to: user.email, // User's email address
      subject: 'Account Registration Confirmation',
      text: `Hello ${user.username},\n\nAn HR representative has created an account for you. Your account has been successfully registered.\n\nUsername: ${user.username}\nEmployee ID: ${user.employeeId}\nPassword: ${password}\n\n    Don't forget to update your password. If you have any questions or concerns, please contact HR at hr@example.com.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({ message: 'Error sending confirmation email' });
      } else {
        console.log('Confirmation email sent:', info.response);
        res.status(201).json({ message: 'User created successfully', userId: user._id });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Add this route to handle deleting a survey response
app.delete('/deletesurveyresponse', async (req, res) => {
  try {
    const { username, surveyTitle } = req.body;

    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the survey response for the given title
    const surveyResponseIndex = user.surveyResponses.findIndex(
      (response) => response.surveyTitle === surveyTitle
    );

    if (surveyResponseIndex === -1) {
      return res.status(404).json({ message: 'Survey response not found' });
    }

    // Remove the survey response from the array
    user.surveyResponses.splice(surveyResponseIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Survey response deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey response:', error);
    res.status(500).json({ message: 'Error deleting survey response' });
  }
});


// Import necessary modules and libraries (already imported in your code)

// ... (existing code)

// Update Password route
// Update Password route without authenticateUser middleware
// Update Password route
app.put('/auth/updatepassword', async (req, res) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;
    console.log('User ID:', userId);

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password provided matches the user's current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and password change timestamp in the database
    user.passwordChangeCount += 1;
    user.passwordChangedAt = Date.now(); // Add this line to update the password change timestamp
    user.password = hashedNewPassword; // Update the user's password with the new hashed password
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating password' });
  }
});

// ... (existing code)


// Assuming this is in your existing backend code

// Team Lead Signup
// Team Lead Signup
app.post('/auth/teamleadsignup', async (req, res) => {
  try {
    const { username, email, employeeId, password } = req.body;

    // Check if the Team Lead already exists
    const existingTeamLead = await User.findOne({ username, role: 'teamlead' });
    if (existingTeamLead) {
      return res.status(409).json({ message: 'Team Lead already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Team Lead user
    const teamLead = new User({ username, email, employeeId, password: hashedPassword, role: 'teamlead' });
    await teamLead.save();

    // Send confirmation email to the Team Lead
    const mailOptions = {
      from: 'hr@example.com', // HR's email address
      to: teamLead.email, // Team Lead's email address
      subject: 'Team Lead Registration Confirmation',
      text: `Hello ${teamLead.username},\n\nYour Team Lead account has been successfully registered.\n\nUsername: ${teamLead.username}\nEmployee ID: ${teamLead.employeeId}\n\nThank you for being a part of our team.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({ message: 'Error sending confirmation email' });
      } else {
        console.log('Confirmation email sent:', info.response);
        res.status(201).json({ message: 'Team Lead created successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Team Lead' });
  }
});

// Login route
// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const { username, employeeId, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { employeeId }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        userId: user._id,
      },
      secretKey,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({
      message: `${user.role} authentication successful`,
      role: user.role,
      username: user.username,
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error authenticating user' });
  }
});

// Add a route to fetch all surveys
// Fetch all surveys
app.get('/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error.message);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
});



// Add this route to fetch all surveys
app.get('/admin/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error.message);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});