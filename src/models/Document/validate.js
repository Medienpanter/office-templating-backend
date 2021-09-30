

function isDocx(file) {
  return file.originalname.split('.').pop() === 'docx' ? true : false;
}

module.exports = {
  isDocx,
};
