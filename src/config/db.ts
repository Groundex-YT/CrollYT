import mongoose, { ConnectOptions } from 'mongoose';

const db = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI!, {
            //@ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`database connected as: ${connect.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};

export default db;
