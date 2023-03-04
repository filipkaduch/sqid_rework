import * as solidIcons from './solid-icons.ts';
// noinspection ES6CheckImport

import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(
    ...Object.values(solidIcons)
);

export default {FontAwesomeIcon, FontAwesomeLayers};
