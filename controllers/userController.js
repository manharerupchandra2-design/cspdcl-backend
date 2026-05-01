const db=require("../config/db");

exports.userLogin = async (req, res) => {

  try {

    console.log(req.body);
    const { email,password } = req.body;
    
    const [row]=await db.execute('SELECT * FROM users where email=?',[email]);

    if(row.length===0){
        res.json({
            success:false,
            message:"User not found"
        })
        return;
    }
    
    const user=row[0];

    if(user.password===password){
        return res.json({
            success:true,
            message:"Lets Go->>>"
        })
    }else{
       return res.json({
            success:false,
            message:"Password Mistmatch"
        })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.userSignup = async (req, res) => {

  try {
console.log(req.body)
    const { name, mobile, email, password } = req.body;

    const checkmobile ="select * from users where mobile=?";
    const [result]=await db.query(checkmobile,[mobile]);

    if(result.length>0){
      return res.status(400).json({
        success:false,
        message:"Mobile Number already have"
      })
    }

    await db.execute(
      `INSERT INTO users 
      (name,mobile,email,password)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        mobile,
        email,
        password
        
      ]
    );

    res.status(200).json({
      success: true,
      message: "User Registered Successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};