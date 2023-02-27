import connection from "../config/dbconnection.js";
const db = connection();

export const getProduct = async(req,res)=>{
  try {
    const sql="SELECT * FROM products";
   const data = await db.promise().query(sql);
   res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const productDetails =async(req,res)=>{
  const {productId}=req.query;
  try {
    const sql="SELECT * FROM productdetails WHERE product_id=?";
   const data = await db.promise().query(sql,[productId]);
   res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

}