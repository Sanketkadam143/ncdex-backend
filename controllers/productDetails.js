import connection from "../config/dbconnection.js";
const db = connection();

export const getProduct = async (req, res) => {
  try {
    const sql = "SELECT * FROM products";
    const data = await db.promise().query(sql);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getLiveQuotes = async (req, res) => {
  try {
    const sql = `SELECT pd.*
                 FROM productDetails pd
                 JOIN (
                   SELECT product_id, MAX(datetime) AS latest_datetime
                   FROM productDetails
                   GROUP BY product_id
                 ) latest ON pd.product_id = latest.product_id AND pd.datetime = latest.latest_datetime`;

    const [rows] = await db.promise().query(sql);
    return  res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return  res.status(500).json({ message: "Something went wrong" });
  }
};

export const getLastPrice = async (req, res) => {
  const { productId } = req.query;
  try {
    const sql =
      "SELECT price FROM productdetails WHERE product_id=? ORDER BY datetime DESC LIMIT 1";
    const [rows] = await db.promise().query(sql, [productId]);
    if (rows.length > 0) {
      const latestPrice = rows[0].price;
      return res.status(200).json({ latestPrice });
    } else {
      return res.status(404).json({
        latestPrice: 0,
        message: "No last price found for the given product",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const productDetails = async (req, res) => {
  const { productId } = req.query;
  try {
    const sql = "SELECT * FROM productdetails WHERE product_id=?";
    const data = await db.promise().query(sql, [productId]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
