import sun from '../assets/img/sun.png';
import cloud from '../assets/img/cloud.png';

const loadIcon = (icon) => {
    var src = ''

    // All icon at https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    // May add own icon or get from openweathermap

    switch(icon) {
        case '01n':
            src = sun
            break;
        case '04d':
            src = cloud
            break;
        default:
            src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    }

    return src
}

export default loadIcon;