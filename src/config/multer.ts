import multer from 'multer';
// import { resolve } from 'path';
import crypto from 'crypto';

export const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './src/avatars/');
    },
    filename(req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];

        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = crypto.randomBytes(64).toString('hex');

        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
    }
});
