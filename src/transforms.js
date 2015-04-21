'use strict';

export function pixelRatio (value) {
    return value === 1 ? '' : '-' + value + 'x';
}

export function width (width, map) {
    return map[width] || width;
}
