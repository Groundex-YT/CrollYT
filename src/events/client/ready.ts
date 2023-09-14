import clientProp from '../..';
const ready = {
    name: 'ready',
    once: true,
    async execute(client: any) {
        console.log(`READY BOSS!`);
    },
};

export default ready;
