function status(request, response) {
  response.status(200).json({ Status: "Sistema funcionando!" });
}

export default status;
