!function(exports) {
    "use strict";
    function normalizeName(child, parentBase) {
        if ("/" === child.charAt(0)) child = child.slice(1);
        if ("." !== child.charAt(0)) return child;
        var parts = child.split("/");
        while ("." === parts[0] || ".." === parts[0]) if (".." === parts.shift()) parentBase.pop();
        return parentBase.concat(parts).join("/");
    }
    function ensuredExecute(name) {
        var mod = internalRegistry[name];
        if (mod && !executed[name]) executed[name] = true, mod.execute();
        return mod && mod.exports;
    }
    function set(name, exports) {
        if ("object" != typeof exports) exports = {
            "default": exports
        };
        externalRegistry[name] = exports;
    }
    function get(name) {
        return externalRegistry[name] || ensuredExecute(name);
    }
    function has(name) {
        return !!externalRegistry[name] || !!internalRegistry[name];
    }
    function queueAnonymous(callback, args) {
        var entry = [ callback ];
        entry.push.apply(entry, args), anonymousEntries.push(entry);
    }
    function register(name, deps, wrapper) {
        if (Array.isArray(name)) return void queueAnonymous(register, arguments);
        var mod, meta, exports = Object.create(null);
        internalRegistry[name] = mod = {
            exports: exports,
            deps: deps.map(function(dep) {
                return normalizeName(dep, name.split("/").slice(0, -1));
            }),
            dependants: [],
            update: function(moduleName, moduleObj) {
                meta.setters[mod.deps.indexOf(moduleName)](moduleObj);
            },
            execute: function() {
                mod.deps.map(function(dep) {
                    var imports = externalRegistry[dep];
                    if (imports) mod.update(dep, imports); else if (imports = get(dep) && internalRegistry[dep].exports) internalRegistry[dep].dependants.push(name), 
                    mod.update(dep, imports);
                }), meta.execute();
            }
        }, meta = wrapper(function(identifier, value) {
            return exports[identifier] = value, mod.lock = true, mod.dependants.forEach(function(moduleName) {
                if (internalRegistry[moduleName] && !internalRegistry[moduleName].lock) internalRegistry[moduleName].update(name, exports);
            }), mod.lock = false, value;
        });
    }
    function define(name, deps, factory) {
        if (Array.isArray(name) || "function" == typeof name) return void queueAnonymous(define, arguments);
        if ("function" == typeof deps) factory = deps, deps = [];
        var mod, exports = {};
        internalRegistry[name] = mod = {
            exports: exports,
            deps: deps.map(function(dep) {
                return normalizeName(dep, name.split("/").slice(0, -1));
            }),
            dependants: [],
            update: function(moduleName, moduleObj) {},
            execute: function() {
                var depValues = [];
                mod.deps.map(function(dep) {
                    var depValue;
                    if ("exports" === dep) depValue = mod.exports; else if ("module" === dep) depValue = mod; else if (depValue = externalRegistry[dep], 
                    !depValue) depValue = get(dep) && internalRegistry[dep].exports, depValue = depValue && depValue["default"];
                    depValues.push(depValue);
                });
                var r = factory.apply(null, depValues);
                if ("object" != typeof mod.exports) mod.exports = {
                    "default": mod.exports
                };
                if (r) exports["default"] = r;
                mod.lock = true, mod.dependants.forEach(function(moduleName) {
                    if (internalRegistry[moduleName] && !internalRegistry[moduleName].lock) internalRegistry[moduleName].update(name, exports);
                }), mod.lock = false;
            }
        };
    }
    function createScriptNode(src, callback) {
        var script = document.createElement("script");
        if (script.async) script.async = false;
        script.addEventListener("load", callback, false), script.src = src, headEl.appendChild(script);
    }
    function load(name) {
        if (!loading[name]) loading[name] = new Promise(function(resolve, reject) {
            createScriptNode((System.baseURL || "") + "/" + name + ".js", function(err) {
                if (delete loading[name], anonymousEntries.length) {
                    var anonymousEntry = anonymousEntries.shift();
                    anonymousEntry[0].call(this, name, anonymousEntry[1], anonymousEntry[2]);
                }
                var mod = internalRegistry[name];
                if (!mod) reject(new Error("Error loading module " + name)); else resolve(name);
            });
        });
        return loading[name];
    }
    function loadDependencies(name) {
        var depMod, mod = internalRegistry[name];
        if (!mod) return Promise.reject(new Error("Module " + name + " not loaded")); else return Promise.all(mod.deps.map(function(dep) {
            if (externalRegistry[dep] || /module|exports|require/.test(dep)) return Promise.resolve(dep); else if (depMod = internalRegistry[dep]) if (executed[dep]) return Promise.resolve(dep); else return executed[dep] = true, 
            loadDependencies(dep).then(function(name) {
                return executed[dep] = false, name;
            });
            return load(dep).then(loadDependencies);
        })).then(function() {
            return name;
        });
    }
    function importModule(name) {
        var mod, normalizedName = normalizeName(name, []);
        if (mod = externalRegistry[normalizedName]) return Promise.resolve(mod); else if (mod = internalRegistry[normalizedName]) if (executed[normalizedName]) return Promise.resolve(mod.exports); else return loadDependencies(normalizedName).then(ensuredExecute);
        return load(normalizedName).then(loadDependencies).then(ensuredExecute);
    }
    var headEl = document.getElementsByTagName("head")[0], loading = Object.create(null), executed = Object.create(null), internalRegistry = Object.create(null), externalRegistry = Object.create(null), anonymousEntries = [];
    define.amd = 1;
    var System = {
        set: set,
        get: get,
        has: has,
        "import": importModule,
        importAll: function(names) {
            if (!Array.isArray(names)) names = [].slice.call(arguments);
            var keys = [];
            return Promise.all(names.map(function(name) {
                var matches = /^(.+?)(\.([\w*]+))?$/.exec(name);
                return name = matches[1], keys.push(matches[3] || "default"), importModule(name);
            })).then(function(modules) {
                return modules.map(function(module, i) {
                    return "*" == keys[i] ? module : module[keys[i]];
                });
            });
        },
        register: register,
        amdDefine: define,
        amdRequire: function(deps, callback) {
            System.importAll(deps).spread(callback);
        }
    };
    if (exports.System = System, exports.define = define, !Promise.prototype.spread) Promise.prototype.spread = function(fn) {
        return this.then(function(args) {
            return Promise.all(args);
        }).then(function(args) {
            return fn.apply(this, args);
        });
    };
}(window);