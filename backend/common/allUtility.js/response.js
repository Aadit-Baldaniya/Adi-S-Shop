function status200(res, data, status = 200) {
  res.status(status).json({ success: true, data: data });
}
function status400(res, meg, status = 400) {
  res.status(status).json({ success: false, message: meg });
}
function status404(res, meg, status = 404) {
  return res.status(status).json({ message: meg });
}
function status500(res, meg, status = 500) {
  res.status(status).json({ message: meg });
}

module.exports = { status200, status400, status404, status500 };
