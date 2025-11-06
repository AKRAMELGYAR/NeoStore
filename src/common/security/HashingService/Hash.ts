import * as bcrypt from 'bcrypt';


export class HashingService {
    private static instance: HashingService;
    constructor() { }

    static getInstance(): HashingService {
        if (!HashingService.instance) {
            HashingService.instance = new HashingService();
        }
        return HashingService.instance;
    }


    async Hash(plainText: string) {
        return await bcrypt.hash(plainText, Number(process.env.SALT));
    }

    async CompareHash(plainText: string, hash: string) {
        return await bcrypt.compare(plainText, hash);
    }
}