'use strict';

let globalEval = str => {
    new Function(str)();
};

export default globalEval;