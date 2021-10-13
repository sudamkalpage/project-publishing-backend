const path = require('path');
const multer = require('multer');
const hash = require('random-hash');

const storage = multer.diskStorage({
    // set the storage path and the file name
    destination: (req, file, cb) => {
        cb(null, 'static/uploads');
    },
    filename: (req, file, cb) => {
        var extension = file.originalname.substr(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + new Date().toISOString().replace(/:/g, '-')+ hash.generateHash({length: 5}) + extension);
    }
});

const upload = multer ({
    storage: storage,
    fileFilter: function(req, file, callback){
        checkFileType(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

module.exports = upload

//check file types for different field names
function checkFileType(file, cb) {
    if(file.fieldname==='nicPhoto' || file.fieldname === 'profilePicture' || file.fieldname === 'uni_id_photo' || file.fieldname === 'profile_picture') {
        if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') { // check file type to be pdf, doc, or docx
            cb(null, true);
        } 
        else {
            console.log('only jpg , jpeg & png file supported');
            cb(null, false);
        }
    }
    else if(file.fieldname === 'proofDocument'||file.fieldname === 'submission') {
        if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf') { // check file type to be pdf, doc, or docx
            cb(null, true);
        } 
        else {
            console.log('only jpg , jpeg , png & pdf file supported');
            cb(null, false);
        }
    }
    else {
        console.log('no such field found');
        cb(null, false);
    }
}