//'mongodb://127.0.0.1:27017/PCPMOBILE'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');

const app = express();
const port = process.env.PORT || 3000;
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'PCP'); 
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


app.use(bodyParser.json());


app.use(cors({
  origin: 'exp:10.113.34.148//:8081',
}));


mongoose.connect('mongodb://127.0.0.1:27017/PCPMOBILE', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sairajdeep1454@gmail.com', 
    pass: 'eewx azan baey rsxc',
  },
});


const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  employeeId: String,
  phoneNumber: String, 
  password: String,
  resetPasswordOTP: String, 

  role: String,

  assignedTeamLead: {
    teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
  },
  surveyCount: {
    type: Number,
    default: 0,
  },
  totalLeaves: { type: Number, default: 30 },
  remainingLeaves: { type: Number, default: 30 },
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
          rating: { type: Number, min: 1, max: 5 }, 
          reviewText: String,
        },
      ],
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

const BackupResponseSchema = new mongoose.Schema({
  username: String,
  surveyTitle: String,
  responses: [
    {
      question: String,
      answer: String,
    },
  ],
  ratings: [
    {
      rating: Number,
      reviewText: String,
    },
  ],
  assignedTeamLead: {
    teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
  },
 
});

const BackupResponse = mongoose.model('BackupResponse', BackupResponseSchema);







const SurveySchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      type: { type: String, enum: ['text', 'mcq'] }, 
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

const chatMessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const LeaveSchema = new mongoose.Schema({
  username: String,
  startDate: Date,
  endDate: Date,
  reason: String,
  teamLead: {
    teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    email: String,
  },
  numberOfDays: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

const Leave = mongoose.model('Leave', LeaveSchema);
const DefaultLeaveSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  reason: String,
});

const DefaultLeave = mongoose.model('DefaultLeave', DefaultLeaveSchema);
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}app.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

  
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const otp = generateOTP();

    
    user.resetPasswordOTP = otp;
    await user.save();

    
    const mailOptions = {
      from: 'noreply@example.com',
      to: email,
      subject: 'Reset Password OTP',
      text: `Your OTP for resetting the password is ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending OTP' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

app.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

  
    const user = await User.findOne({ email });

    if (!user || user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

  
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = null; 
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

app.post('/admin/upload-default-leaves', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    
    
    const defaultLeave = new DefaultLeave({ startDate, endDate, reason });
    await defaultLeave.save();

    res.status(201).json({ message: 'Default leaves uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/leave/default-leaves', authenticateUser, async (req, res) => {
  try {
    
    const defaultLeaves = await DefaultLeave.find({});
    res.json(defaultLeaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/admin/update-total-leaves', authenticateUser, async (req, res) => {
  try {
    const { totalLeaves } = req.body;

    
    const prevTotalLeavesDoc = await User.findOne({}, { totalLeaves: 1 });
    const prevTotalLeaves = prevTotalLeavesDoc.totalLeaves;

    
    const leavesDifference = totalLeaves - prevTotalLeaves;

   
    await User.updateMany({}, { totalLeaves });

    
    await User.updateMany({}, { $inc: { remainingLeaves: leavesDifference } });

    res.status(200).json({ message: 'Total leaves updated successfully for all users' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/leave/status', authenticateUser, async (req, res) => {
  try {
    const username = req.user.username;
    
    const leaveStatus = await Leave.find({ username }, { startDate: 1, endDate: 1, status: 1 });
    res.json(leaveStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/leave/all/approved/:username', async (req, res) => {
  try {
    const { username } = req.params;

    
    const approvedLeaves = await Leave.find({
      username,
      status: 'approved',
    });

    res.json(approvedLeaves);
  } catch (error) {
    console.error('Error fetching approved leaves:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/leave', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const username = req.user.username;

   
    const user = await User.findOne({ username });
    if (!user || user.remainingLeaves <= 0) {
      return res.status(400).json({ error: 'No remaining leaves available. Leave limit exceeded.' });
    }

   
    const existingLeave = await Leave.findOne({ username, startDate: { $lte: endDate }, endDate: { $gte: startDate } });
    if (existingLeave) {
      return res.status(400).json({ error: 'You have already applied for leave during these dates' });
    }

   
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;

    if (user.remainingLeaves < numberOfDays) {
      return res.status(400).json({ error: 'Not enough remaining leaves. Leave limit exceeded.' });
    }
app.get('/leave/remaining/:username', async (req, res) => {
  const { username } = req.params;

  try {
   
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    const remainingLeaves = user.remainingLeaves;

    res.json({ remainingLeaves });
  } catch (error) {
    console.error('Error fetching remaining leaves:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
    user.remainingLeaves -= numberOfDays;
    await user.save();

    
    const teamLead = user.assignedTeamLead;

    
    const teamLeadUser = await User.findById(teamLead.teamLeadId);
    const teamLeadEmail = teamLeadUser.email;

    const newLeave = new Leave({ username, startDate, endDate, reason, teamLead, numberOfDays });

   
    await newLeave.save();

   
    await sendEmailToTeamLead(teamLeadEmail, username, startDate, endDate, reason);

    
    res.status(201).json({ message: 'Leave request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/leave/remaining/:username', async (req, res) => {
  const { username } = req.params;

  try {
   
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    const remainingLeaves = user.remainingLeaves;

    res.json({ remainingLeaves });
  } catch (error) {
    console.error('Error fetching remaining leaves:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/leave/leaves-info', authenticateUser, async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    res.json({ totalLeaves: user.totalLeaves, remainingLeaves: user.remainingLeaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const sendEmailToTeamLead = async (teamLeadEmail, username, startDate, endDate, reason) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sairajdeep1454@gmail.com', 
        pass: 'eewx azan baey rsxc', 
      },
    });

    const mailOptions = {
      from: 'sairajdeep1454@gmail.com',
      to: teamLeadEmail,
      subject: 'Leave Request',
      text: `Dear Team Lead,\n\n${username} has applied for leave from ${startDate} to ${endDate} for the reason: ${reason}.\n\nRegards,\nLeave Management System`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to team lead');
  } catch (error) {
    console.error('Error sending email to team lead:', error);
  }
};

app.get('/leave/all/applied', authenticateUser, async (req, res) => {
  try {
    const username = req.user.username;
    const leaves = await Leave.find({ username });
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/leave/all/:username', authenticateUser, async (req, res) => {
  try {
    const { username } = req.params;
   
    const leaves = await Leave.find({ username });
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/leave/update/:leaveId', authenticateUser, async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, reason } = req.body; 

  
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

   
    await Leave.findByIdAndUpdate(leaveId, { status, reason });

   
    const user = await User.findOne({ username: leave.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    if (status === 'rejected') {
      user.remainingLeaves += leave.numberOfDays;
      await user.save();
    }

   
    await sendEmailToUser(user.email, leave.startDate, leave.endDate, status, reason);

    
    if (status === 'rejected') {
      await Leave.findByIdAndDelete(leaveId);
    }

    res.status(200).json({ message: 'Leave status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



const sendEmailToUser = async (userEmail, startDate, endDate, status, reason) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sairajdeep1454@gmail.com', 
        pass: 'eewx azan baey rsxc',
      },
    });

    let subject, text;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formattedStartDate = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()}`;
    const formattedEndDate = `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`;

    if (status === 'approved') {
      subject = 'Leave Approved';
      text = `Your leave request from ${formattedStartDate} to ${formattedEndDate} (${calculateDays(startDate, endDate)} days) has been approved.\n\nRegards,\nLeave Management System`;
    } else {
      subject = 'Leave Rejected';
      text = `Your leave request from ${formattedStartDate} to ${formattedEndDate} (${calculateDays(startDate, endDate)} days) has been rejected.\nReason: ${reason}\n\nRegards,\nLeave Management System`;
    }

    const mailOptions = {
      from: 'sairajdeep1454@gmail.com',
      to: userEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to user');
  } catch (error) {
    console.error('Error sending email to user:', error);
  }
};



const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end.getTime() - start.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
};




app.get('/chat/:receiverUsername', authenticateUser, async (req, res) => {
  try {
    const senderUsername = req.user.username;
    const receiverUsername = req.params.receiverUsername;

    
    const messages = await ChatMessage.find({
      $or: [
        { sender: senderUsername, receiver: receiverUsername },
        { sender: receiverUsername, receiver: senderUsername },
      ],
    }).sort({ createdAt: 'asc' });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error.message);
    res.status(500).json({ message: 'Error fetching chat messages' });
  }
});


app.post('/chat', authenticateUser, async (req, res) => {
  try {
    const { receiverUsername, message } = req.body;
    const senderUsername = req.user.username;

   
    const newMessage = new ChatMessage({ sender: senderUsername, receiver: receiverUsername, message });
    await newMessage.save();

    res.status(201).json({ message: 'Chat message sent successfully' });
  } catch (error) {
    console.error('Error sending chat message:', error.message);
    res.status(500).json({ message: 'Error sending chat message' });
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
app.post('/admin/savedsurveys', async (req, res) => {
  const { title, questions } = req.body;

  try {
    const newSurvey = new Survey({ title, questions });
    await newSurvey.save();

    res.status(201).json(newSurvey);
  } catch (error) {
    console.error('Error creating survey:', error.message);
    res.status(500).json({ message: 'Error creating survey' });
  }
});


app.get('/admin/savedsurveys', async (req, res) => {
  try {
    const savedSurveys = await Survey.find();
    res.status(200).json(savedSurveys);
  } catch (error) {
    console.error('Error fetching saved surveys:', error.message);
    res.status(500).json({ message: 'Error fetching saved surveys' });
  }
});
app.put('/admin/savedsurveys/:surveyId', async (req, res) => {
  const { surveyId } = req.params;
  const { title, questions } = req.body;

  try {
  
    const updatedSurvey = await Survey.findByIdAndUpdate(
      surveyId,
      { title, questions },
      { new: true }
    );

    if (!updatedSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.status(200).json(updatedSurvey);
  } catch (error) {
    console.error('Error updating survey:', error.message);
    res.status(500).json({ message: 'Error updating survey' });
  }
});


app.post('/submitreview', async (req, res) => {
  try {
    const { username, surveyTitle, review } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const surveyResponse = user.surveyResponses.find(
      (response) => response.surveyTitle === surveyTitle
    );

    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }

   
    surveyResponse.reviews.push(review);

   
    await user.save();

    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});


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
     
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});


app.post('/deletereview', async (req, res) => {
  try {
    const { username, surveyTitle } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const surveyResponse = user.surveyResponses.find(
      (response) => response.surveyTitle === surveyTitle
    );

    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }

   
    surveyResponse.reviews = [];

   
    await user.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});


app.post('/sendBackupResponses', async (req, res) => {
  try {
    const { userEmail, username } = req.body;

    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const backupResponses = await BackupResponse.find({ username });

   
    let emailContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .survey-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .question {
              font-weight: bold;
            }
            .answer {
              margin-bottom: 10px;
            }
            .rating {
              margin-top: 10px;
            }
            .average-rating {
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h2>Backup Survey Responses for ${user.username}</h2>
    `;

    let totalRatings = 0;
    let numberOfReviews = 0;

    backupResponses.forEach((backup) => {
      emailContent += `<div class="survey-container">
                        <div class="survey-title">Survey Title: ${backup.surveyTitle}</div>`;
      backup.responses.forEach((response) => {
        emailContent += `<div class="question">Question: ${response.question}</div>
                        <div class="answer">Answer: ${response.answer}</div>`;
      });

     
      if (backup.ratings && backup.ratings.length > 0) {
        emailContent += '<div class="rating"><strong>Ratings:</strong><br>';
        backup.ratings.forEach((rating, index) => {
          totalRatings += rating.rating;
          numberOfReviews++;
          emailContent += `<div>Review ${index + 1}: Rating - ${rating.rating}, Review Text - ${rating.reviewText}</div>`;
        });
        emailContent += '</div>';
      }

     
      if (backup.assignedTeamLead) {
        emailContent += `<div>Assigned Team Lead: ${backup.assignedTeamLead.username}</div>`;
      }

      emailContent += `</div><hr>`;
    });

    
    const averageRating = totalRatings / numberOfReviews;
    emailContent += `<div class="average-rating">Average Rating: ${averageRating.toFixed(2)}</div>`;

    emailContent += `</body></html>`;

    
    pdf.create(emailContent).toBuffer(async (err, buffer) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).json({ message: 'Error generating PDF' });
      }

      
      const mailOptions = {
        from: 'HR Department <hr@example.com>',
        to: userEmail,
        subject: 'Backup Survey Responses',
        html: emailContent,
        attachments: [
          {
            filename: 'backup_survey_responses.pdf',
            content: buffer,
            contentType: 'application/pdf',
          },
        ],
      };

      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Backup responses sent successfully' });
        }
      });
    });
  } catch (error) {
    console.error('Error sending backup responses:', error);
    res.status(500).json({ message: 'Error sending backup responses' });
  }
});

app.delete('/admin/surveys/:surveyId', async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    
    const existingSurvey = await Survey.findById(surveyId);
    if (!existingSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

   
    await Survey.findByIdAndDelete(surveyId);

    
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




app.get('/teamleads', async (req, res) => {
  try {
    const { search } = req.query;
  
    const query = search ? { username: { $regex: search, $options: 'i' } } : {};
    const teamLeads = await User.find({ ...query, role: 'teamlead' });
    
    res.status(200).json(teamLeads);
  } catch (error) {
    console.error('Error fetching team leads:', error.message);
    res.status(500).json({ message: 'Error fetching team leads' });
  }
});


app.get('/admin/surveys/:surveyId/responses', async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

   
    const surveyResponses = await User.find({ 'surveyResponses.surveyTitle': survey.title });

    
    const percentages = survey.questions.map((question) => {
      const totalResponses = surveyResponses.length;
      const optionCounts = {};

     
      surveyResponses.forEach((response) => {
        const userResponse = response.surveyResponses.find((sr) => sr.surveyTitle === survey.title);
        if (userResponse) {
          const userAnswer = userResponse.responses.find((r) => r.question === question.question);
          if (userAnswer) {
            optionCounts[userAnswer.answer] = (optionCounts[userAnswer.answer] || 0) + 1;
          }
        }
      });

     
      const percentagesForQuestion = {};
      Object.keys(optionCounts).forEach((option) => {
        percentagesForQuestion[option] = (optionCounts[option] / totalResponses) * 100;
      });

      return {
        question: question.question,
        percentages: percentagesForQuestion,
      };
    });

   
    surveyResponses.forEach(async (response) => {
      const user = await User.findById(response.userId); 

      if (user && user.surveyCount > 0) {
        user.surveyCount -= 1; 
        await user.save();
      }
    });

    res.status(200).json({ surveyTitle: survey.title, percentages });

  } catch (error) {
    console.error('Error fetching survey responses:', error.message);
    res.status(500).json({ message: 'Error fetching survey responses' });
  }
});


app.post('/admin/updateuserrole', async (req, res) => {
  try {
    const { username, role } = req.body;

   
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error.message);
    res.status(500).json({ message: 'Error updating user role' });
  }
});


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


app.post('/assignteamlead', async (req, res) => {
  try {
    const { username, teamLeadUsername } = req.body;

   
    const user = await User.findOne({ username });
    const teamLead = await User.findOne({ username: teamLeadUsername, role: 'teamlead' });

    if (!user || !teamLead) {
      return res.status(404).json({ message: 'User or Team Lead not found' });
    }

    
    user.assignedTeamLead = { teamLeadId: teamLead._id, username: teamLead.username };
    await user.save();

    res.status(200).json({ message: 'Team Lead assigned successfully' });
  } catch (error) {
    console.error('Error assigning team lead:', error.message);
    res.status(500).json({ message: 'Error assigning team lead' });
  }
});


app.post('/assignteamlead', async (req, res) => {
  try {
    const { username, teamLeadUsername } = req.body;

    
    const user = await User.findOne({ username });
    const teamLead = await User.findOne({ username: teamLeadUsername, role: 'teamlead' });

    if (!user || !teamLead) {
      return res.status(404).json({ message: 'User or Team Lead not found' });
    }

    
    user.assignedTeamLead = { teamLeadId: teamLead._id, username: teamLead.username };
    await user.save();

    res.status(200).json({ message: 'Team Lead assigned successfully' });
  } catch (error) {
    console.error('Error assigning team lead:', error.message);
    res.status(500).json({ message: 'Error assigning team lead' });
  }
});


app.post('/surveys', async (req, res) => {
  try {
    const { title, questions, accessibleUsers } = req.body;

    if (!title || !questions || questions.length === 0 || !accessibleUsers) {
      return res.status(400).json({ message: 'Title, questions, and accessibleUsers are required' });
    }

   
    const newSurvey = new Survey({ title, questions, accessibleUsers });
    await newSurvey.save();

    
    const usersToUpdate = await User.find({ _id: { $in: accessibleUsers } });

    usersToUpdate.forEach(async (user) => {
      user.assignedSurveys.push({ surveyId: newSurvey._id, title: newSurvey.title });
      user.surveyCount += 1; 
      await user.save();
    });

   
    res.status(201).json({ message: 'Survey uploaded successfully' });

  } catch (error) {
    console.error('Error uploading survey:', error.message);
    res.status(500).json({ message: 'Error uploading survey' });
  }
});

app.post('/surveyresponse', async (req, res) => {
  try {
    const { userId, surveyTitle, responses } = req.body;

   
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const existingSurveyResponseIndex = user.surveyResponses.findIndex(
      (response) => response.surveyTitle === surveyTitle
    );

    if (existingSurveyResponseIndex !== -1) {
     
      user.surveyResponses[existingSurveyResponseIndex].responses = responses;
    } else {
     
      user.surveyResponses.push({ surveyTitle, responses });

     
      user.surveyCount -= 1;
    }

   
    await user.save();

  
    const survey = await Survey.findOne({ title: surveyTitle });
    if (survey) {
     
      survey.accessibleUsers = survey.accessibleUsers.filter((id) => id.toString() !== userId);
      await survey.save();
    }

    res.status(200).json({ message: 'Survey response saved successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving survey response' });
  }
});




app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});



app.get('/userdetails/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
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


const generateRandomPassword = () => {
  const length = 8; 
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
  let randomPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomPassword += charset[randomIndex];
  }
  return randomPassword;
};

app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, employeeId, phoneNumber } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }, { employeeId }] });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const password = generateRandomPassword(); 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, employeeId, password: hashedPassword, role: 'user', phoneNumber });
    await user.save();

    
    const mailOptions = {
      from: 'hr@example.com', // HR's email address
      to: user.email, // User's email address
      subject: 'Account Registration Confirmation',
      text: `Hello ${user.username},\n\nAn HR representative has created an account for you. Your account has been successfully registered.\n\nUsername: ${user.username}\nEmployee ID: ${user.employeeId}\nPassword: ${password}\n\n    Don't forget to update your password. If you have any questions or concerns, please contact HR at hr@example.com.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'User Created  successfully' });
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});



app.delete('/deletesurveyresponse', async (req, res) => {
  try {
    const { username, surveyTitle } = req.body;

   
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const surveyResponseIndex = user.surveyResponses.findIndex(
      (response) => response.surveyTitle === surveyTitle
    );

    if (surveyResponseIndex === -1) {
      return res.status(404).json({ message: 'Survey response not found' });
    }

    
    const deletedResponse = user.surveyResponses.splice(surveyResponseIndex, 1)[0];
    const backupResponse = new BackupResponse({
      username: user.username,
      surveyTitle: deletedResponse.surveyTitle,
      responses: deletedResponse.responses,
      ratings: deletedResponse.reviews.map((review) => ({
        rating: review.rating,
        reviewText: review.reviewText,
      })),
      assignedTeamLead: user.assignedTeamLead, 
    });
    await backupResponse.save();

   
    await user.save();

    res.status(200).json({ message: 'Survey response deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey response:', error);
    res.status(500).json({ message: 'Error deleting survey response' });
  }
});






app.put('/auth/updatepassword', async (req, res) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;
    console.log('User ID:', userId);

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

   
    user.passwordChangeCount += 1;
    user.passwordChangedAt = Date.now(); 
    user.password = hashedNewPassword; 
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating password' });
  }
});


app.post('/auth/teamleadsignup', async (req, res) => {
  try {
    const { username, email, employeeId, password } = req.body;

    
    const existingTeamLead = await User.findOne({ username, role: 'teamlead' });
    if (existingTeamLead) {
      return res.status(409).json({ message: 'Team Lead already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const teamLead = new User({ username, email, employeeId, password: hashedPassword, role: 'teamlead' });
    await teamLead.save();

    
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
        expiresIn: '500h',
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


app.get('/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error.message);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
});




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