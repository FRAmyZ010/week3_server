const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//---------------------- generate password
app.get('/password/:raw',(req,res)=>{
    const raw = req.params.raw;
    bcrypt.hash(raw,10,(err,hash)=>{
        if(err){
            return res.status(500).send('Error creating password!');
        }
        res.send(hash);
    });
});

// ----------------- login ------------------
app.post('/login',(req,res)=>{
    const {username, password} = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql,[username],(err,result)=>{
        if(err){
            return res.status(500).send('Database error!');
        }
        if(result.length != 1){
            return res.status(401).send('Invalid username or password!');
        }
        bcrypt.compare(password,result[0].password,(err,same)=>{
            if(err){
                return res.status(500).send('Error comparing passwords!');
            }
            if(same){
                res.status(200).json({
                    message:"Login successful!",
                    user_id: result[0].id,
                });
            }else{
                res.status(401).send('Invalid username or password!');
            }
        })
    })
});

// ----------------- Show All Expense ------------------
app.get('/expenses/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sql = "SELECT * FROM expense WHERE user_id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// ----------------- Show Today's Expense -------------
app.get('/expenses/today/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sql = "SELECT * FROM expense WHERE DATE(date) = CURDATE() AND user_id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ----------------- Search Expense ------------------





// ----------------- Add Expense ------------------
app.post('/add-expenses', (req, res) => {
    const { item, paid, user_id } = req.body;
    if (!item || !paid || !user_id) {
        return res.status(400).send("Missing fields!");
    }

    const sql = "INSERT INTO expense (item, paid, user_id) VALUES (?, ?, ?)";
    db.query(sql, [item, paid, user_id], (err, result) => {
        if (err) {
            return res.status(500).send("Database error!");
        }
        res.status(201).json({
            message: "Expense added successfully!",
            expense_id: result.insertId
        });
    });
});


// ----------------- Delete Expense ------------------

app.delete('/del-expenses/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM expense WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send("Database error!");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Expense not found!");
        }
        res.json({ message: "Expense deleted successfully!" });
    });
});

// ---------------------------------------------------


app.listen(3000,()=>{
    console.log('Server is running on port 3000 ✅');
})
