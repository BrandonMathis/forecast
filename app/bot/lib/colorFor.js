function between(x, min, max) {
  return x >= min && x <= max;
}

function colorFor(temp) {
  const roundTemp = Math.ceil(temp);
  if (between(roundTemp, -100, 10)) {
    return '#E3F9FE';
  } else if (between(roundTemp, 11, 20)) {
    return '#C0F8FF';
  } else if (between(roundTemp, 21, 30)) {
    return '#87CEEB';
  } else if (between(roundTemp, 31, 40)) {
    return '#00BFFF';
  } else if (between(roundTemp, 41, 50)) {
    return '#4169E1';
  } else if (between(roundTemp, 51, 60)) {
    return '#008B8B';
  } else if (between(roundTemp, 61, 70)) {
    return '#008000';
  } else if (between(roundTemp, 71, 80)) {
    return '#32CD32';
  } else if (between(roundTemp, 81, 90)) {
    return '#7CFC00';
  } else if (between(roundTemp, 91, 100)) {
    return '#FFA500';
  } else if (between(roundTemp, 101, 110)) {
    return '#FF4500';
  } else if (between(roundTemp, 111, 200)) {
    return '#FF0000';
  }
}

module.exports = colorFor
