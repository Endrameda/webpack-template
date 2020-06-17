import '../styles/styles.scss';

async function promiseFunc() {
    return await Promise.resolve('async is working')
}

promiseFunc().then(console.log);

console.log('Test Webpack Clean plugin');