import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { passwordStrength } from "check-password-strength";
import validator from "validator";
import connection from "../config/dbconnection.js";
import dotenv from "dotenv";
dotenv.config();
const db = connection();

const JWTKEY = process.env.JWTKEY;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query(`SELECT * FROM admin_login WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      {
        email: rows[0].email,
        id: rows[0].id,
        role: rows[0].role,
        username: rows[0].username,
      },
      JWTKEY,
      {
        expiresIn: JWT_EXPIRE,
      }
    );
    res.status(200).json({
      token,
      result: rows[0],
      successMessage: "You are Successfully Logged in",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, otp} =
    req.body;
  const role="superadmin";
  const passMusthave = ["lowercase", "uppercase", "symbol", "number"];

  const passContains = passwordStrength(password).contains;

  var addPass = [];
  passMusthave.map((x) => !passContains.includes(x) && addPass.push(x));

  const strength = passwordStrength(password).value;
  const length = passwordStrength(password).length;
  const userName = firstName + " " + lastName;

  try {
    if (!validator.isAlpha(firstName))
      return res
        .status(400)
        .json({ message: "First Name should contain only Alphabets" });

    if (!validator.isAlpha(lastName))
      return res
        .status(400)
        .json({ message: "Last Name should contain only Alphabets" });

    const [rows] = await db
      .promise()
      .query(`SELECT * FROM admin_login WHERE email = ?`, [email]);
    if (rows.length !== 0) {
      return res.status(404).json({ message: "Admin already exist" });
    }

    if (length < 8)
      return res
        .status(400)
        .json({ message: `Add password of length greater than 8` });

    if (strength === "Too weak" || strength === "Weak")
      return res.status(400).json({
        message: `Entered Password is ${strength} consider adding ${addPass.map(
          (x) => x
        )}`,
      });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords Don't Match" });

    if (!otp) {
      var digits = "0123456789";
      let generatedOtp = "";
      for (let i = 0; i < 4; i++) {
        generatedOtp += digits[Math.floor(Math.random() * 10)];
      }
      const hashedOtp = await bcrypt.hash(generatedOtp, 12);

      await db
      .promise()
      .query(
        `INSERT INTO otp (email, OTP ,expires) VALUES (?,?,DATE_ADD(NOW(), INTERVAL 5 MINUTE)) ON DUPLICATE KEY UPDATE OTP=?, expires=DATE_ADD(NOW(), INTERVAL 5 MINUTE)`,
        [email, hashedOtp, hashedOtp]
      );


      // await sendmail({ userName, email, type: "signUpOtp", generatedOtp });
      console.log(generatedOtp);

      return res.json({ successMessage: "OTP Sent on Admin Email" });
    }

    if (otp) {
      const tempDetails = await db
        .promise()
        .query(`SELECT * FROM otp WHERE email=?`, [email]);

      const otpExpiry = tempDetails[0][0].expires;
      if (otpExpiry < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      const isOtpCorrect = await bcrypt.compare(otp, tempDetails[0][0].OTP);

      if (!isOtpCorrect)
        return res.status(400).json({ message: "Invalid OTP" });

      if (isOtpCorrect) {
        const hashedPassword = await bcrypt.hash(password, 12);

        await db
          .promise()
          .query(
            "INSERT INTO admin_login (username, email, password, role) VALUES (?,?,?,?)",
            [firstName + lastName, email, hashedPassword, role]
          );

        // await sendmail({ userName, email, type: "signUp" });

        res.status(200).json({
          successMessage: "Account created Successfully",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const resetPass = async (req, res) => {
  res.status(200).json("resetPass");
};

export const getAdmins = async(req,res)=>{
  try {
    const sql="SELECT username, email,role FROM admin_login";
   const data = await db.promise().query(sql);
   res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
};
