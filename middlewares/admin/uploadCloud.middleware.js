const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// cloudinary config

    cloudinary.config({ 
        cloud_name: 'dcjtmktt2', 
        api_key: '591522357591657', 
        api_secret: 'gXsbayLK5lHsQswTO6IToNmD8hw' // Click 'View API Keys' above to copy your API secret
    });
// end cloudinary config

module.exports.upload = (req, res, next) => {
    if(req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if(result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.url;
            next();
        }

            upload(req);
    } else {
        next();
    }
}
    