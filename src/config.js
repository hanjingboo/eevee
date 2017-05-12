/**
 * 指令的前缀
 *
 * @type {String}
 */
export const prefix = 's';


/**
 * 当前版本号
 * @type {String}
 */
export const version = '0.1.0';


/**
 * 标识id
 * @type {String}
 */
export const tagId = 's-id';


/**
 * 普通插值的分割符
 * @type {Array}
 */
export const delimiters = ['{{','}}'];


/**
 * html类型的插值分隔符
 * @type {Array}
 */
export const unsafeDelimiters = ['{{{','}}}'];


/**
 * for指令的默认key的名称
 * @type {String}
 */
export const defaultIterator = '$index';


/**
 * 是否开启debug模式，如果开启，在非压缩版本下会打出很多信息。
 * @type {Boolean}
 */
export const debug = false;


/**
 * 数据检测方式 支持两种数据变化检测方式 defineProperties dirtyCheck
 * @type {String}
 */
export const dataCheckType = 'defineProperties';

/**
 * IE8下的替换注释节点id
 * @type {String}
 */
export const commentNodeId = 'S-COMMENT';
