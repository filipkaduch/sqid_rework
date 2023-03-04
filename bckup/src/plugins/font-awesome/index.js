import * as aliases from './aliases';
import * as brands from './brands';
import * as customIcons from './custom-icons';
import * as duotoneIcons from './duotone-icons';
import * as lightIcons from './light-icons';
import * as regularIcons from './regular-icons';
import * as solidIcons from './solid-icons';
// noinspection ES6CheckImport

import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(
	...Object.values(regularIcons),
	...Object.values(lightIcons),
	...Object.values(duotoneIcons),
	...Object.values(solidIcons),
	...Object.values(brands),
	...Object.values(aliases),
	...Object.values(customIcons)
);

export default {FontAwesomeIcon, FontAwesomeLayers};
