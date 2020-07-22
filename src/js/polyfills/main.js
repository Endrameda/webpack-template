import objectFixImage from 'object-fit-images';

$(() => {
    const image = document.querySelectorAll('js-object-fit');
    objectFixImage(image, { watchMQ: true });
});
