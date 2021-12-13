import { Options, diskStorage } from 'multer';

export const multerConfig = {
    dest: './src/avatars',
    storage: diskStorage({
        destination: (request, file, callback) => {
            callback(null, './src/avatars');
        },
        filename: (request, file, callback) => {
            const extensaoArquivo = file.originalname.split('.')[1];

            const { id } = request.params;

            const novoNomeArquivo = id;

            callback(null, `${novoNomeArquivo}.${extensaoArquivo}`);
        }
    }),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: (request, file, callback) => {
        const formats = ['image/jpeg', 'image/jpg', 'image/png'];

        if (formats.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Format not accepted'));
        }
    }
} as Options;
