import '../styles/styles.scss';

async function promiseFunc() {
    return await Promise.resolve('async is working')
}

promiseFunc().then(console.log);

$('.container').addClass('asd');

console.log('Test Webpack Clean plugin');