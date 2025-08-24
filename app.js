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

app.get('/expense/search/:user_id', (req,res) => {
    const userId = req.params.user_id;
    const keyword = (req.body.keyword ||"").trim();

    const sql = `
    SELECT * FROM expense
    WHERE user_id =?
    AND item LIKE ?
    `;

   

    db.query(sql, [userId,keyword], (err,result) =>{
        if(err) {
            console.error('Database error:',err);
            return res.status(500).send('Database error');
        }
        res.json(result);
    });

});
 

// ----------------- Add Expense ------------------

    // Write your code here

// ----------------- Delete Expense ------------------

    // Write your code here

// ---------------------------------------------------

app.listen(3000,()=>{
    console.log('Server is running on port 3000 ✅');
})