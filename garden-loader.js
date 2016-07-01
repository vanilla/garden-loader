/**
 * A ES6 System module loader polyfill.
 *
 * This is based off the [es6-micro-loader](https://github.com/caridy/es6-micro-loader).
 *
 */

/**
 * A loaded module entry.
 * @typedef {Object} Module
 * @property {Object} proxy Live bindings into the module's exports.
 * @property {Object} exports The private export data.
 * @property {string[]} deps The names of the dependencies of the module.
 * @property {string[]} dependants The names of the modules that are dependant on the module.
 * @property {function} update Update dependencies on the module.
 * @property {function} execute Execute the module to make it ready to use.
 */

(function (exports) {
    'use strict';

    var headEl = document.getElementsByTagName('head')[0],
        ie = /MSIE/.test(navigator.userAgent);

    /**
     * Normalize a relative module name.
     *
     * Inspired by [Ember's loader]{@link https://github.com/emberjs/ember.js/blob/0591740685ee2c444f2cfdbcebad0bebd89d1303/packages/loader/lib/main.js#L39-L53}
     *
     * @param {string} child The name of the module to normalize.
     * @param {Array} parentBase The module that the child is relative to, split by "/".
     * @returns {string} Returns an absolute module name.
     */
    function normalizeName(child, parentBase) {
        if (child.charAt(0) === '/') {
            child = child.slice(1);
        }
        if (child.charAt(0) !== '.') {
            return child;
        }
        var parts = child.split('/');
        while (parts[0] === '.' || parts[0] === '..') {
            if (parts.shift() === '..') {
                parentBase.pop();
            }
        }
        return parentBase.concat(parts).join('/');
    }

    // A map of currently loading modules and their promises.
    var loading = Object.create(null);
    // A map of all modules that have been executed against dependencies.
    var executed = Object.create(null);
    var internalRegistry = Object.create(null);
    var externalRegistry = Object.create(null);
    // Contains define arguments for anonymous modules.
    var anonymousEntry;

    function ensuredExecute(name) {
        var mod = internalRegistry[name];
        if (mod && !executed[name]) {
            executed[name] = true;
            // one time operation to execute the module body
            mod.execute();
        }
        return mod && mod.exports;
    }

    function set(name, values) {
        externalRegistry[name] = values;
    }

    function get(name) {
        return externalRegistry[name] || ensuredExecute(name);
    }

    function has(name) {
        return !!externalRegistry[name] || !!internalRegistry[name];
    }

    function register(name, deps, wrapper) {
        if (Array.isArray(name)) {
            // anounymous module
            anonymousEntry = [register];
            anonymousEntry.push.apply(anonymousEntry, arguments)
            return; // breaking to let the script tag to name it.
        }
        var // proxy = Object.create(null),
            exports = Object.create(null),
            mod, meta;
        // Creating a new entry in the internal registry.
        console.log("System.register(%s, %o, %o)", name, deps, wrapper);
        internalRegistry[name] = mod = {
            // live bindings
            // proxy: proxy,
            // exported values
            exports: exports,
            // normalized deps
            deps: deps.map(function (dep) {
                return normalizeName(dep, name.split('/').slice(0, -1));
            }),
            // other modules that depends on this so we can push updates into those modules
            dependants: [],
            // method used to push updates of deps into the module body
            update: function (moduleName, moduleObj) {
                meta.setters[mod.deps.indexOf(moduleName)](moduleObj);
            },
            execute: function () {
                mod.deps.map(function (dep) {
                    var imports = externalRegistry[dep];
                    if (imports) {
                        mod.update(dep, imports);
                    } else {
                        imports = get(dep) && internalRegistry[dep].exports; // optimization to pass plain values instead of bindings
                        if (imports) {
                            internalRegistry[dep].dependants.push(name);
                            mod.update(dep, imports);
                        }
                    }
                });
                meta.execute();
            }
        };

        // collecting execute() and setters[]
        meta = wrapper(function (identifier, value) {
            exports[identifier] = value;
            mod.lock = true; // locking down the updates on the module to avoid infinite loop
            mod.dependants.forEach(function (moduleName) {
                if (internalRegistry[moduleName] && !internalRegistry[moduleName].lock) {
                    internalRegistry[moduleName].update(name, exports);
                }
            });
            mod.lock = false;
            // if (!Object.getOwnPropertyDescriptor(proxy, identifier)) {
            //     Object.defineProperty(proxy, identifier, {
            //         enumerable: true,
            //         get: function () {
            //             return exports[identifier];
            //         }
            //     });
            // }
            return value;
        });
    }

    /**
     *
     * @param {string} [name] The name of the module.
     * @param {string[]} [deps] The name(s) of modules this module depends on.
     * @param {function} factory The factory that creates the module.
     */
    function define(name, deps, factory) {
        if (Array.isArray(name) || typeof name === 'function') {
            // This is an anonymous module and will be named later when the script's load event returns.
            anonymousEntry = [define];
            anonymousEntry.push.apply(anonymousEntry, arguments);
            return; // breaking to let the script tag to name it.
        }
        // Check for a module with no dependencies.
        if (typeof deps === 'function') {
            factory = deps;
            deps = [];
        }

        var // proxy = Object.create(null),
            exports = {},
            mod, meta;

        // Create a new entry in the internal registry.
        console.log("define(%s, %o)", name, deps);
        internalRegistry[name] = mod = {
            // Exported values.
            exports: exports,
            // This contains the actual module, after factory() has been called.
            // proxy: exports, // temporary
            // Normalized dependency names.
            deps: deps.map(function (dep) {
                return normalizeName(dep, name.split('/').slice(0, -1));
            }),
            // Other modules that depends on this so we can push updates into those modules.
            // AMD doesn't support updating, but they need to update ES6 modules.
            dependants: [],
            // Not used in AMD modules.
            update: function (moduleName, moduleObj) {
                /*...*/
            },
            execute: function () {
                var depValues = [];
                // Gather all of the dependencies.
                mod.deps.map(function (dep) {
                    var depValue;
                    if (dep === 'exports') {
                        depValue = mod.exports;
                    } else if (dep === 'module') {
                        depValue = mod;
                    // I think this should work, but need tests before uncommenting.
                    // } else if (dep === 'require') {
                    //     depValue = get;
                    } else {
                        depValue = externalRegistry[dep];
                        if (!depValue) {
                            depValue = get(dep) && internalRegistry[dep].exports; // optimization to pass plain values instead of bindings

                            // AMD modules only understand default values.
                            depValue = depValue && depValue.default;
                        }
                    }
                    depValues.push(depValue);
                });

                // Execute the factory against the dependencies.
                var r = factory.apply(null, depValues);

                // Box the default in the case that module.exports has been set.
                if (typeof mod.exports != 'object') {
                    mod.exports = {default: mod.exports};
                }
                // An AMD return value is the default export.
                if (r) {
                    exports.default = r;
                }
                // Push this module back into its dependants.
                mod.lock = true; // locking down the updates on the module to avoid infinite loop
                mod.dependants.forEach(function (moduleName) {
                    if (internalRegistry[moduleName] && !internalRegistry[moduleName].lock) {
                        internalRegistry[moduleName].update(name, exports);
                    }
                });
                mod.lock = false;
            }
        };
    }

    // Mark this an AMD definer so that UMD formatted modules will pick it up.
    define.amd = 1;

    function createScriptNode(src, callback) {
        var node = document.createElement('script');
        // use async=false for ordered async?
        // parallel-load-serial-execute http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
        if (node.async) {
            node.async = false;
        }
        if (ie) {
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(this.readyState)) {
                    this.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            node.onload = node.onerror = callback;
        }
        node.setAttribute('src', src);
        headEl.appendChild(node);
    }

    /**
     * Load a module into the internal registry.
     *
     * @param {string} name The name of the module to load.
     * @returns {Promise} Returns a promise that resolves when the module is loaded.
     */
    function load(name) {
        if (!loading[name]) {
            console.log('load(%s)', name);
            loading[name] = new Promise(function (resolve, reject) {
                createScriptNode((System.baseURL || '') + '/' + name + '.js', function (err) {
                    // The script has loaded, remove the lock.
                    delete loading[name];
                    if (anonymousEntry) {
                        // Call the specific registration function that was first called by the anonymous module.
                        // This should be either register() or define().
                        anonymousEntry[0].call(this, name, anonymousEntry[1], anonymousEntry[2]);
                        anonymousEntry = undefined;
                    }
                    // The module should be in the internal registry by now.
                    var mod = internalRegistry[name];
                    if (!mod) {
                        reject(new Error('Error loading module ' + name));
                        // return;
                    } else {
                        resolve(name);
                    }
                    // Don't resolve the dependencies until the module is imported.
                    // This allows multiple modules to be concatenated into one file.
                });
            });
        }
        return loading[name];
    }

    /**
     * Import all of the dependencies for a module.
     *
     * This function will load all of the dependencies, but will not execute them.
     * Execution should be done w
     *
     * @param {string} name The module to import the dependencies for.
     * @return {Promise}
     */
    function loadDependencies(name) {
        var mod = internalRegistry[name], depMod;

        if (!mod) {
            return Promise.reject(new Error('Module ' + name + ' not loaded'));
        }
        console.log('loadDependencies(%s)', name, mod.deps);

        // Resolve all of the dependencies of the module.
        return Promise.all(mod.deps.map(function (dep) {
            if (externalRegistry[dep] || /module|exports|require/.test(dep)) {
                // The dependency has been externally set so it should be ready.
                return Promise.resolve(dep);
            } else if (depMod = internalRegistry[dep]) {
                if (executed[dep]) {
                    // The dependency has been loaded and executed and is ready.
                    return Promise.resolve(dep);
                } else {
                    // Mark as seen to prevent infinite recursion.
                    executed[dep] = true;
                    // The dependency hasn't been executed. Check its dependencies.
                    return loadDependencies(dep).then(function (name) {
                        executed[dep] = false;
                        return name;
                    });
                }
            }
            // Load the dependencies and then recursively load its dependencies.
            return load(dep).then(loadDependencies);
        })).then(function () {
            return name;
        });
    }

    /**
     * Import a module.
     *
     * @param {string} name The name of the module to import.
     * @returns {Promise<Module>} Returns a promise that resolves to the imported module.
     */
    function importModule(name) {
        var normalizedName = normalizeName(name, []);
        var mod;

        if (mod = externalRegistry[normalizedName]) {
            // The module is external and is available.
            return Promise.resolve(mod);
        } else if (mod = internalRegistry[normalizedName]) {
            if (executed[normalizedName]) {
                // The module has been executed.
                return Promise.resolve(mod.exports);
            }
            // The dependency hasn't been executed. Check its dependencies.
            return loadDependencies(normalizedName).then(ensuredExecute);
        }
        return load(normalizedName).then(loadDependencies).then(ensuredExecute);
    }

    var System = {
        set: set,
        get: get,
        has: has,
        import: importModule,
        /**
         * Import all of the given modules.
         *
         * @name System.importAll
         * @function
         * @global
         * @param {string[]|...string} names The module names to import.
         * @returns {Promise} Returns a promise that resolves with an array of modules.
         */
        importAll: function (names) {
            if (!Array.isArray(names)) {
                names = [].slice.call(arguments);
            }

            // Keep a list of the subkeys requested from the module.
            var keys = [];
            return Promise.all(
                names.map(function (name) {
                    // Extract the key out of the module name.
                    var matches = /^(.+?)(\.([\w*]+))?$/.exec(name);
                    name = matches[1];
                    keys.push(matches[3] || 'default');

                    return importModule(name);
                })
            ).then(function (modules) {
                // The modules are now loaded so extract the keys.
                return modules.map(function (module, i) {
                    return keys[i] == '*' ? module : module[keys[i]];
                });
            });
        },
        register: register,
        amdDefine: define,
        amdRequire: function (deps, callback) {
            importModule(deps).spread(callback);
        }
    };

    // exporting the System object
    exports.System = System;
    exports.define = define;

    // Add a polyfill for Promise.spread() to make System.importAll() more useful.
    // Hat tip to: http://stackoverflow.com/a/22776850
    if (!Promise.prototype.spread) {
        Promise.prototype.spread = function (fn) {
            return this.then(function (args) {
                return Promise.all(args); // wait for all
            }).then(function (args) {
                //this is always undefined in A+ complaint, but just in case
                return fn.apply(this, args);
            });

        };

    }

})(window);