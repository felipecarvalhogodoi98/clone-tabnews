const status = (req, res) => {
  res.status(200).send({ status: "ok" });
}

export default status;