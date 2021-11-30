// eslint-disable-next-line import/no-unresolved
import { diskStorage, Options } from 'multer';
import { randomBytes } from 'crypto';
import { resolve } from 'path';

export const multerConfig = {
    dest: resolve(__dirname, '..', 'uploads'),
    storage: diskStorage({
        destination: (request: any, file: any, callback: (arg0: null, arg1: string) => void) => {
            callback(null, resolve(__dirname, '..', 'uploads'));
        },
        filename: (request: any, file: { filename: any }, callback: (arg0: Error | null, arg1: string) => void) => {
            randomBytes(16, (error, hash) => {
                if (error) {
                    callback(error, file.filename);
                }
                const filename = `${hash.toString('hex')}.jpeg`;
                callback(null, filename);
            });
        }
    }),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2Mb
    },
    fileFilter: (request, file, callback) => {
        const formats = ['image/jpeg', 'image/jpg', 'image/png'];

        if (formats.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Formato não suportado'));
        }
    }
} as Options;
