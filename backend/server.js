const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Smart_Parking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// ============= OWNER ROUTES =============

// Get all owners
app.get('/api/owners', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM owner');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create owner
app.post('/api/owners', async (req, res) => {
  try {
    const { Owner_Name, Owner_Contact, Owner_Address } = req.body;
    
    // Get the last owner ID and increment
    const [rows] = await pool.query('SELECT Owner_ID FROM owner ORDER BY Owner_ID DESC LIMIT 1');
    let nextNum = 1;
    if (rows.length > 0) {
      const lastId = rows[0].Owner_ID;
      const numPart = parseInt(lastId.replace(/\D/g, ''));
      nextNum = numPart + 1;
    }
    const Owner_ID = 'O' + String(nextNum).padStart(3, '0');
    
    await pool.query(
      'INSERT INTO owner (Owner_ID, Owner_Name, Owner_Contact, Owner_Address) VALUES (?, ?, ?, ?)',
      [Owner_ID, Owner_Name, Owner_Contact, Owner_Address]
    );
    
    res.json({ Owner_ID, Owner_Name, Owner_Contact, Owner_Address });
  } catch (error) {
    console.error('Error in POST /api/owners:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update owner
app.put('/api/owners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Owner_Name, Owner_Contact, Owner_Address } = req.body;
    
    await pool.query(
      'UPDATE owner SET Owner_Name = ?, Owner_Contact = ?, Owner_Address = ? WHERE Owner_ID = ?',
      [Owner_Name, Owner_Contact, Owner_Address, id]
    );
    
    res.json({ Owner_ID: id, Owner_Name, Owner_Contact, Owner_Address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete owner
app.delete('/api/owners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM owner WHERE Owner_ID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= VEHICLE ROUTES =============

// Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehicle');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vehicle
app.post('/api/vehicles', async (req, res) => {
  try {
    const { Vehicle_No, Vehicle_Model, Vehicle_Color, Owner_ID } = req.body;
    
    await pool.query(
      'INSERT INTO vehicle (Vehicle_No, Vehicle_Model, Vehicle_Color, Owner_ID) VALUES (?, ?, ?, ?)',
      [Vehicle_No, Vehicle_Model, Vehicle_Color, Owner_ID]
    );
    
    res.json({ Vehicle_No, Vehicle_Model, Vehicle_Color, Owner_ID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vehicle
app.put('/api/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Vehicle_Model, Vehicle_Color, Owner_ID } = req.body;
    
    await pool.query(
      'UPDATE vehicle SET Vehicle_Model = ?, Vehicle_Color = ?, Owner_ID = ? WHERE Vehicle_No = ?',
      [Vehicle_Model, Vehicle_Color, Owner_ID, id]
    );
    
    res.json({ Vehicle_No: id, Vehicle_Model, Vehicle_Color, Owner_ID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vehicle
app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM vehicle WHERE Vehicle_No = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= PARKING SLOT ROUTES =============

// Get all slots
app.get('/api/slots', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parking_slot');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create slot
app.post('/api/slots', async (req, res) => {
  try {
    const { Slot_Number, Slot_Location, Slot_Status } = req.body;
    
    // Generate incremental Slot_ID (S001, S002, etc.)
    const [rows] = await pool.query('SELECT Slot_ID FROM parking_slot ORDER BY Slot_ID DESC LIMIT 1');
    let nextNum = 1;
    if (rows.length > 0 && rows[0].Slot_ID) {
      const lastId = rows[0].Slot_ID;
      const numPart = parseInt(lastId.replace('S', ''));
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const Slot_ID = 'S' + String(nextNum).padStart(3, '0');
    
    await pool.query(
      'INSERT INTO parking_slot (Slot_ID, Slot_Number, Slot_Location, Slot_Status) VALUES (?, ?, ?, ?)',
      [Slot_ID, Slot_Number, Slot_Location, Slot_Status]
    );
    
    res.json({ Slot_ID, Slot_Number, Slot_Location, Slot_Status });
  } catch (error) {
    console.error('Error in POST /api/slots:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update slot
app.put('/api/slots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Slot_Number, Slot_Location, Slot_Status } = req.body;
    
    await pool.query(
      'UPDATE parking_slot SET Slot_Number = ?, Slot_Location = ?, Slot_Status = ? WHERE Slot_ID = ?',
      [Slot_Number, Slot_Location, Slot_Status, id]
    );
    
    res.json({ Slot_ID: id, Slot_Number, Slot_Location, Slot_Status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete slot
app.delete('/api/slots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM parking_slot WHERE Slot_ID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= PARKING RECORD ROUTES =============

// Get all records
app.get('/api/records', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parking_record');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create record
app.post('/api/records', async (req, res) => {
  try {
    const { Vehicle_No, Staff_ID, Slot_ID, Parking_Location, Entry_Date, Entry_Time, Exit_Date, Exit_Time, Remarks } = req.body;
    
    // Generate incremental Parking_ID (P001, P002, etc.)
    const [rows] = await pool.query('SELECT Parking_ID FROM parking_record ORDER BY Parking_ID DESC LIMIT 1');
    let nextNum = 1;
    if (rows.length > 0 && rows[0].Parking_ID) {
      const lastId = rows[0].Parking_ID;
      const numPart = parseInt(lastId.replace('P', ''));
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const Parking_ID = 'P' + String(nextNum).padStart(3, '0');
    
    await pool.query(
      'INSERT INTO parking_record (Parking_ID, Vehicle_No, Staff_ID, Slot_ID, Parking_Location, Entry_Date, Entry_Time, Exit_Date, Exit_Time, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Parking_ID, Vehicle_No, Staff_ID, Slot_ID, Parking_Location, Entry_Date, Entry_Time, Exit_Date, Exit_Time, Remarks]
    );
    
    res.json({ Parking_ID, Vehicle_No, Staff_ID, Slot_ID, Parking_Location, Entry_Date, Entry_Time, Exit_Date, Exit_Time, Remarks });
  } catch (error) {
    console.error('Error in POST /api/records:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete record
app.delete('/api/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM parking_record WHERE Parking_ID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= PAYMENT ROUTES =============

// Get all payments
app.get('/api/payments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payment');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment
app.post('/api/payments', async (req, res) => {
  try {
    const { Parking_ID, Payment_Status, Payment_Amount, Payment_Mode } = req.body;
    
    // Generate incremental Payment_ID (PAY001, PAY002, etc.)
    const [rows] = await pool.query('SELECT Payment_ID FROM payment ORDER BY Payment_ID DESC LIMIT 1');
    let nextNum = 1;
    if (rows.length > 0 && rows[0].Payment_ID) {
      const lastId = rows[0].Payment_ID;
      const numPart = parseInt(lastId.replace('PAY', ''));
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const Payment_ID = 'PAY' + String(nextNum).padStart(3, '0');
    
    await pool.query(
      'INSERT INTO payment (Payment_ID, Parking_ID, Payment_Status, Payment_Amount, Payment_Mode) VALUES (?, ?, ?, ?, ?)',
      [Payment_ID, Parking_ID, Payment_Status, Payment_Amount, Payment_Mode]
    );
    
    res.json({ Payment_ID, Parking_ID, Payment_Status, Payment_Amount, Payment_Mode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payment
app.delete('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM payment WHERE Payment_ID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= STAFF ROUTES =============

// Get all staff
app.get('/api/staff', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM staff');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create staff
app.post('/api/staff', async (req, res) => {
  try {
    const { Staff_Name, Staff_Shift } = req.body;
    
    // Generate incremental Staff_ID (ST001, ST002, etc.)
    const [rows] = await pool.query('SELECT Staff_ID FROM staff ORDER BY Staff_ID DESC LIMIT 1');
    let nextNum = 1;
    if (rows.length > 0 && rows[0].Staff_ID) {
      const lastId = rows[0].Staff_ID;
      const numPart = parseInt(lastId.replace('ST', ''));
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const Staff_ID = 'ST' + String(nextNum).padStart(3, '0');

    await pool.query(
      'INSERT INTO staff (Staff_ID, Staff_Name, Staff_Shift) VALUES (?, ?, ?)',
      [Staff_ID, Staff_Name, Staff_Shift]
    );

    res.json({ Staff_ID, Staff_Name, Staff_Shift });
  } catch (error) {
    console.error('Error in POST /api/staff:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update staff
app.put('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Staff_Name, Staff_Shift } = req.body;
    
    await pool.query(
      'UPDATE staff SET Staff_Name = ?, Staff_Shift = ? WHERE Staff_ID = ?',
      [Staff_Name, Staff_Shift, id]
    );
    
    res.json({ Staff_ID: id, Staff_Name, Staff_Shift });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete staff
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM staff WHERE Staff_ID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
