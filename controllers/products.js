import connection from "../config/dbconnection.js";
const db = connection();

export const addProduct = async (req, res) => {
  const { name, symbol, category, description, image } = req.body;
  const lowercaseName = name.toLowerCase(); // convert name to lowercase

  try {
    const result = await db
      .promise()
      .query(
        "INSERT INTO products (name, symbol, category, description, image) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM products WHERE LOWER(name) = ?)",
        [name, symbol, category, description, image, lowercaseName]
      );

    if (result[0].affectedRows === 1) {
      return res.status(200).json({ successMessage: "Product added successfully" });
    } else {
     return res.status(400).json({ message: "Product already exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
   
  }
};



export const deleteProduct = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Id is required" });
  try {
    const productExist = await db
      .promise()
      .query("SELECT * FROM products WHERE id = ?", [id]);
    if (!productExist[0].length)
      return res.status(404).json({ message: "Product not found" });
    const sql = "DELETE FROM products WHERE id = ?";
    await db.promise().query(sql, [id]);

   return res.status(200).json({ successMessage: "Product Deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
   
  }
};
export const updateProduct = async (req, res) => {
  const { price, date, location, productId,percentChange,name } = req.body;
  try {
    const productExist = await db
    .promise()
    .query("SELECT name FROM products WHERE id = ?", [productId]);

  if (!productExist[0].length) {
    return res.status(404).json({ message: "Product not found" });
  }
  
  const datetimeExist = await db
    .promise()
    .query(
      "SELECT * FROM productdetails WHERE product_id = ? AND datetime = ?",
      [productId, date]
    );
  if (datetimeExist[0].length) {
    return res
      .status(400)
      .json({ message: "Product details for this datetime already exist" });
  }
  
  await db
    .promise()
    .query(
      "INSERT INTO productdetails (product_id, price, location, datetime, percentChange, name) VALUES (?,?,?,?,?,?)",
      [productId, price, location, date, percentChange, name]
    );
  
   return res.status(200).json({ successMessage: "Product details updated successfully" });
  
  } catch (error) {
    console.log(error);
   return  res.status(500).json({ message: "Something went wrong" });
    
  }
};
