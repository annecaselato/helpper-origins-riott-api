// import { Logger } from 'library';
// import multer from 'multer';
// import { extname } from 'path';

export class Helper {
    static customFileName(req: any, file: { mimetype: string | string[]; originalname: string }, cb: (arg0: null, arg1: string) => void): void {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        let fileExtension = '';
        if (file.mimetype.indexOf('jpeg') > -1) {
            fileExtension = 'jpg';
        } else if (file.mimetype.indexOf('png') > -1) {
            fileExtension = 'png';
        }
        const originalName = file.originalname.split('.')[0];
        cb(null, `${originalName}-${uniqueSuffix}.${fileExtension}`);
    }

    static destinationPath(req: any, file: any, cb: (arg0: null, arg1: string) => void): void {
        cb(null, 'avatars/');
    }
}
