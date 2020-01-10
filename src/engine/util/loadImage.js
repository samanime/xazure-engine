const loadImage = async url => new Promise((resolve, reject) => {
  const image = new Image();
  image.src = url;

  image.addEventListener('load', () => {
    const realImage = new Image();
    realImage.src = url;

    resolve(realImage);
  });

  image.addEventListener('error', () => {
    reject();
  });
});

export default loadImage;