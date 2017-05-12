import { version } from './config.js';
import { Compiler } from './compiler.js';

class Tpl {

    constructor(options = {}){
        this.$options = options;
        var data = this.$data = this.$options.data;

        new Compiler(options.el || document.body, this);
    }

}

Tpl.version = version;

module.exports=Tpl;
