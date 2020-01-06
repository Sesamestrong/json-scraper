//Worry about prototype pollution

/**
 * Given a root (usually a snip), generate a string based on that root and the inputs. The input must be a regex of our format.
 */
const getString = (input, inputInfo) => {
  if (typeof input === "string") return input.replace(/\$\{([^{}]+)\}/g, (_, key) => inputInfo[key]);
  throw new TypeError("A string generation value must be a string.");
};

const replaceEachString = (root, inputInfo) =>
  Object.keys(root).reduce((last, next) => ({ ...last,
    [next]: (typeof root[next] === "string") ? getString(root[next], inputInfo) : replaceEachString(root[next], inputInfo),
  }), {});


//TODO refactor
const getVars = (input, prop, root) => ((typeof input) === "object") ?
  
    (obj => prop.startsWith("$")||prop.startsWith("%") ? (input instanceof Array ? { ...root,
      [prop.slice(1)]: input.map((elem, i) => getVars(elem, prop[0] + i, {})[i])
    } : { ...root,
      [prop.slice(1)]: obj
    }) : { ...root,
      ...obj
    })
(Object.keys(input).reduce((last, next) => getVars(input[next], next, last), {})): //If starts with $: add getVar'd input to root, else add all keys to root, but their values are all getVar'd) :
    (
      prop.startsWith("$")||prop.startsWith("%") ? { ...root,
        [prop.slice(1)]: input
      } :
      root
    );

    const setNames = (input, names) =>
      typeof input === "object" ?
      (
        input instanceof Array ?
        input.map(elem=>setNames(elem,names))
        :
        (Object.keys(input).reduce((last, prop) =>
          Object.keys(names).includes("$" + prop)||Object.keys(names).includes("%"+prop) ? { ...last,
            ["$" + prop]: setNames(input[prop], names["$" + prop])
          } :
          (
            Object.keys(names).includes(prop) ? { ...last,
              [prop]: setNames(input[prop], names[prop])
            } :
            last
          ), {}))) :
      (
        input
      );

    module.exports = {
      getString,
      replaceEachString,
      getVars,
      setNames,
    };
