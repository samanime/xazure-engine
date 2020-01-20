const modPi2 = rad => rad % (Math.PI * 2);

const radianBetween = (rad, min, max) =>
  (modPi2(rad) >= modPi2(min) && modPi2(rad) < modPi2(max))
    || modPi2(rad + Math.PI * 2) >= modPi2(min + Math.PI * 2) && modPi2(rad + Math.PI * 2) < modPi2(max + Math.PI * 2);

export default radianBetween;