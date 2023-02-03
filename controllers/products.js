import connection from "../config/dbconnection.js";
const db = connection();

export const addProduct = async (req, res) => {
  const { name, symbol, category, description, image } = req.body;
  try {
    await db
      .promise()
      .query(
        "INSERT INTO products (name ,symbol,category,description,image) VALUES (?,?,?,?,?)",
        [name, symbol, category, description, image]
      );

    res.status(500).json({ message: "Product Added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
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

    res.status(200).json({ message: "Product Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
export const updateProduct = async (req, res) => {
  const { price, date, location, productId } = req.body;
  try {
    const productExist = await db
      .promise()
      .query("SELECT * FROM products WHERE id = ?", [productId]);
    if (!productExist.length)
      return res.status(404).json({ message: "Product not found" });

    await db
      .promise()
      .query(
        "INSERT INTO productdetails (product_id, price, location, datetime) VALUES (?,?,?,?)",
        [productId, price, location, date]
      );

    res.status(200).json({ message: "Product details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
