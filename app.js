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
    con.query(sql,[username],(err,result)=>{
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

    // Write your code here

// ----------------- Show Today's Expense ------------------

    // Write your code here

// ----------------- Search Expense ------------------

    // Write your code here

// ----------------- Add Expense ------------------

    // Write your code here

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